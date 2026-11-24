/**
 * Limit and stop orders.
 *
 *  - Limit buy  @ X: buy when the price drops to X or lower.
 *  - Limit sell @ X: sell when the price rises to X or higher (take profit).
 *  - Stop buy   @ X: buy when the price rises to X or higher (breakout).
 *  - Stop sell  @ X: sell when the price drops to X or lower (stop-loss).
 *
 * Once triggered, the order fills at the market price at that moment, like a real
 * broker. A stop-loss can therefore fill a bit below its stop price (slippage).
 *
 * Because simulated prices are known for every past moment, orders also fill
 * "while you were away": when the app opens again, `processOrders` scans the time
 * since the last check and fills each order at the exact minute it triggered.
 */

import {
  availableCash,
  availableQuantity,
  executeOrder,
  makeId,
  MIN_ORDER_EUR,
  ORDER_FEE,
  roundCash,
  roundQty,
  type AccountState,
  type Order,
  type PriceFn,
  type Result,
  type Side,
  type Transaction,
} from "./engine";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
/** Don't scan further back than this when catching up. */
const MAX_CATCH_UP = 90 * DAY;

export { availableCash, availableQuantity };

export interface PendingOrderRequest {
  symbol: string;
  side: Side;
  type: "limit" | "stop";
  mode: "amount" | "quantity";
  value: number;
  triggerPrice: number;
  /** null = good till cancelled. */
  expiresAt: number | null;
}

export function isTriggered(o: Pick<Order, "side" | "type" | "triggerPrice">, price: number): boolean {
  const below = price <= o.triggerPrice;
  const above = price >= o.triggerPrice;
  if (o.type === "limit") return o.side === "buy" ? below : above;
  return o.side === "buy" ? above : below;
}

/** Plain-language description of when an order fires. */
export function describeTrigger(o: Pick<Order, "side" | "type">): string {
  if (o.type === "limit") return o.side === "buy" ? "Buys when the price drops to" : "Sells when the price rises to";
  return o.side === "buy" ? "Buys when the price rises to" : "Sells when the price drops to";
}

export function openOrders(state: AccountState, symbol?: string): Order[] {
  return state.orders.filter((o) => o.status === "open" && (!symbol || o.symbol === symbol));
}

export interface PendingPreview {
  quantity: number;
  /** Estimated value at the trigger price. */
  gross: number;
  fee: number;
  net: number;
}

export function previewPendingOrder(state: AccountState, req: PendingOrderRequest): Result<PendingPreview> {
  if (!(req.triggerPrice > 0)) return { ok: false, error: `Enter a ${req.type} price` };
  if (!(req.value > 0)) return { ok: false, error: "Enter an amount" };
  const quantity = roundQty(req.mode === "amount" ? req.value / req.triggerPrice : req.value);
  if (quantity <= 0) return { ok: false, error: "Amount too small" };
  const gross = roundCash(quantity * req.triggerPrice);
  if (gross < MIN_ORDER_EUR) return { ok: false, error: `Minimum order is €${MIN_ORDER_EUR}` };
  const fee = ORDER_FEE;

  if (req.side === "buy") {
    const net = roundCash(gross + fee);
    if (net > availableCash(state) + 1e-9) return { ok: false, error: "Not enough available cash" };
    return { ok: true, value: { quantity, gross, fee, net } };
  }
  if (quantity > availableQuantity(state, req.symbol) + 1e-9) {
    return { ok: false, error: "You don't have that many available to sell" };
  }
  const net = roundCash(gross - fee);
  if (net <= 0) return { ok: false, error: "Amount doesn't cover the fee" };
  return { ok: true, value: { quantity, gross, fee, net } };
}

export function placePendingOrder(
  state: AccountState,
  req: PendingOrderRequest,
  now: number,
): Result<{ state: AccountState; order: Order }> {
  const preview = previewPendingOrder(state, req);
  if (!preview.ok) return preview;
  if (req.expiresAt !== null && req.expiresAt <= now) return { ok: false, error: "Expiry must be in the future" };
  const order: Order = {
    id: makeId(now),
    symbol: req.symbol,
    side: req.side,
    type: req.type,
    quantity: preview.value.quantity,
    triggerPrice: req.triggerPrice,
    createdAt: now,
    expiresAt: req.expiresAt,
    status: "open",
  };
  return { ok: true, value: { order, state: { ...state, orders: [...state.orders, order] } } };
}

export function cancelOrder(state: AccountState, id: string, now: number): AccountState {
  return {
    ...state,
    orders: state.orders.map((o) => (o.id === id && o.status === "open" ? { ...o, status: "cancelled", closedAt: now } : o)),
  };
}

export type OrderEvent =
  | { kind: "filled"; order: Order; tx: Transaction }
  | { kind: "rejected"; order: Order }
  | { kind: "expired"; order: Order };

/** First moment in (from, to] at which the order triggers, or null. */
function findTrigger(order: Order, price: PriceFn, from: number, to: number): number | null {
  if (to <= from) return null;
  const step = to - from > 2 * DAY ? 5 * MINUTE : MINUTE;
  for (let t = from + step; t < to; t += step) {
    if (isTriggered(order, price(order.symbol, t))) return t;
  }
  return isTriggered(order, price(order.symbol, to)) ? to : null;
}

/**
 * Check every open order against prices between the last check and `now`, and
 * fill, reject or expire them in chronological order. Call this on every tick.
 */
export function processOrders(
  state: AccountState,
  price: PriceFn,
  now: number,
): { state: AccountState; events: OrderEvent[] } {
  const open = openOrders(state);
  if (open.length === 0) return { state: { ...state, ordersCheckedAt: now }, events: [] };

  const lastCheck = Math.max(state.ordersCheckedAt || 0, now - MAX_CATCH_UP);
  const hits: { order: Order; t: number }[] = [];
  for (const order of open) {
    const from = Math.max(lastCheck, order.createdAt);
    const to = Math.min(now, order.expiresAt ?? now);
    const t = findTrigger(order, price, from, to);
    if (t !== null) hits.push({ order, t });
  }
  hits.sort((a, b) => a.t - b.t);

  let next = state;
  const events: OrderEvent[] = [];
  const update = (id: string, patch: Partial<Order>) => {
    next = { ...next, orders: next.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) };
  };

  for (const { order, t } of hits) {
    const fillPrice = price(order.symbol, t);
    // Take the order out of the "open" set first so it doesn't reserve against itself.
    update(order.id, { status: "filled" });
    const r = executeOrder(next, { symbol: order.symbol, side: order.side, mode: "quantity", value: order.quantity }, fillPrice, t);
    if (r.ok) {
      next = r.value.state;
      update(order.id, { status: "filled", closedAt: t, fillPrice });
      events.push({ kind: "filled", order: { ...order, status: "filled", closedAt: t, fillPrice }, tx: r.value.tx });
    } else {
      update(order.id, { status: "rejected", closedAt: t, reason: r.error });
      events.push({ kind: "rejected", order: { ...order, status: "rejected", closedAt: t, reason: r.error } });
    }
  }

  for (const order of openOrders(next)) {
    if (order.expiresAt !== null && order.expiresAt <= now) {
      update(order.id, { status: "expired", closedAt: order.expiresAt });
      events.push({ kind: "expired", order });
    }
  }

  return { state: { ...next, ordersCheckedAt: now }, events };
}
