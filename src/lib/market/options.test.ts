import { describe, expect, it } from "vitest";
import { blackScholes, contractId, expiriesAt, parseContract, quoteOption, strikesFor } from "./options";
import { DAY } from "./simulator";

const T = Date.UTC(2026, 5, 3, 12); // a Wednesday

describe("option pricing", () => {
  it("satisfies put-call parity", () => {
    const s = 100, k = 105, y = 0.5, v = 0.3, r = 0.02;
    const c = blackScholes("call", s, k, y, v, r).price;
    const p = blackScholes("put", s, k, y, v, r).price;
    expect(c - p).toBeCloseTo(s - k * Math.exp(-r * y), 6);
  });

  it("is worth its intrinsic value at expiry", () => {
    expect(blackScholes("call", 110, 100, 0, 0.3).price).toBe(10);
    expect(blackScholes("put", 110, 100, 0, 0.3).price).toBe(0);
  });

  it("quotes a bid below the ask, and freezes at intrinsic after expiry", () => {
    const [expiry] = expiriesAt(T);
    const c = parseContract(contractId("AAPL", "call", strikesFor(200)[6], expiry));
    const q = quoteOption(c, T);
    expect(q.bid).toBeLessThan(q.ask);
    const after = quoteOption(c, expiry + 3 * DAY);
    expect(after.expired).toBe(true);
    expect(after.bid).toBe(after.ask);
    expect(after).toEqual(quoteOption(c, expiry + 9 * DAY));
  });
});

describe("expiries and strikes", () => {
  it("lists upcoming Fridays at 16:00 UTC, sorted", () => {
    const e = expiriesAt(T);
    expect(e).toHaveLength(7);
    for (const t of e) {
      expect(new Date(t).getUTCDay()).toBe(5);
      expect(new Date(t).getUTCHours()).toBe(16);
      expect(t).toBeGreaterThan(T);
    }
    for (let i = 1; i < e.length; i++) expect(e[i]).toBeGreaterThan(e[i - 1]);
  });

  it("round-trips contract ids", () => {
    const [expiry] = expiriesAt(T);
    const id = contractId("NVDA", "put", 197.5, expiry);
    expect(parseContract(id)).toMatchObject({ symbol: "NVDA", type: "put", strike: 197.5, expiry });
  });

  it("centres strikes on the current price", () => {
    const k = strikesFor(204.3);
    expect(k).toHaveLength(13);
    expect(Math.abs(k[6] - 204.3)).toBeLessThan(5);
  });
});
