"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FastForward, Pause, Play, Radio, X, Zap } from "lucide-react";
import { isLive, useDemoStore } from "@/lib/demo/store";
import { market } from "@/lib/market/provider";
import { DAY, HOUR, MINUTE } from "@/lib/market/simulator";
import { clockOffset, useNow } from "@/lib/ui/clock";

const SPEEDS = [
  { speed: 0, label: "Pause" },
  { speed: 1, label: "1×" },
  { speed: 60, label: "1 min/s" },
  { speed: 600, label: "10 min/s" },
  { speed: 3600, label: "1 h/s" },
];

const JUMPS = [
  { ms: HOUR, label: "+1 hour" },
  { ms: DAY, label: "+1 day" },
  { ms: 7 * DAY, label: "+1 week" },
  { ms: 30 * DAY, label: "+1 month" },
];

const SCENARIOS = [
  { label: "Crash", detail: "−15% over 10 min", move: -0.15, duration: 10 * MINUTE, kind: "move" as const, tone: "loss" },
  { label: "Flash dip", detail: "−6% in 1 min", move: -0.06, duration: MINUTE, kind: "move" as const, tone: "loss" },
  { label: "Rally", detail: "+12% over 30 min", move: 0.12, duration: 30 * MINUTE, kind: "move" as const, tone: "gain" },
  { label: "Spike", detail: "+8% in 1 min", move: 0.08, duration: MINUTE, kind: "move" as const, tone: "gain" },
  { label: "Volatility storm", detail: "Wild swings for 1 hour", move: 0, duration: HOUR, kind: "volatility" as const, tone: "accent" },
];

/** Hidden presenter panel: toggle with Shift + D, or from the sidebar / Account page. */
export function DemoControls() {
  const open = useDemoStore((s) => s.panelOpen);
  const setOpen = useDemoStore((s) => s.setPanelOpen);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      if (e.shiftKey && e.key.toLowerCase() === "d") setOpen(!useDemoStore.getState().panelOpen);
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return open ? <Panel onClose={() => setOpen(false)} /> : null;
}

function Panel({ onClose }: { onClose: () => void }) {
  const now = useNow();
  const pathname = usePathname();
  const demo = useDemoStore();
  const pageSymbol = pathname.startsWith("/asset/") ? decodeURIComponent(pathname.split("/")[2]) : null;
  const [target, setTarget] = useState<string>("*");
  const effectiveTarget = target === "page" ? (pageSymbol ?? "*") : target;

  const offset = clockOffset();
  const live = isLive(demo);

  return (
    <div className="animate-sheet fixed right-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-40 w-[min(380px,calc(100vw-24px))] rounded-3xl border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-xl md:right-6 md:bottom-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <Zap size={16} className="text-amber-400" /> Demo controls
          </p>
          <p className="tabular mt-1 text-sm text-muted">
            {new Date(now).toLocaleString("en-IE", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            {Math.abs(offset) > 60_000 && <span className="ml-1.5 text-amber-400">({formatOffset(offset)})</span>}
          </p>
        </div>
        <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-surface-2 text-muted hover:text-fg" aria-label="Close demo controls">
          <X size={16} />
        </button>
      </div>

      <Section title="Clock speed">
        <div className="grid grid-cols-5 gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s.speed}
              onClick={() => demo.setSpeed(s.speed)}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition ${
                demo.speed === s.speed ? "bg-fg text-bg" : "bg-surface-2 text-muted hover:text-fg"
              }`}
            >
              {s.speed === 0 ? <Pause size={14} /> : s.speed === 1 ? <Play size={14} /> : <FastForward size={14} />}
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Jump ahead">
        <div className="grid grid-cols-4 gap-1">
          {JUMPS.map((j) => (
            <button key={j.ms} onClick={() => demo.jump(j.ms)} className="rounded-xl bg-surface-2 py-2 text-xs font-semibold text-muted hover:text-fg">
              {j.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Open orders fill along the way, exactly when their price is reached.</p>
      </Section>

      <Section title="Trigger a scenario">
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="mb-2 w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm font-semibold outline-none"
        >
          <option value="*">Whole market</option>
          {pageSymbol && <option value="page">This asset ({pageSymbol})</option>}
          {market.listAssets().map((a) => (
            <option key={a.symbol} value={a.symbol}>
              {a.name} ({a.symbol})
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-1.5">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.label}
              onClick={() =>
                demo.addEvent({
                  label: sc.label,
                  symbol: effectiveTarget,
                  move: sc.move,
                  duration: sc.duration,
                  kind: sc.kind,
                })
              }
              className={`rounded-xl border border-line px-3 py-2 text-left transition hover:bg-surface-2 ${sc.label === "Volatility storm" ? "col-span-2" : ""}`}
            >
              <span className={`block text-sm font-semibold ${sc.tone === "loss" ? "text-loss" : sc.tone === "gain" ? "text-gain" : "text-accent"}`}>
                {sc.label}
              </span>
              <span className="block text-xs text-muted">{sc.detail}</span>
            </button>
          ))}
        </div>
        {demo.events.length > 0 && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <span>
              {demo.events.length} scenario{demo.events.length === 1 ? "" : "s"} active
            </span>
            <button onClick={demo.clearEvents} className="font-semibold text-accent">
              Clear
            </button>
          </div>
        )}
      </Section>

      <button
        disabled={live}
        onClick={() => demo.goLive()}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-fg py-3 text-sm font-semibold text-bg disabled:opacity-40"
      >
        <Radio size={15} /> {live ? "Live" : "Back to live"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Only affects this browser. Shortcut: <kbd className="rounded bg-surface-2 px-1">Shift</kbd> + <kbd className="rounded bg-surface-2 px-1">D</kbd>
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      {children}
    </div>
  );
}

function formatOffset(ms: number) {
  const sign = ms >= 0 ? "+" : "−";
  const abs = Math.abs(ms);
  if (abs >= DAY) return `${sign}${(abs / DAY).toFixed(1)} days`;
  if (abs >= HOUR) return `${sign}${(abs / HOUR).toFixed(1)} h`;
  return `${sign}${Math.round(abs / MINUTE)} min`;
}

/** Thin bar at the top of the page whenever the market isn't live. */
export function DemoBanner() {
  const demo = useDemoStore();
  const now = useNow();
  if (isLive(demo)) return null;
  const speed = SPEEDS.find((s) => s.speed === demo.speed)?.label ?? `${demo.speed}×`;
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center justify-center gap-3 border-b border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-200 backdrop-blur md:-mx-8 xl:-mx-12">
      <Zap size={13} className="text-amber-400" />
      <span className="tabular">
        Demo mode · {new Date(now).toLocaleString("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} ·{" "}
        {demo.speed === 0 ? "paused" : speed}
        {demo.events.length > 0 && ` · ${demo.events.length} scenario${demo.events.length === 1 ? "" : "s"}`}
      </span>
      <button onClick={() => demo.setPanelOpen(true)} className="font-semibold text-amber-400 hover:underline">
        Controls
      </button>
      <button onClick={() => demo.goLive()} className="font-semibold text-amber-400 hover:underline">
        Back to live
      </button>
    </div>
  );
}
