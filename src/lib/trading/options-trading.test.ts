import { describe, expect, it } from "vitest";
import { deposit, emptyAccount, ORDER_FEE, summarize, valueHistory, type AccountState } from "./engine";
import { executeOptionOrder, previewOptionOrder, settleExpiredOptions } from "./options-trading";

const T = Date.UTC(2026, 5, 1);
const ID = "AAPL|20260619|C|200";
const quote = { bid: 4.9, ask: 5.1, expired: false };

function funded(cash = 2000): AccountState {
  const r = deposit(emptyAccount(), cash, T);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

describe("option orders", () => {
  it("buys contracts at the ask, times the multiplier, plus fee", () => {
    const r = executeOptionOrder(funded(), { contract: ID, side: "buy", quantity: 2 }, quote, 100, T);
    if (!r.ok) throw new Error(r.error);
    expect(r.value.state.cash).toBe(2000 - 1020 - ORDER_FEE);
    expect(r.value.state.optionPositions[ID]).toEqual({ contract: ID, quantity: 2, avgCost: (1020 + ORDER_FEE) / 2 });
  });

  it("only sells contracts you own, at the bid", () => {
    expect(previewOptionOrder(funded(), { contract: ID, side: "sell", quantity: 1 }, quote, 100).ok).toBe(false);
    const bought = executeOptionOrder(funded(), { contract: ID, side: "buy", quantity: 1 }, quote, 100, T);
    if (!bought.ok) throw new Error(bought.error);
    const sold = executeOptionOrder(bought.value.state, { contract: ID, side: "sell", quantity: 1 }, { ...quote, bid: 8 }, 100, T + 1);
    if (!sold.ok) throw new Error(sold.error);
    expect(sold.value.tx.realizedPnl).toBe(800 - ORDER_FEE - (510 + ORDER_FEE));
    expect(sold.value.state.optionPositions[ID]).toBeUndefined();
  });

  it("rejects fractional contracts and unaffordable orders", () => {
    expect(previewOptionOrder(funded(), { contract: ID, side: "buy", quantity: 1.5 }, quote, 100).ok).toBe(false);
    expect(previewOptionOrder(funded(100), { contract: ID, side: "buy", quantity: 1 }, quote, 100).ok).toBe(false);
  });

  it("settles in the money at intrinsic value, and out of the money at zero", () => {
    const bought = executeOptionOrder(funded(), { contract: ID, side: "buy", quantity: 1 }, quote, 100, T);
    if (!bought.ok) throw new Error(bought.error);
    const expiry = T + 10 * 86_400_000;
    const notYet = settleExpiredOptions(bought.value.state, expiry - 1, () => expiry, () => 12, () => 100);
    expect(notYet.settled).toHaveLength(0);

    const itm = settleExpiredOptions(bought.value.state, expiry, () => expiry, () => 12, () => 100);
    expect(itm.settled[0].tx.amount).toBe(1200);
    expect(itm.state.optionPositions[ID]).toBeUndefined();

    const otm = settleExpiredOptions(bought.value.state, expiry, () => expiry, () => 0, () => 100);
    expect(otm.settled[0].tx.realizedPnl).toBe(-(510 + ORDER_FEE));
  });

  it("counts options in portfolio value and history", () => {
    const bought = executeOptionOrder(funded(), { contract: ID, side: "buy", quantity: 1 }, quote, 100, T);
    if (!bought.ok) throw new Error(bought.error);
    const mark = () => 6;
    const s = summarize(bought.value.state, () => 0, T, mark, () => 100);
    expect(s.options[0].value).toBe(600);
    expect(s.total).toBeCloseTo(bought.value.state.cash + 600);
    const [h] = valueHistory(bought.value.state.transactions, [T + 1], () => 0, mark, () => 100);
    expect(h.value).toBeCloseTo(s.total);
  });
});
