import { describe, expect, it } from "vitest";
import { priceAt, quoteAt, DAY } from "../market/simulator";
import {
  deposit,
  emptyAccount,
  executeOrder,
  ORDER_FEE,
  previewOrder,
  summarize,
  valueHistory,
  withdraw,
  type AccountState,
} from "./engine";
import { createDemoAccount } from "./seed";

const T = Date.UTC(2026, 5, 1);

function funded(cash = 1000): AccountState {
  const r = deposit(emptyAccount(), cash, T);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

describe("simulator", () => {
  it("is deterministic", () => {
    expect(priceAt("AAPL", T)).toBe(priceAt("AAPL", T));
  });

  it("produces positive, plausible prices over years", () => {
    for (let i = 0; i < 500; i++) {
      const p = priceAt("TSLA", T + i * 7 * DAY);
      expect(p).toBeGreaterThan(0);
    }
  });

  it("computes a 24h quote", () => {
    const q = quoteAt("BTC", T);
    expect(q.previousClose).toBe(priceAt("BTC", T - DAY));
    expect(q.change).toBeCloseTo(q.price - q.previousClose);
  });

  it("throws on unknown symbols", () => {
    expect(() => priceAt("NOPE", T)).toThrow();
  });
});

describe("orders", () => {
  it("buys by amount with a fee", () => {
    const r = executeOrder(funded(), { symbol: "AAPL", side: "buy", mode: "amount", value: 100 }, 50, T);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.state.positions.AAPL.quantity).toBe(2);
    expect(r.value.state.cash).toBe(1000 - 100 - ORDER_FEE);
    // Fee is baked into average cost.
    expect(r.value.state.positions.AAPL.avgCost).toBeCloseTo((100 + ORDER_FEE) / 2);
  });

  it("supports fractional quantities", () => {
    const r = executeOrder(funded(), { symbol: "BTC", side: "buy", mode: "amount", value: 10 }, 60000, T);
    // Quantities are floored to 6 decimals.
    expect(r.ok && r.value.state.positions.BTC.quantity).toBe(0.000166);
  });

  it("rejects buys without enough cash", () => {
    const r = previewOrder(funded(100), { symbol: "AAPL", side: "buy", mode: "amount", value: 100 }, 50);
    expect(r).toEqual({ ok: false, error: "Not enough cash" });
  });

  it("rejects selling more than you own", () => {
    const r = previewOrder(funded(), { symbol: "AAPL", side: "sell", mode: "quantity", value: 1 }, 50);
    expect(r.ok).toBe(false);
  });

  it("sells, records realised P/L and closes the position", () => {
    const bought = executeOrder(funded(), { symbol: "AAPL", side: "buy", mode: "quantity", value: 2 }, 50, T);
    if (!bought.ok) throw new Error(bought.error);
    const sold = executeOrder(bought.value.state, { symbol: "AAPL", side: "sell", mode: "quantity", value: 2 }, 60, T + 1);
    if (!sold.ok) throw new Error(sold.error);
    expect(sold.value.state.positions.AAPL).toBeUndefined();
    // Paid 100 + 1, received 120 - 1 → +18
    expect(sold.value.tx.realizedPnl).toBe(18);
    expect(sold.value.state.cash).toBe(1000 + 18);
  });

  it("withdraws only available cash", () => {
    expect(withdraw(funded(50), 100, T).ok).toBe(false);
    expect(withdraw(funded(50), 50, T).ok).toBe(true);
  });
});

describe("valuation", () => {
  it("summarises holdings at current prices", () => {
    const r = executeOrder(funded(), { symbol: "AAPL", side: "buy", mode: "quantity", value: 2 }, 50, T);
    if (!r.ok) throw new Error(r.error);
    const s = summarize(r.value.state, () => 75, T);
    expect(s.invested).toBe(150);
    expect(s.total).toBe(r.value.state.cash + 150);
    expect(s.pnl).toBeCloseTo(150 - 101);
  });

  it("replays history consistently with the live summary", () => {
    const now = T;
    const demo = createDemoAccount(now, priceAt);
    const [last] = valueHistory(demo.transactions, [now], priceAt);
    expect(last.value).toBeCloseTo(summarize(demo, priceAt, now).total, 2);
  });
});
