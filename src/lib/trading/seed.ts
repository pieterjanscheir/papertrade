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
import { executeOptionOrder, settleExpiredOptions } from "./options-trading";
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

// ---------------------------------------------------------------------------
// Preset accounts: personalities with a full trading history, generated from
// the simulated prices so every chart and P/L number is consistent.
// ---------------------------------------------------------------------------

export type PresetId = "demo" | "fresh" | "panic" | "oracle" | "daytrader" | "hodler" | "index" | "gambler";

export const PRESETS: { id: PresetId; name: string; emoji: string; description: string }[] = [
  { id: "demo", name: "Demo portfolio", emoji: "✨", description: "7 months of sensible-ish history, an option and two open orders." },
  { id: "fresh", name: "Empty account", emoji: "🧾", description: "€10,000 in cash and a clean slate." },
  { id: "panic", name: "The Panic Seller", emoji: "😱", description: "Buys every top, sells every bottom. A masterclass in what not to do." },
  { id: "oracle", name: "The Oracle", emoji: "🔮", description: "Buys every dip, sells every peak. Suspiciously good. Possibly a time traveller." },
  { id: "daytrader", name: "The Day Trader", emoji: "⚡", description: "Hundreds of trades in two months. The fees send their regards." },
  { id: "hodler", name: "Diamond Hands", emoji: "💎", description: "Bought crypto and hype stocks, never sold anything. Ever." },
  { id: "index", name: "The Boring Index Investor", emoji: "🐢", description: "€500 into a world ETF every month for three years. Yawn. Works." },
  { id: "gambler", name: "The Options Gambler", emoji: "🎰", description: "Weekly lottery tickets: short-dated calls that mostly expire worthless." },
];

const D = 86_400_000;
const snap = (t: number) => Math.floor(t / 60_000) * 60_000;

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function buy(state: AccountState, symbol: string, eur: number, t: number, price: PriceFn): AccountState {
  const value = Math.min(eur, state.cash - 2);
  if (value < 5) return state;
  const r = executeOrder(state, { symbol, side: "buy", mode: "amount", value }, price(symbol, t), t);
  return r.ok ? r.value.state : state;
}

function sellAll(state: AccountState, symbol: string, t: number, price: PriceFn): AccountState {
  const held = state.positions[symbol]?.quantity ?? 0;
  if (!held) return state;
  const r = executeOrder(state, { symbol, side: "sell", mode: "quantity", value: held }, price(symbol, t), t);
  return r.ok ? r.value.state : state;
}

