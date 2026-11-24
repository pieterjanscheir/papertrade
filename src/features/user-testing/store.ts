"use client";

/**
 * User-testing data, saved in this browser's localStorage.
 *
 * Note: timestamps here are REAL time (Date.now()), not market time: they record
 * when a test session actually happened. Market time is stored next to it.
 */

import { createLocalStore } from "@/lib/local-store";

export interface FeedbackEntry {
  id: string;
  time: number;
  marketTime: number;
  tester: string;
  page: string;
  preset: string;
  /** 1 = very negative … 5 = very positive */
  mood: number;
  tags: string[];
  note: string;
  taskId?: string;
}

export interface TaskRun {
  id: string;
  taskId: string;
  title: string;
  tester: string;
  startedAt: number;
  endedAt: number;
  outcome: "completed" | "auto" | "gave_up";
  /** Single Ease Question, 1 (very hard) … 7 (very easy). */
  ease?: number;
  clicks: number;
  page: string;
  note?: string;
}

export interface ActiveTask {
  taskId: string;
  title: string;
  startedAt: number;
  marketStart: number;
  clicks: number;
}

interface TestingState {
  enabled: boolean;
  tester: string;
  feedback: FeedbackEntry[];
  runs: TaskRun[];
  customTasks: { id: string; title: string; success: string }[];
  active: ActiveTask | null;
  /** A finished run waiting for its ease rating. */
  rating: string | null;

  setEnabled: (v: boolean) => void;
  setTester: (name: string) => void;
  addFeedback: (f: Omit<FeedbackEntry, "id">) => void;
  startTask: (t: { taskId: string; title: string; marketStart: number }) => void;
  click: () => void;
  finishTask: (outcome: TaskRun["outcome"], page: string) => void;
  rate: (runId: string, ease: number, note?: string) => void;
  addCustomTask: (title: string) => void;
  removeCustomTask: (id: string) => void;
  clear: () => void;
}

const id = () => Math.random().toString(36).slice(2, 10);

export const useTesting = createLocalStore<TestingState>("feature-user-testing", (set, get) => ({
  enabled: false,
  tester: "",
  feedback: [],
  runs: [],
  customTasks: [],
  active: null,
  rating: null,

  setEnabled: (enabled) => set({ enabled }),
  setTester: (tester) => set({ tester }),
  addFeedback: (f) => set({ feedback: [...get().feedback, { ...f, id: id() }] }),
  startTask: ({ taskId, title, marketStart }) =>
    set({ enabled: true, active: { taskId, title, startedAt: Date.now(), marketStart, clicks: 0 }, rating: null }),
  click: () => {
    const a = get().active;
    if (a) set({ active: { ...a, clicks: a.clicks + 1 } });
  },
  finishTask: (outcome, page) => {
    const a = get().active;
    if (!a) return;
    const run: TaskRun = {
      id: id(),
      taskId: a.taskId,
      title: a.title,
      tester: get().tester || "Anonymous",
      startedAt: a.startedAt,
      endedAt: Date.now(),
      outcome,
      clicks: a.clicks,
      page,
    };
    set({ runs: [...get().runs, run], active: null, rating: run.id });
  },
  rate: (runId, ease, note) => set({ runs: get().runs.map((r) => (r.id === runId ? { ...r, ease, note } : r)), rating: null }),
  addCustomTask: (title) => set({ customTasks: [...get().customTasks, { id: `custom-${id()}`, title, success: "Defined by the team" }] }),
  removeCustomTask: (taskId) => set({ customTasks: get().customTasks.filter((t) => t.id !== taskId) }),
  clear: () => set({ feedback: [], runs: [], active: null, rating: null }),
}));
