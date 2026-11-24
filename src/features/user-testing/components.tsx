"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ClipboardCopy, Download, Flag, MessageSquarePlus, Play, Plus, Timer, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { Sheet } from "@/components/sheet";
import { Button, Card, SectionTitle } from "@/components/ui";
import { marketNow, useDemoStore } from "@/lib/demo/store";
import { useAccount } from "@/lib/trading/store";
import { usePrefsStore } from "@/lib/ui/prefs";
import { toast } from "@/lib/ui/toasts";
import { MOOD, feedbackCsv, markdownSummary, runsCsv, taskStats, type TaskStats } from "./analysis";
import { useTesting, type FeedbackEntry, type TaskRun } from "./store";
import { DEFAULT_TASKS, type TestTask } from "./tasks";

const TAGS = ["Confusing", "Bug", "Idea", "Love it", "Missing", "Too slow"];

function useAllTasks(): TestTask[] {
  const custom = useTesting((s) => s.customTasks);
  return [...DEFAULT_TASKS, ...custom];
}

// ---------------------------------------------------------------------------
// Always-on pieces (rendered by the feature's Runner)
// ---------------------------------------------------------------------------

/** Task bar, auto-completion, click counting, ease rating and the feedback button. */
export function TestingRunner({ now }: { now: number }) {
  const t = useTesting();
  const account = useAccount();
  const pathname = usePathname();
  const tasks = useAllTasks();
  const demoOpen = useDemoStore((s) => s.panelOpen);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Count clicks while a task runs (a rough "how lost were they" signal).
  useEffect(() => {
    if (!t.active) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-testing-ui]")) return;
      useTesting.getState().click();
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [t.active]);

  // Auto-complete tasks that have a check.
  useEffect(() => {
    const a = useTesting.getState().active;
    if (!a || !now) return;
    const task = tasks.find((x) => x.id === a.taskId);
    if (task?.check?.(account, a.marketStart)) {
      useTesting.getState().finishTask("auto", pathname);
      toast({ title: "Task completed ✓", body: a.title, tone: "gain" });
    }
  }, [now, account, tasks, pathname]);

  // ⇧F opens feedback while testing mode is on.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).closest("input, textarea, select")) return;
      if (e.shiftKey && e.key.toLowerCase() === "f" && useTesting.getState().enabled) setFeedbackOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {t.active && <TaskBar />}
      {t.enabled && !demoOpen && (
        <button
          data-testing-ui
          onClick={() => setFeedbackOpen(true)}
          className="fixed right-4 bottom-[calc(76px+env(safe-area-inset-bottom))] z-30 flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent shadow-xl shadow-black/40 md:right-6 md:bottom-6"
        >
          <MessageSquarePlus size={16} /> Feedback
        </button>
      )}
      <FeedbackSheet open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <RatingSheet />
    </>
  );
}

function TaskBar() {
  const active = useTesting((s) => s.active)!;
  const finish = useTesting((s) => s.finishTask);
  const pathname = usePathname();
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  // eslint-disable-next-line react-hooks/purity -- a stopwatch reads the wall clock on purpose
  const seconds = Math.floor((Date.now() - active.startedAt) / 1000);

  return (
    <div data-testing-ui className="fixed inset-x-0 top-0 z-[55] flex justify-center p-3">
      <div className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-accent/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur">
        <Flag size={18} className="shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">Your task</p>
          <p className="truncate text-sm font-semibold">{active.title}</p>
        </div>
        <span className="tabular flex shrink-0 items-center gap-1 text-sm text-muted">
          <Timer size={14} /> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
        <button onClick={() => finish("gave_up", pathname)} className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted hover:text-fg">
          Give up
        </button>
        <button onClick={() => finish("completed", pathname)} className="shrink-0 rounded-full bg-gain px-3 py-1.5 text-xs font-semibold text-black">
          Done
        </button>
      </div>
    </div>
  );
}

