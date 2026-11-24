import { DAY } from "../market/simulator";
import {
  deposit,
  emptyAccount,
  executeOrder,
  type AccountState,
  type OrderRequest,
  type PriceFn,
} from "./engine";
import { contractId, expiriesAt, multiplier, parseContract, quoteOption, strikesFor } from "../market/options";
import { executeOptionOrder } from "./options-trading";
import { placePendingOrder } from "./orders";

export const STARTING_CASH = 10_000;

/** A fresh account with only starting cash. */
export function createFreshAccount(now: number): AccountState {
  const r = deposit(emptyAccount(), STARTING_CASH, now);
  if (!r.ok) throw new Error(r.error);
  return { ...r.value, watchlist: ["VWCE", "AAPL", "BTC"] };
}

type Step =
  | { daysAgo: number; deposit: number }
  | { daysAgo: number; order: OrderRequest };

const DEMO_STEPS: Step[] = [
  { daysAgo: 210, deposit: STARTING_CASH },
  { daysAgo: 209, order: { symbol: "VWCE", side: "buy", mode: "amount", value: 2500 } },
  { daysAgo: 180, order: { symbol: "AAPL", side: "buy", mode: "amount", value: 800 } },
  { daysAgo: 150, order: { symbol: "NVDA", side: "buy", mode: "amount", value: 900 } },
  { daysAgo: 120, order: { symbol: "ASML", side: "buy", mode: "amount", value: 700 } },
  { daysAgo: 90, order: { symbol: "BTC", side: "buy", mode: "amount", value: 500 } },
  { daysAgo: 60, order: { symbol: "MSFT", side: "buy", mode: "amount", value: 600 } },
  { daysAgo: 45, order: { symbol: "VWCE", side: "buy", mode: "amount", value: 500 } },
  { daysAgo: 30, order: { symbol: "NVDA", side: "sell", mode: "amount", value: 300 } },
  { daysAgo: 20, deposit: 500 },
  { daysAgo: 7, order: { symbol: "KBC", side: "buy", mode: "amount", value: 400 } },
];

/**
 * A demo account with ~7 months of history, so charts and P/L look alive from the
 * first second. Prices come from the simulator, so the history is consistent.
 */
export function createDemoAccount(now: number, price: PriceFn): AccountState {
  let state = emptyAccount();
  for (const step of DEMO_STEPS) {
    // Snap to a round minute so the log looks tidy.
    const t = Math.floor((now - step.daysAgo * DAY) / 60_000) * 60_000;
    if ("deposit" in step) {
      const r = deposit(state, step.deposit, t);
      if (r.ok) state = r.value;
    } else {
      const r = executeOrder(state, step.order, price(step.order.symbol, t), t);
      if (r.ok) state = r.value.state;
    }
  }
  // One option position: an NVIDIA call bought 10 days ago that hasn't expired yet.
  const boughtAt = Math.floor((now - 10 * 86_400_000) / 60_000) * 60_000;
  const expiry = expiriesAt(boughtAt).find((e) => e > now + 7 * 86_400_000);
  if (expiry) {
    const strike = strikesFor(price("NVDA", boughtAt))[7]; // just out of the money
    const id = contractId("NVDA", "call", strike, expiry);
    const r = executeOptionOrder(state, { contract: id, side: "buy", quantity: 1 }, quoteOption(parseContract(id), boughtAt), multiplier("NVDA"), boughtAt);
    if (r.ok) state = r.value.state;
  }

  // A couple of open orders so the order features are visible straight away.
  const pending = [
    { symbol: "TSLA", side: "buy", type: "limit", mode: "amount", value: 500, factor: 0.92 },
    { symbol: "NVDA", side: "sell", type: "stop", mode: "quantity", value: 1, factor: 0.88 },
  ] as const;
  for (const p of pending) {
    const triggerPrice = Math.round(price(p.symbol, now) * p.factor * 100) / 100;
    const r = placePendingOrder(state, { ...p, triggerPrice, expiresAt: null }, now);
    if (r.ok) state = r.value.state;
  }
  return { ...state, ordersCheckedAt: now, watchlist: ["TSLA", "SAP", "ETH", "CSPX"] };
}
