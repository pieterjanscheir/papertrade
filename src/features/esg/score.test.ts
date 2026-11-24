import { describe, expect, it } from "vitest";
import { ASSETS, getAsset } from "@/lib/market/assets";
import { esgReport } from "./score";

const T = Date.UTC(2026, 5, 1);

describe("ESG vibes", () => {
  it("is stable within a quarter and valid for every asset", () => {
    for (const a of ASSETS) {
      const r = esgReport(a, T);
      expect(r).toEqual(esgReport(a, T + 86_400_000));
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(r.pillars.map((p) => p.metrics.length)).toEqual([3, 3, 3]);
    }
  });

  it("gives the fictional always-up listing top marks", () => {
    expect(esgReport(getAsset("ANTH")!, T).score).toBeGreaterThanOrEqual(94);
  });
});