function RatingSheet() {
  const { rating, runs, rate } = useTesting();
  const run = runs.find((r) => r.id === rating);
  const [ease, setEase] = useState<number | null>(null);
  const [note, setNote] = useState("");
  return (
    <Sheet open={!!run} onClose={() => run && rate(run.id, ease ?? 0, note)} title="How easy was that?">
      {run && (
        <div data-testing-ui className="flex flex-col gap-4">
          <p className="text-sm text-muted">“{run.title}”</p>
          <div className="grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setEase(n)}
                className={`tabular rounded-xl py-3 text-sm font-semibold ${ease === n ? "bg-accent text-on-accent" : "bg-surface-2 text-muted hover:text-fg"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="-mt-2 flex justify-between text-[11px] text-muted">
            <span>Very hard</span>
            <span>Very easy</span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything that surprised you? (optional)"
            rows={3}
            className="rounded-xl border border-line bg-surface-2 p-3 text-sm outline-none focus:border-accent"
          />
          <Button
            disabled={ease === null}
            onClick={() => {
              rate(run.id, ease!, note.trim() || undefined);
              setEase(null);
              setNote("");
            }}
          >
            Save
          </Button>
        </div>
      )}
    </Sheet>
  );
}

function FeedbackSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTesting();
  const pathname = usePathname();
  const [mood, setMood] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  function save() {
    t.addFeedback({
      time: Date.now(),
      marketTime: marketNow(),
      tester: t.tester || "Anonymous",
      page: pathname,
      preset: String(usePrefsStore.getState().values["account.preset"] ?? "demo"),
      mood,
      tags,
      note: note.trim(),
      taskId: t.active?.taskId,
    });
    toast({ title: "Feedback saved", body: "Thank you!", tone: "gain" });
    setNote("");
    setTags([]);
    setMood(3);
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Feedback">
      {open && (
        <div data-testing-ui className="flex flex-col gap-4">
          <div className="flex justify-between gap-1.5">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`flex-1 rounded-xl py-2.5 text-2xl transition ${mood === m ? "bg-accent/20 ring-2 ring-accent" : "bg-surface-2 grayscale-[0.6] hover:grayscale-0"}`}
                aria-label={`Mood ${m} of 5`}
              >
                {MOOD[m]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setTags((ts) => (ts.includes(tag) ? ts.filter((x) => x !== tag) : [...ts, tag]))}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${tags.includes(tag) ? "bg-fg text-bg" : "bg-surface-2 text-muted hover:text-fg"}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <textarea
            data-autofocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened? What did you expect?"
            rows={4}
            className="rounded-xl border border-line bg-surface-2 p-3 text-sm outline-none focus:border-accent"
          />
          <input
            value={t.tester}
            onChange={(e) => t.setTester(e.target.value)}
            placeholder="Tester name or code (e.g. T3)"
            className="rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <p className="text-[11px] text-muted">
            Saved with: page <code>{pathname}</code>
            {t.active && <> · task “{t.active.title}”</>}. Stored only in this browser.
          </p>
          <Button onClick={save} disabled={!note.trim() && tags.length === 0}>
            Save feedback
          </Button>
        </div>
      )}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// /testing page
// ---------------------------------------------------------------------------

function download(name: string, content: string, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** Date for export filenames; only called from click handlers, never during render. */
const today = () => new Date().toISOString().slice(0, 10);

const fmtTime = (t: number) => new Date(t).toLocaleString("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function TestingScreen() {
  const t = useTesting();
  const router = useRouter();
  const tasks = useAllTasks();
  const [custom, setCustom] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const stats = taskStats(t.runs);

  function start(task: TestTask) {
    t.startTask({ taskId: task.id, title: task.title, marketStart: marketNow() });
    router.push("/");
  }

  const statColumns: Column<TaskStats>[] = [
    { key: "title", header: "Task", sortValue: (s) => s.title, render: (s) => <span className="font-semibold whitespace-normal">{s.title}</span> },
    { key: "runs", header: "Runs", align: "right", sortValue: (s) => s.runs, render: (s) => s.runs },
    {
      key: "success",
      header: "Success",
      align: "right",
      sortValue: (s) => s.successRate,
      render: (s) => <span className={s.successRate >= 0.8 ? "text-gain" : s.successRate < 0.5 ? "text-loss" : ""}>{Math.round(s.successRate * 100)}%</span>,
    },
    { key: "time", header: "Median time", align: "right", sortValue: (s) => s.medianSeconds, render: (s) => `${Math.round(s.medianSeconds)} s` },
    { key: "ease", header: "Ease (1–7)", align: "right", sortValue: (s) => s.avgEase ?? 0, render: (s) => s.avgEase?.toFixed(1) ?? "–" },
    { key: "clicks", header: "Clicks", align: "right", sortValue: (s) => s.avgClicks, render: (s) => s.avgClicks.toFixed(0) },
  ];

  const runColumns: Column<TaskRun>[] = [
    { key: "title", header: "Task", sortValue: (r) => r.title, render: (r) => <span className="font-semibold">{r.title}</span> },
    { key: "tester", header: "Tester", sortValue: (r) => r.tester, render: (r) => r.tester },
    {
      key: "outcome",
      header: "Outcome",
      sortValue: (r) => r.outcome,
      render: (r) => (
        <span className={r.outcome === "gave_up" ? "text-loss" : "text-gain"}>{r.outcome === "auto" ? "Completed (auto)" : r.outcome === "completed" ? "Completed" : "Gave up"}</span>
      ),
    },
    { key: "secs", header: "Time", align: "right", sortValue: (r) => r.endedAt - r.startedAt, render: (r) => `${Math.round((r.endedAt - r.startedAt) / 1000)} s` },
    { key: "ease", header: "Ease", align: "right", sortValue: (r) => r.ease ?? 0, render: (r) => r.ease ?? "–" },
    { key: "clicks", header: "Clicks", align: "right", sortValue: (r) => r.clicks, render: (r) => r.clicks },
    { key: "when", header: "When", sortValue: (r) => r.startedAt, render: (r) => <span className="text-muted">{fmtTime(r.startedAt)}</span> },
    { key: "note", header: "Note", render: (r) => <span className="text-muted">{r.note ?? ""}</span> },
  ];

  const feedbackColumns: Column<FeedbackEntry>[] = [
    {
      key: "note",
      header: "Feedback",
      render: (f) => (
        <span className="flex max-w-md items-start gap-2 whitespace-normal">
          <span className="text-lg leading-none">{MOOD[f.mood]}</span>
          <span>{f.note || <span className="text-muted">(no note)</span>}</span>
        </span>
      ),
    },
    { key: "tags", header: "Tags", render: (f) => <span className="text-muted">{f.tags.join(", ")}</span> },
    { key: "mood", header: "Mood", align: "right", sortValue: (f) => f.mood, render: (f) => `${f.mood}/5` },
    { key: "page", header: "Page", sortValue: (f) => f.page, render: (f) => <code className="text-xs">{f.page}</code> },
    { key: "tester", header: "Tester", sortValue: (f) => f.tester, render: (f) => f.tester },
    { key: "preset", header: "Account", sortValue: (f) => f.preset, render: (f) => <span className="text-muted">{f.preset}</span> },
    { key: "time", header: "When", sortValue: (f) => f.time, render: (f) => <span className="text-muted">{fmtTime(f.time)}</span> },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent">For builders</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">User testing</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Run short tasks with traders, collect feedback while they use your prototype, and export the results for your synthesis and pitch. Everything is
            stored in this browser only.
          </p>
        </div>
        <Card className="flex flex-wrap items-center gap-3 p-4">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={t.enabled} onChange={(e) => t.setEnabled(e.target.checked)} className="size-4 accent-[var(--color-accent)]" />
            Testing mode
          </label>
          <span className="text-xs text-muted">Shows the Feedback button (⇧F)</span>
          <input
            value={t.tester}
            onChange={(e) => t.setTester(e.target.value)}
            placeholder="Tester name / code"
            className="w-40 rounded-xl border border-line bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
        </Card>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <SectionTitle>Tasks</SectionTitle>
          <Card className="divide-y divide-line">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs text-muted">
                    Success: {task.success}
                    {"check" in task && task.check ? " · completes automatically" : ""}
                  </p>
                </div>
                {task.id.startsWith("custom-") && (
                  <button onClick={() => t.removeCustomTask(task.id)} className="text-muted hover:text-loss" aria-label="Remove task">
                    <Trash2 size={15} />
                  </button>
                )}
                <Button variant="secondary" className="shrink-0 px-3 py-1.5" disabled={!!t.active} onClick={() => start(task)}>
                  <Play size={13} /> Start
                </Button>
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (custom.trim()) t.addCustomTask(custom.trim());
                setCustom("");
              }}
              className="flex gap-2 px-4 py-3"
            >
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Add a task for your own feature…"
                className="min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <Button variant="secondary" className="px-3 py-2" disabled={!custom.trim()}>
                <Plus size={14} /> Add
              </Button>
            </form>
          </Card>
          {t.active && (
            <p className="mt-2 flex items-center gap-2 text-sm text-accent">
              <Timer size={14} /> Running: “{t.active.title}”.
              <button onClick={() => t.finishTask("gave_up", "/testing")} className="font-semibold underline">
                Stop
              </button>
            </p>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div>
            <SectionTitle>Export</SectionTitle>
            <Card className="flex flex-col gap-2 p-4">
              <Button variant="secondary" disabled={!t.feedback.length} onClick={() => download(`feedback-${today()}.csv`, feedbackCsv(t.feedback))}>
                <Download size={15} /> Feedback (CSV)
              </Button>
              <Button variant="secondary" disabled={!t.runs.length} onClick={() => download(`tasks-${today()}.csv`, runsCsv(t.runs))}>
                <Download size={15} /> Task runs (CSV)
              </Button>
              <Button
                variant="secondary"
                disabled={!t.runs.length && !t.feedback.length}
                onClick={async () => {
                  await navigator.clipboard.writeText(markdownSummary(t.feedback, t.runs));
                  toast({ title: "Summary copied", body: "Paste it into your synthesis doc or slides.", tone: "gain" });
                }}
              >
                <ClipboardCopy size={15} /> Copy summary (Markdown)
              </Button>
              <Button
                variant={confirmClear ? "loss" : "ghost"}
                disabled={!t.runs.length && !t.feedback.length}
                onClick={() => (confirmClear ? (t.clear(), setConfirmClear(false)) : setConfirmClear(true))}
              >
                <Trash2 size={15} /> {confirmClear ? "Click again to delete all results" : "Clear results"}
              </Button>
            </Card>
          </div>
          <div>
            <SectionTitle>Running a good session</SectionTitle>
            <Card className="space-y-2 p-4 text-sm text-muted">
              {[
                "Pick a preset account that fits the scenario (Account → Load a different account).",
                "Ask them to think aloud. Don't help; ask “what do you expect to happen?” instead.",
                "Read the task out loud, press Start, hand over the device.",
                "Rate ease right after each task; it pops up automatically.",
                "Write down quotes. One good quote beats ten opinions in your pitch.",
              ].map((tip, i) => (
                <p key={i} className="flex gap-2">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" /> {tip}
                </p>
              ))}
            </Card>
          </div>
        </aside>
      </div>

      <div>
        <SectionTitle>Results per task</SectionTitle>
        <Card className="overflow-hidden">
          <DataTable id="testing-stats" rows={stats} rowKey={(s) => s.taskId} columns={statColumns} empty="No task runs yet. Start a task above." />
        </Card>
      </div>

      <div>
        <SectionTitle>All task runs</SectionTitle>
        <Card className="overflow-hidden">
          <DataTable
            id="testing-runs"
            rows={t.runs}
            rowKey={(r) => r.id}
            columns={runColumns}
            search={(r) => `${r.title} ${r.tester} ${r.note ?? ""}`}
            defaultSort={{ key: "when", dir: "desc" }}
            filters={[
              { key: "done", label: "Completed", test: (r) => r.outcome !== "gave_up" },
              { key: "gaveup", label: "Gave up", test: (r) => r.outcome === "gave_up" },
            ]}
            empty="No task runs yet."
          />
        </Card>
      </div>

      <div>
        <SectionTitle>Feedback</SectionTitle>
        <Card className="overflow-hidden">
          <DataTable
            id="testing-feedback"
            rows={t.feedback}
            rowKey={(f) => f.id}
            columns={feedbackColumns}
            search={(f) => `${f.note} ${f.tags.join(" ")} ${f.page} ${f.tester}`}
            defaultSort={{ key: "time", dir: "desc" }}
            filters={TAGS.map((tag) => ({ key: tag, label: tag, test: (f: FeedbackEntry) => f.tags.includes(tag) }))}
            empty={
              <span>
                No feedback yet. Turn on testing mode and press <b>Feedback</b> (or ⇧F) anywhere in the app.
              </span>
            }
          />
        </Card>
      </div>

    </div>
  );
}