function funded(amount: number, t: number): AccountState {
  const r = deposit(emptyAccount(), amount, t);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/** Extreme price within [from, to], sampled every 6 hours. */
function extreme(symbol: string, from: number, to: number, price: PriceFn, kind: "max" | "min") {
  let best = from;
  for (let t = from; t <= to; t += D / 4) {
    const better = kind === "max" ? price(symbol, t) > price(symbol, best) : price(symbol, t) < price(symbol, best);
    if (better) best = t;
  }
  return snap(best);
}

const VOLATILE = ["TSLA", "NVDA", "BTC", "PLTR", "ZAL", "ETH", "SOL", "AMD", "BESI", "ASM", "ADYEN", "UMI"];

/** Buy at one extreme and sell at the other, in 20-day rounds. */
function swingTrader(now: number, price: PriceFn, buyAt: "max" | "min", seed: string): AccountState {
  const rand = seeded(seed);
  const start = now - 300 * D;
  let state = funded(STARTING_CASH, start);
  for (let round = 0; round < 14; round++) {
    const t0 = start + round * 20 * D + D;
    const symbol = VOLATILE[Math.floor(rand() * VOLATILE.length)];
    const tBuy = extreme(symbol, t0, t0 + 9 * D, price, buyAt);
    const tSell = extreme(symbol, tBuy + D, t0 + 19 * D, price, buyAt === "max" ? "min" : "max");
    const stake = buyAt === "min" ? state.cash * 0.6 : Math.min(2000, state.cash * 0.5);
    state = buy(state, symbol, stake, tBuy, price);
    state = sellAll(state, symbol, tSell, price);
  }
  return state;
}

function dayTrader(now: number, price: PriceFn): AccountState {
  const rand = seeded("daytrader");
  const start = now - 60 * D;
  let state = funded(STARTING_CASH, start);
  const symbols = [...VOLATILE, "AAPL", "MSFT", "META", "SAP", "KBC", "INGA", "DTE"];
  for (let t = start + 2 * 3_600_000; t < now - 3_600_000; t += 5 * 3_600_000) {
    const symbol = symbols[Math.floor(rand() * symbols.length)];
    state = buy(state, symbol, 200 + rand() * 600, snap(t), price);
    state = sellAll(state, symbol, snap(t + (1 + rand() * 3) * 3_600_000), price);
  }
  return state;
}

function diamondHands(now: number, price: PriceFn): AccountState {
  let state = funded(STARTING_CASH, now - 400 * D);
  const buys: [string, number, number][] = [
    ["BTC", 3000, 390],
    ["ETH", 2000, 330],
    ["SOL", 1200, 280],
    ["TSLA", 1500, 220],
    ["PLTR", 1000, 160],
    ["ZAL", 600, 90],
    ["SOL", 500, 30],
  ];
  for (const [symbol, eur, daysAgo] of buys) state = buy(state, symbol, eur, snap(now - daysAgo * D), price);
  return state;
}

function indexInvestor(now: number, price: PriceFn): AccountState {
  const start = now - 36 * 30 * D;
  let state = funded(500, start);
  for (let m = 0; m < 36; m++) {
    const t = snap(start + m * 30 * D + D);
    if (m > 0) {
      const r = deposit(state, 500, t);
      if (r.ok) state = r.value;
    }
    state = buy(state, m % 4 === 3 ? "IWDA" : "VWCE", 499, t + 60_000, price);
  }
  return state;
}

function optionsGambler(now: number, price: PriceFn): AccountState {
  const rand = seeded("gambler");
  const start = now - 140 * D;
  let state = funded(STARTING_CASH, start);
  const settle = (s: AccountState, t: number) =>
    settleExpiredOptions(
      s,
      t,
      (id) => parseContract(id).expiry,
      (id) => quoteOption(parseContract(id), parseContract(id).expiry).intrinsic,
      (id) => multiplier(id.split("|")[0]),
    ).state;

  for (let t = start + D; t < now; t += 7 * D) {
    state = settle(state, t);
    const symbol = ["NVDA", "TSLA", "AMD", "PLTR", "ZAL", "INTC"][Math.floor(rand() * 6)];
    const expiry = expiriesAt(t)[0];
    const strike = strikesFor(price(symbol, t))[8 + Math.floor(rand() * 3)]; // 2–4 strikes out of the money
    const id = contractId(symbol, "call", strike, expiry);
    const q = quoteOption(parseContract(id), t);
    const contracts = Math.max(1, Math.min(5, Math.floor(400 / Math.max(q.ask * multiplier(symbol), 1))));
    const r = executeOptionOrder(state, { contract: id, side: "buy", quantity: contracts }, q, multiplier(symbol), snap(t));
    if (r.ok) state = r.value.state;
  }
  return settle(state, now);
}

export function createPresetAccount(id: PresetId, now: number, price: PriceFn): AccountState {
  const watch: Record<PresetId, string[]> = {
    demo: ["TSLA", "SAP", "ETH", "CSPX"],
    fresh: ["VWCE", "AAPL", "BTC"],
    panic: ["TSLA", "BTC", "NVDA"],
    oracle: ["ANTH", "NVDA", "BTC"],
    daytrader: ["TSLA", "AMD", "PLTR", "ZAL"],
    hodler: ["BTC", "ETH", "SOL", "ANTH"],
    index: ["VWCE", "IWDA", "CSPX"],
    gambler: ["NVDA", "TSLA", "AMD"],
  };
  const state =
    id === "demo"
      ? createDemoAccount(now, price)
      : id === "fresh"
        ? createFreshAccount(now)
        : id === "panic"
          ? swingTrader(now, price, "max", "panic")
          : id === "oracle"
            ? swingTrader(now, price, "min", "oracle")
            : id === "daytrader"
              ? dayTrader(now, price)
              : id === "hodler"
                ? diamondHands(now, price)
                : id === "index"
                  ? indexInvestor(now, price)
                  : optionsGambler(now, price);
  return { ...state, ordersCheckedAt: now, watchlist: watch[id] };
}
