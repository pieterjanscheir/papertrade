/**
 * Pure trading logic: no React, no storage, no clock. Every function takes the
 * current state and returns a new one, which makes it easy to test (see
 * engine.test.ts) and to move to a server later.
 */

export const ORDER_FEE = 1; // flat EUR fee per trade
export const MIN_ORDER_EUR = 1;
export const QTY_DECIMALS = 6;

export type TxType = "deposit" | "withdrawal" | "buy" | "sell";

export interface Transaction {
  id: string;
  type: TxType;
  time: number;
  /** Cash movement before fees, always positive. */
  amount: number;
  fee: number;
  symbol?: string;
  quantity?: number;
  price?: number;
  /** Only on sells: profit/loss versus average cost, after fee. */
  realizedPnl?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  /** Average price paid per unit, fees included. */
  avgCost: number;
}

export interface AccountState {
  cash: number;
  positions: Record<string, Position>;
  transactions: Transaction[];
  watchlist: string[];
  /** Limit/stop orders, open and historical. See orders.ts. */
  orders: Order[];
  /** Up to which moment open orders have been checked against prices. */
  ordersCheckedAt: number;
}

export type OrderType = "market" | "limit" | "stop";
export type OrderStatus = "open" | "filled" | "cancelled" | "expired" | "rejected";

export interface Order {
  id: string;
  symbol: string;
  side: Side;
  type: Exclude<OrderType, "market">;
  quantity: number;
  /** Limit price (limit orders) or stop price (stop orders). */
  triggerPrice: number;
  createdAt: number;
  /** null = good till cancelled. */
  expiresAt: number | null;
  status: OrderStatus;
  closedAt?: number;
  fillPrice?: number;
  /** Why it was rejected, e.g. not enough cash when it triggered. */
  reason?: string;
}

export type Side = "buy" | "sell";

export interface OrderRequest {
  symbol: string;
  side: Side;
  /** "amount" = value in EUR, "quantity" = number of units (fractions allowed). */
  mode: "amount" | "quantity";
  value: number;
}

