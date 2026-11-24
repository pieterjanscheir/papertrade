import { describe, expect, it } from "vitest";
import { feedbackCsv, markdownSummary, taskStats, toCsv } from "./analysis";
import type { TaskRun } from "./store";

const run = (over: Partial<TaskRun>): TaskRun => ({
  id: "x",
  taskId: "buy-etf",
  title: "Buy an ETF",
  tester: "Sam",
  startedAt: 0,
  endedAt: 30_000,
  outcome: "completed",
  clicks: 10,
  page: "/",
  ...over,
});

describe("user testing analysis", () => {
  it("summarises runs per task", () => {
    const [s] = taskStats([run({ endedAt: 20_000, ease: 6 }), run({ endedAt: 40_000, outcome: "gave_up", ease: 2 }), run({ endedAt: 60_000 })]);
    expect(s.runs).toBe(3);
    expect(s.successRate).toBeCloseTo(2 / 3);
    expect(s.medianSeconds).toBe(40);
    expect(s.avgEase).toBe(4);
  });

  it("escapes CSV fields", () => {
    expect(toCsv([{ a: 'He said "hi", twice', b: 1 }])).toBe('"a","b"\r\n"He said ""hi"", twice","1"');
    expect(feedbackCsv([])).toBe("");
  });

  it("builds a markdown summary", () => {
    const md = markdownSummary(
      [{ id: "1", time: 0, marketTime: 0, tester: "Sam", page: "/markets", preset: "demo", mood: 2, tags: ["Confusing"], note: "Where is the sell button?" }],
      [run({})],
    );
    expect(md).toContain("| Buy an ETF | 1 | 100% | 30 s");
    expect(md).toContain("😕 **Sam** on `/markets` [Confusing]: Where is the sell button?");
  });
});
