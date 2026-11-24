import { describe, expect, it } from "vitest";
import { multiplier, optionMark } from "../market/options";
import { priceAt } from "../market/simulator";
import { netDeposits, summarize } from "./engine";
import { createPresetAccount, PRESETS } from "./seed";

const NOW = Date.UTC(2026, 10, 24, 12);
const value = (id: Parameters<typeof createPresetAccount>[0]) => {
  const a = createPresetAccount(id, NOW, priceAt);
  const s = summarize(a, priceAt, NOW, optionMark, (c) => multiplier(c.split("|")[0]));
  return { a, total: s.total, deposits: netDeposits(a.transactions), cash: a.cash };
};

describe("preset accounts", () => {
  it("all build with non-negative cash", () => {
    for (const p of PRESETS) {
      const { cash, a } = value(p.id);
      expect(cash).toBeGreaterThanOrEqual(0);
      expect(a.transactions.length).toBeGreaterThan(0);
    }
  });

  it("the Panic Seller loses money and the Oracle makes a lot", () => {
    const panic = value("panic");
    const oracle = value("oracle");
    expect(panic.total).toBeLessThan(panic.deposits);
    expect(oracle.total).toBeGreaterThan(oracle.deposits * 1.5);
  });

  it("the Day Trader trades a lot and pays for it", () => {
    const { a } = value("daytrader");
    const trades = a.transactions.filter((t) => t.type === "buy" || t.type === "sell");
    expect(trades.length).toBeGreaterThan(400);
    expect(a.transactions.reduce((s, t) => s + t.fee, 0)).toBeGreaterThan(400);
  });

  it("the Options Gambler mostly loses premiums", () => {
    const { a } = value("gambler");
    const settled = a.transactions.filter((t) => t.type === "option_settle");
    expect(settled.length).toBeGreaterThan(10);
    expect(settled.filter((t) => t.amount === 0).length / settled.length).toBeGreaterThan(0.5);
  });

  it("the index investor deposits every month and never sells", () => {
    const { a } = value("index");
    expect(a.transactions.filter((t) => t.type === "deposit").length).toBe(36);
    expect(a.transactions.some((t) => t.type === "sell")).toBe(false);
  });
});