export interface OrderPreview {
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
  gross: number;
  fee: number;
  /** Cash that leaves (buy) or enters (sell) the account. */
  net: number;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const EPS = 1e-9;

export function roundQty(q: number): number {
  const f = 10 ** QTY_DECIMALS;
  return Math.floor(q * f + EPS) / f;
}

export function roundCash(x: number): number {
  return Math.round(x * 100) / 100;
}

export function emptyAccount(): AccountState {
  return { cash: 0, positions: {}, transactions: [], watchlist: [], orders: [], ordersCheckedAt: 0 };
}

let counter = 0;
export function makeId(time: number): string {
  counter = (counter + 1) % 1_000_000;
  return `${time.toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Cash not earmarked for open buy orders. */
export function availableCash(state: AccountState): number {
  const committed = (state.orders ?? [])
    .filter((o) => o.status === "open" && o.side === "buy")
    .reduce((s, o) => s + o.quantity * o.triggerPrice + ORDER_FEE, 0);
  return Math.max(0, roundCash(state.cash - committed));
}

/** Units not already promised to open sell orders. */
export function availableQuantity(state: AccountState, symbol: string): number {
  const held = state.positions[symbol]?.quantity ?? 0;
  const promised = (state.orders ?? [])
    .filter((o) => o.status === "open" && o.side === "sell" && o.symbol === symbol)
    .reduce((s, o) => s + o.quantity, 0);
  return Math.max(0, roundQty(held - promised));
}

export function previewOrder(
  state: AccountState,
  req: OrderRequest,
  price: number,
): Result<OrderPreview> {
  if (!(price > 0)) return { ok: false, error: "No price available" };
  if (!(req.value > 0)) return { ok: false, error: "Enter an amount" };

  const quantity = roundQty(req.mode === "amount" ? req.value / price : req.value);
  if (quantity <= 0) return { ok: false, error: "Amount too small" };

  const gross = roundCash(quantity * price);
  if (gross < MIN_ORDER_EUR) return { ok: false, error: `Minimum order is €${MIN_ORDER_EUR}` };

  const fee = ORDER_FEE;

  if (req.side === "buy") {
    const net = roundCash(gross + fee);
    if (net > state.cash + EPS) return { ok: false, error: "Not enough cash" };
    if (net > availableCash(state) + EPS) return { ok: false, error: "Cash is reserved for open orders" };
    return { ok: true, value: { symbol: req.symbol, side: "buy", quantity, price, gross, fee, net } };
  }

  const held = state.positions[req.symbol]?.quantity ?? 0;
  if (quantity > held + EPS) return { ok: false, error: "You don't own that many" };
  if (quantity > availableQuantity(state, req.symbol) + EPS) {
    return { ok: false, error: "Some units are reserved for open sell orders" };
  }
  const net = roundCash(gross - fee);
  if (net <= 0) return { ok: false, error: "Amount doesn't cover the fee" };
  return { ok: true, value: { symbol: req.symbol, side: "sell", quantity, price, gross, fee, net } };
}

export function executeOrder(
  state: AccountState,
  req: OrderRequest,
  price: number,
  time: number,
): Result<{ state: AccountState; tx: Transaction }> {
  const preview = previewOrder(state, req, price);
  if (!preview.ok) return preview;
  const p = preview.value;
  const existing = state.positions[p.symbol];
  const positions = { ...state.positions };
  let realizedPnl: number | undefined;

  if (p.side === "buy") {
    const prevQty = existing?.quantity ?? 0;
    const prevCost = (existing?.avgCost ?? 0) * prevQty;
    const quantity = roundQty(prevQty + p.quantity);
    positions[p.symbol] = { symbol: p.symbol, quantity, avgCost: (prevCost + p.net) / quantity };
  } else {
    const avgCost = existing!.avgCost;
    realizedPnl = roundCash(p.net - avgCost * p.quantity);
    const quantity = roundQty(existing!.quantity - p.quantity);
    if (quantity <= EPS) delete positions[p.symbol];
    else positions[p.symbol] = { ...existing!, quantity };
  }

  const tx: Transaction = {
    id: makeId(time),
    type: p.side,
    time,
    amount: p.gross,
    fee: p.fee,
    symbol: p.symbol,
    quantity: p.quantity,
    price: p.price,
    realizedPnl,
  };

  return {
    ok: true,
    value: {
      tx,
      state: {
        ...state,
        cash: roundCash(state.cash + (p.side === "buy" ? -p.net : p.net)),
        positions,
        transactions: [...state.transactions, tx],
      },
    },
  };
}

export function deposit(state: AccountState, amount: number, time: number): Result<AccountState> {
  if (!(amount > 0)) return { ok: false, error: "Enter an amount" };
  const tx: Transaction = { id: makeId(time), type: "deposit", time, amount: roundCash(amount), fee: 0 };
  return {
    ok: true,
    value: { ...state, cash: roundCash(state.cash + amount), transactions: [...state.transactions, tx] },
  };
}

export function withdraw(state: AccountState, amount: number, time: number): Result<AccountState> {
  if (!(amount > 0)) return { ok: false, error: "Enter an amount" };
  if (amount > state.cash + EPS) return { ok: false, error: "Not enough cash" };
  const tx: Transaction = { id: makeId(time), type: "withdrawal", time, amount: roundCash(amount), fee: 0 };
  return {
    ok: true,
    value: { ...state, cash: roundCash(state.cash - amount), transactions: [...state.transactions, tx] },
  };
}

export function toggleWatch(state: AccountState, symbol: string): AccountState {
  const has = state.watchlist.includes(symbol);
  return {
    ...state,
    watchlist: has ? state.watchlist.filter((s) => s !== symbol) : [...state.watchlist, symbol],
  };
}

// ---------------------------------------------------------------------------
// Valuation
// ---------------------------------------------------------------------------

export type PriceFn = (symbol: string, t: number) => number;

export interface HoldingValue extends Position {
  price: number;
  value: number;
  costBasis: number;
  pnl: number;
  pnlPct: number;
}

export interface PortfolioSummary {
  cash: number;
  invested: number;
  total: number;
  costBasis: number;
  pnl: number;
  pnlPct: number;
  holdings: HoldingValue[];
}

export function summarize(state: AccountState, price: PriceFn, t: number): PortfolioSummary {
  const holdings = Object.values(state.positions)
    .map((pos) => {
      const p = price(pos.symbol, t);
      const value = pos.quantity * p;
      const costBasis = pos.quantity * pos.avgCost;
      const pnl = value - costBasis;
      return { ...pos, price: p, value, costBasis, pnl, pnlPct: costBasis ? pnl / costBasis : 0 };
    })
    .sort((a, b) => b.value - a.value);

  const invested = holdings.reduce((s, h) => s + h.value, 0);
  const costBasis = holdings.reduce((s, h) => s + h.costBasis, 0);
  const pnl = invested - costBasis;
  return {
    cash: state.cash,
    invested,
    total: state.cash + invested,
    costBasis,
    pnl,
    pnlPct: costBasis ? pnl / costBasis : 0,
    holdings,
  };
}

/**
 * Value of the account at each timestamp, by replaying the transaction log against
 * historical prices. Works because simulated prices are known for any moment.
 * `times` must be sorted ascending.
 */
export function valueHistory(
  transactions: Transaction[],
  times: number[],
  price: PriceFn,
): { t: number; value: number }[] {
  const txs = [...transactions].sort((a, b) => a.time - b.time);
  let cash = 0;
  const qty: Record<string, number> = {};
  let i = 0;
  return times.map((t) => {
    while (i < txs.length && txs[i].time <= t) {
      const tx = txs[i++];
      if (tx.type === "deposit") cash += tx.amount;
      else if (tx.type === "withdrawal") cash -= tx.amount;
      else if (tx.type === "buy") {
        cash -= tx.amount + tx.fee;
        qty[tx.symbol!] = (qty[tx.symbol!] ?? 0) + tx.quantity!;
      } else if (tx.type === "sell") {
        cash += tx.amount - tx.fee;
        qty[tx.symbol!] = (qty[tx.symbol!] ?? 0) - tx.quantity!;
      }
    }
    let value = cash;
    for (const s in qty) if (qty[s] > EPS) value += qty[s] * price(s, t);
    return { t, value };
  });
}

/** Total money put in minus money taken out, up to time t. */
export function netDeposits(transactions: Transaction[], t = Infinity): number {
  return transactions.reduce((s, tx) => {
    if (tx.time > t) return s;
    if (tx.type === "deposit") return s + tx.amount;
    if (tx.type === "withdrawal") return s - tx.amount;
    return s;
  }, 0);
}
