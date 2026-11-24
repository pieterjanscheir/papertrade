import { afterEach, describe, expect, it } from "vitest";
import { candlesFor, MINUTE, priceAt, setMarketEvents, sma } from "./simulator";

const T = Date.UTC(2026, 5, 1);

afterEach(() => setMarketEvents([]));

describe("candles", () => {
  it("are consistent OHLC bars that chain together", () => {
    const c = candlesFor("AAPL", "1D", T);
    expect(c).toHaveLength(96);
    for (let i = 0; i < c.length; i++) {
      expect(c[i].high).toBeGreaterThanOrEqual(Math.max(c[i].open, c[i].close));
      expect(c[i].low).toBeLessThanOrEqual(Math.min(c[i].open, c[i].close));
      expect(c[i].volume).toBeGreaterThan(0);
      if (i > 0) expect(c[i].open).toBe(c[i - 1].close);
    }
    expect(c[c.length - 1].close).toBe(priceAt("AAPL", T));
  });

  it("computes a simple moving average", () => {
    const c = candlesFor("AAPL", "1M", T, 20);
    const ma = sma(c, 20);
    expect(ma[18]).toBeNull();
    const manual = c.slice(0, 20).reduce((s, x) => s + x.close, 0) / 20;
    expect(ma[19]).toBeCloseTo(manual);
  });
});

describe("scenario events", () => {
  it("targets groups by type and sector", () => {
    const btc = priceAt("BTC", T + 20 * MINUTE);
    const aapl = priceAt("AAPL", T + 20 * MINUTE);
    setMarketEvents([{ id: "c", label: "Crypto winter", target: "type:crypto", start: T, duration: MINUTE, move: -0.3, kind: "move" }]);
    expect(priceAt("BTC", T + 20 * MINUTE)).toBeLessThan(btc);
    expect(priceAt("AAPL", T + 20 * MINUTE)).toBe(aapl);
  });

  it("a crash moves the price down after it starts, and leaves the past alone", () => {
    const before = priceAt("AAPL", T - MINUTE);
    const normal = priceAt("AAPL", T + 20 * MINUTE);
    setMarketEvents([{ id: "x", label: "Crash", target: "AAPL", start: T, duration: 10 * MINUTE, move: -0.2, kind: "move" }]);
    expect(priceAt("AAPL", T - MINUTE)).toBe(before);
    expect(priceAt("AAPL", T + 20 * MINUTE) / normal).toBeCloseTo(0.8, 2);
    // Other assets are untouched by a single-asset event.
    setMarketEvents([]);
    const msft = priceAt("MSFT", T + 20 * MINUTE);
    setMarketEvents([{ id: "x", label: "Crash", target: "AAPL", start: T, duration: 10 * MINUTE, move: -0.2, kind: "move" }]);
    expect(priceAt("MSFT", T + 20 * MINUTE)).toBe(msft);
  });
});

describe("Anthropic (fictional, always up)", () => {
  it("never goes down, at any time scale", () => {
    for (const step of [5 * MINUTE, 60 * MINUTE, 24 * 60 * MINUTE]) {
      let prev = priceAt("ANTH", T - 400 * step);
      for (let i = -399; i <= 400; i++) {
        const p = priceAt("ANTH", T + i * step);
        expect(p).toBeGreaterThanOrEqual(prev);
        prev = p;
      }
    }
  });

  it("ignores crashes but enjoys rallies", () => {
    const base = priceAt("ANTH", T + 20 * MINUTE);
    setMarketEvents([{ id: "c", label: "Crash", target: "*", start: T, duration: MINUTE, move: -0.5, kind: "move" }]);
    expect(priceAt("ANTH", T + 20 * MINUTE)).toBe(base);
    setMarketEvents([{ id: "r", label: "Rally", target: "*", start: T, duration: MINUTE, move: 0.1, kind: "move" }]);
    expect(priceAt("ANTH", T + 20 * MINUTE)).toBeGreaterThan(base);
  });

  it("region targets hit only that region", () => {
    const kbc = priceAt("KBC", T + 20 * MINUTE);
    const sap = priceAt("SAP", T + 20 * MINUTE);
    setMarketEvents([{ id: "b", label: "Waffle shock", target: "region:Belgium", start: T, duration: MINUTE, move: -0.2, kind: "move" }]);
    expect(priceAt("KBC", T + 20 * MINUTE)).toBeLessThan(kbc);
    expect(priceAt("SAP", T + 20 * MINUTE)).toBe(sap);
  });
});
