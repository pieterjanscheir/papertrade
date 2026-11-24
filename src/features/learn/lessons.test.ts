import { describe, expect, it } from "vitest";
import { payoffAtExpiry } from "@/lib/market/options";
import { ALL_LESSONS } from "./lessons";

describe("lessons", () => {
  it("have unique ids and valid quiz answers", () => {
    const ids = ALL_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of ALL_LESSONS) {
      for (const q of [...(l.quiz ? [l.quiz] : []), ...(l.quizzes ?? [])]) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
    }
  });

  it("the deep dive's worked examples match the app's payoff maths", () => {
    // Call, strike 100, premium 3, one contract of 100 shares.
    expect(payoffAtExpiry({ type: "call", strike: 100 }, 110, 3, 100)).toBe(700);
    expect(payoffAtExpiry({ type: "call", strike: 100 }, 102, 3, 100)).toBe(-100);
    expect(payoffAtExpiry({ type: "call", strike: 100 }, 95, 3, 100)).toBe(-300);
    // Put, strike 100, premium 4.
    expect(payoffAtExpiry({ type: "put", strike: 100 }, 90, 4, 100)).toBe(600);
    expect(payoffAtExpiry({ type: "put", strike: 100 }, 105, 4, 100)).toBe(-400);
    // Quiz: put strike 50, stock 42 → worth 8 per share.
    expect(payoffAtExpiry({ type: "put", strike: 50 }, 42, 0, 1)).toBe(8);
  });
});
