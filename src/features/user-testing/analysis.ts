/**
 * Pure helpers to summarise and export user-testing data.
 */

import type { FeedbackEntry, TaskRun } from "./store";

export interface TaskStats {
  taskId: string;
  title: string;
  runs: number;
  successRate: number;
  medianSeconds: number;
  avgEase: number | null;
  avgClicks: number;
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function taskStats(runs: TaskRun[]): TaskStats[] {
  const byTask = new Map<string, TaskRun[]>();
  for (const r of runs) byTask.set(r.taskId, [...(byTask.get(r.taskId) ?? []), r]);
  return [...byTask.entries()].map(([taskId, rs]) => {
    const eases = rs.map((r) => r.ease).filter((e): e is number => e !== undefined);
    return {
      taskId,
      title: rs[0].title,
      runs: rs.length,
      successRate: rs.filter((r) => r.outcome !== "gave_up").length / rs.length,
      medianSeconds: median(rs.map((r) => (r.endedAt - r.startedAt) / 1000)),
      avgEase: eases.length ? eases.reduce((s, e) => s + e, 0) / eases.length : null,
      avgClicks: rs.reduce((s, r) => s + r.clicks, 0) / rs.length,
    };
  });
}

/** RFC 4180-style CSV: quote every field, double embedded quotes. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const cell = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [headers.map(cell).join(","), ...rows.map((r) => headers.map((h) => cell(r[h])).join(","))].join("\r\n");
}

const iso = (t: number) => new Date(t).toISOString();
export const MOOD = ["", "😡", "😕", "😐", "🙂", "😍"];

export function feedbackCsv(feedback: FeedbackEntry[]) {
  return toCsv(
    feedback.map((f) => ({
      time: iso(f.time),
      tester: f.tester,
      mood: f.mood,
      mood_emoji: MOOD[f.mood],
      tags: f.tags.join("; "),
      note: f.note,
      page: f.page,
      account_preset: f.preset,
      task: f.taskId ?? "",
      market_time: iso(f.marketTime),
    })),
  );
}

export function runsCsv(runs: TaskRun[]) {
  return toCsv(
    runs.map((r) => ({
      started: iso(r.startedAt),
      tester: r.tester,
      task: r.title,
      outcome: r.outcome,
      seconds: Math.round((r.endedAt - r.startedAt) / 1000),
      ease_1_to_7: r.ease ?? "",
      clicks: r.clicks,
      ended_on_page: r.page,
      note: r.note ?? "",
    })),
  );
}

/** A Markdown summary to paste into a synthesis doc or slide. */
export function markdownSummary(feedback: FeedbackEntry[], runs: TaskRun[]): string {
  const stats = taskStats(runs);
  const lines = [
    "# User testing summary",
    "",
    `${runs.length} task runs · ${feedback.length} feedback notes · ${new Set([...runs.map((r) => r.tester), ...feedback.map((f) => f.tester)]).size} testers`,
    "",
    "## Tasks",
    "",
    "| Task | Runs | Success | Median time | Ease (1–7) | Clicks |",
    "| --- | --- | --- | --- | --- | --- |",
    ...stats.map(
      (s) =>
        `| ${s.title} | ${s.runs} | ${Math.round(s.successRate * 100)}% | ${Math.round(s.medianSeconds)} s | ${s.avgEase?.toFixed(1) ?? "–"} | ${s.avgClicks.toFixed(0)} |`,
    ),
    "",
    "## Feedback",
    "",
    ...feedback.map((f) => `- ${MOOD[f.mood]} **${f.tester || "Anonymous"}** on \`${f.page}\`${f.tags.length ? ` [${f.tags.join(", ")}]` : ""}: ${f.note || "(no note)"}`),
  ];
  return lines.join("\n");
}
