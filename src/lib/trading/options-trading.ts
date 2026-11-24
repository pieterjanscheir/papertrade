/**
 * Option trading rules: buy to open, sell to close (no writing/short options), and
 * cash settlement at expiry. Pure functions; quotes and multipliers are passed in.
 */

import {
  availableCash,
  makeId,
  ORDER_FEE,
  roundCash,
  type AccountState,
  type OptionPosition,
  type Result,
  type Transaction,
} from "./engine";

export interface OptionOrderRequest {
  contract: string;
  side: "buy" | "sell";
  /** Number of contracts (whole numbers). */
  quantity: number;
}

export interface OptionQuoteLike {
  bid: number;
  ask: number;
  expired: boolean;
}

export interface OptionOrderPreview {
  /** Premium per share used for the fill. */
  premium: number;
  gross: number;
  fee: number;
  net: number;
}

export function previewOptionOrder(
  state: AccountState,
  req: OptionOrderRequest,
  quote: OptionQuoteLike,
  multiplier: number,
): Result<OptionOrderPreview> {
  if (quote.expired) return { ok: false, error: "This option has expired" };
  if (!Number.isInteger(req.quantity) || req.quantity <= 0) return { ok: false, error: "Enter a whole number of contracts" };
  const premium = req.side === "buy" ? quote.ask : quote.bid;
  if (!(premium > 0)) return { ok: false, error: req.side === "buy" ? "No price available" : "Nobody will pay anything for this right now" };
  const gross = roundCash(premium * multiplier * req.quantity);
  const fee = ORDER_FEE;
  if (req.side === "buy") {
    const net = roundCash(gross + fee);
    if (net > availableCash(state) + 1e-9) return { ok: false, error: "Not enough available cash" };
    return { ok: true, value: { premium, gross, fee, net } };
  }
  const held = state.optionPositions?.[req.contract]?.quantity ?? 0;
  if (req.quantity > held) return { ok: false, error: "You can only sell contracts you own" };
  const net = roundCash(gross - fee);
  if (net <= 0) return { ok: false, error: "Proceeds don't cover the fee" };
  return { ok: true, value: { premium, gross, fee, net } };
}

export function executeOptionOrder(
  state: AccountState,
  req: OptionOrderRequest,
  quote: OptionQuoteLike,
  multiplier: number,
  time: number,
): Result<{ state: AccountState; tx: Transaction }> {
  const preview = previewOptionOrder(state, req, quote, multiplier);
  if (!preview.ok) return preview;
  const p = preview.value;
  const positions = { ...(state.optionPositions ?? {}) };
  const existing = positions[req.contract];
  let realizedPnl: number | undefined;

  if (req.side === "buy") {
    const qty = (existing?.quantity ?? 0) + req.quantity;
    const cost = (existing?.avgCost ?? 0) * (existing?.quantity ?? 0) + p.net;
    positions[req.contract] = { contract: req.contract, quantity: qty, avgCost: cost / qty };
  } else {
    realizedPnl = roundCash(p.net - existing!.avgCost * req.quantity);
    const qty = existing!.quantity - req.quantity;
    if (qty <= 0) delete positions[req.contract];
    else positions[req.contract] = { ...existing!, quantity: qty };
  }

  const tx: Transaction = {
    id: makeId(time),
    type: req.side === "buy" ? "option_buy" : "option_sell",
    time,
    amount: p.gross,
    fee: p.fee,
    symbol: req.contract.split("|")[0],
    contract: req.contract,
    quantity: req.quantity,
    price: p.premium,
    realizedPnl,
  };
  return {
    ok: true,
    value: {
      tx,
      state: {
        ...state,
        cash: roundCash(state.cash + (req.side === "buy" ? -p.net : p.net)),
        optionPositions: positions,
        transactions: [...state.transactions, tx],
      },
    },
  };
}

export interface OptionSettlement {
  position: OptionPosition;
  tx: Transaction;
}

/**
 * Cash-settle every option whose expiry has passed: pay out intrinsic value at the
 * expiry moment (or nothing, if it expired out of the money).
 */
export function settleExpiredOptions(
  state: AccountState,
  now: number,
  expiryOf: (contract: string) => number,
  intrinsicAtExpiry: (contract: string) => number,
  multiplier: (contract: string) => number,
): { state: AccountState; settled: OptionSettlement[] } {
  const positions = { ...(state.optionPositions ?? {}) };
  const settled: OptionSettlement[] = [];
  let cash = state.cash;
  const txs: Transaction[] = [];

  for (const pos of Object.values(positions)) {
    const expiry = expiryOf(pos.contract);
    if (expiry > now) continue;
    const amount = roundCash(intrinsicAtExpiry(pos.contract) * multiplier(pos.contract) * pos.quantity);
    const tx: Transaction = {
      id: makeId(expiry),
      type: "option_settle",
      time: expiry,
      amount,
      fee: 0,
      symbol: pos.contract.split("|")[0],
      contract: pos.contract,
      quantity: pos.quantity,
      price: amount / (multiplier(pos.contract) * pos.quantity),
      realizedPnl: roundCash(amount - pos.avgCost * pos.quantity),
    };
    cash = roundCash(cash + amount);
    txs.push(tx);
    settled.push({ position: pos, tx });
    delete positions[pos.contract];
  }

  if (settled.length === 0) return { state, settled };
  return { state: { ...state, cash, optionPositions: positions, transactions: [...state.transactions, ...txs] }, settled };
}
