import { describe, expect, it } from "vitest";
import { MINUTE } from "@/lib/market/simulator";
import { newsFeed } from "./generator";

const T = Date.UTC(2026, 5, 1);

describe("news feed", () => {
  it("is deterministic and sorted newest first", () => {
    const a = newsFeed(T);
    expect(a).toEqual(newsFeed(T));
    expect(a.length).toBeGreaterThan(5);
    for (let i = 1; i < a.length; i++) expect(a[i - 1].t).toBeGreaterThanOrEqual(a[i].t);
    expect(a.every((n) => n.t <= T)).toBe(true);
  });

  it("headlines agree with the direction of the move", () => {
    for (const n of newsFeed(T, { limit: 200 })) {
      if (n.sentiment === "up") expect(n.move!).toBeGreaterThanOrEqual(0);
      if (n.sentiment === "down") expect(n.move!).toBeLessThan(0);
      expect(n.headline).not.toMatch(/\{\w+\}/); // no unfilled placeholders
    }
  });

  it("turns scenarios with a headline into breaking news for affected assets", () => {
    const events = [{ id: "x", label: "Crypto winter", target: "type:crypto", start: T - MINUTE, duration: MINUTE, move: -0.3, kind: "move" as const, headline: "Brr" }];
    expect(newsFeed(T, { events, symbol: "BTC" }).some((n) => n.sentiment === "breaking")).toBe(true);
    expect(newsFeed(T, { events, symbol: "AAPL" }).some((n) => n.sentiment === "breaking")).toBe(false);
  });
});
