"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, FastForward, Pause, Play, Radio, RotateCcw, SkipForward, Trash2, Wallet, X, Zap } from "lucide-react";
import { ASSET_TYPE_LABEL, REGION_FLAG, REGIONS } from "@/lib/market/assets";
import { isLive, useDemoStore } from "@/lib/demo/store";
import { market } from "@/lib/market/provider";
import { DAY, HOUR, MINUTE, targetLabel, type MarketEvent } from "@/lib/market/simulator";
import { openOrders } from "@/lib/trading/orders";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { clockOffset, useNow } from "@/lib/ui/clock";
import { money, pct } from "@/lib/ui/format";
import { toast } from "@/lib/ui/toasts";

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const SPEEDS = [
  { speed: 0, label: "Pause" },
  { speed: 1, label: "Live speed" },
  { speed: 10, label: "10×" },
  { speed: 60, label: "1 min/s" },
  { speed: 600, label: "10 min/s" },
  { speed: 3600, label: "1 h/s" },
  { speed: 86_400, label: "1 day/s" },
];

const STEPS = [
  { ms: MINUTE, label: "+1 min" },
  { ms: 15 * MINUTE, label: "+15 min" },
  { ms: HOUR, label: "+1 h" },
  { ms: DAY, label: "+1 day" },
  { ms: 7 * DAY, label: "+1 week" },
  { ms: 30 * DAY, label: "+1 month" },
];

const DURATIONS = [
  { ms: MINUTE, label: "1 minute" },
  { ms: 5 * MINUTE, label: "5 minutes" },
  { ms: 15 * MINUTE, label: "15 minutes" },
  { ms: 30 * MINUTE, label: "30 minutes" },
  { ms: HOUR, label: "1 hour" },
  { ms: 4 * HOUR, label: "4 hours" },
  { ms: DAY, label: "1 day" },
];

const DELAYS = [
  { ms: 0, label: "Now" },
  { ms: MINUTE, label: "In 1 minute" },
  { ms: 5 * MINUTE, label: "In 5 minutes" },
  { ms: 15 * MINUTE, label: "In 15 minutes" },
  { ms: HOUR, label: "In 1 hour" },
  { ms: DAY, label: "Tomorrow" },
];

type Preset = {
  label: string;
  detail: string;
  tone: "gain" | "loss" | "accent";
  /** Fixed targets; when absent the preset uses the selected target. */
  events: (target: string) => Omit<MarketEvent, "id" | "start">[];
};

const PRESETS: Preset[] = [
  {
    label: "Crash",
    detail: "−15% over 10 min",
    tone: "loss",
    events: (target) => [{ label: "Crash", target, move: -0.15, duration: 10 * MINUTE, kind: "move", headline: "Markets plunge as everyone tries to sell at the same time, citing “vibes”" }],
  },
  {
    label: "Flash dip",
    detail: "−6% in 1 min",
    tone: "loss",
    events: (target) => [{ label: "Flash dip", target, move: -0.06, duration: MINUTE, kind: "move", headline: "Flash dip! Someone fat-fingered a sell order; their cat is under investigation" }],
  },
  {
    label: "Rally",
    detail: "+12% over 30 min",
    tone: "gain",
    events: (target) => [{ label: "Rally", target, move: 0.12, duration: 30 * MINUTE, kind: "move", headline: "Markets rally as traders collectively decide to be optimistic for once" }],
  },
  {
    label: "Spike",
    detail: "+8% in 1 min",
    tone: "gain",
    events: (target) => [{ label: "Spike", target, move: 0.08, duration: MINUTE, kind: "move", headline: "Sudden spike sends short sellers sprinting for the back door" }],
  },
  {
    label: "Meme mania",
    detail: "+45% over 15 min",
    tone: "gain",
    events: (target) => [{ label: "Meme mania", target, move: 0.45, duration: 15 * MINUTE, kind: "move", headline: "Internet forum discovers a stock; rocket emojis reach record high" }],
  },
  {
    label: "Volatility storm",
    detail: "Wild swings for 1 hour",
    tone: "accent",
    events: (target) => [{ label: "Volatility storm", target, move: 0, duration: HOUR, kind: "volatility", headline: "Volatility storm: analysts advise everyone to “hold on to something”" }],
  },
  {
    label: "Tech selloff",
    detail: "Tech −10%, chips −14%",
    tone: "loss",
    events: () => [
      { label: "Tech selloff", target: "sector:Technology", move: -0.1, duration: 30 * MINUTE, kind: "move", headline: "Tech stocks slide after someone asks what all these AI chips are actually for" },
      { label: "Tech selloff", target: "sector:Semiconductors", move: -0.14, duration: 30 * MINUTE, kind: "move" },
    ],
  },
  {
    label: "Crypto winter",
    detail: "Crypto −35% over 2 h",
    tone: "loss",
    events: () => [{ label: "Crypto winter", target: "type:crypto", move: -0.35, duration: 2 * HOUR, kind: "move", headline: "Crypto winter arrives; laser-eyed profile pictures quietly replaced with cats" }],
  },
  {
    label: "Tulip mania",
    detail: "🇳🇱 +25% over 30 min",
    tone: "gain",
    events: () => [{ label: "Tulip mania", target: "region:Netherlands", move: 0.25, duration: 30 * MINUTE, kind: "move", headline: "Tulip mania 2.0: Dutch stocks bloom as traders swap shares for bulbs" }],
  },
  {
    label: "Waffle shortage",
    detail: "🇧🇪 −10% over 20 min",
    tone: "loss",
    events: () => [{ label: "Waffle shortage", target: "region:Belgium", move: -0.1, duration: 20 * MINUTE, kind: "move", headline: "Belgian stocks slide as national waffle reserves run critically low" }],
  },
  {
    label: "Autobahn rally",
    detail: "🇩🇪 +8% in 5 min",
    tone: "gain",
    events: () => [{ label: "Autobahn rally", target: "region:Germany", move: 0.08, duration: 5 * MINUTE, kind: "move", headline: "German stocks rally on a stretch with no speed limit" }],
  },
  {
    label: "Bank wobble",
    detail: "Financials −12%",
    tone: "loss",
    events: () => [{ label: "Bank wobble", target: "sector:Financials", move: -0.12, duration: 20 * MINUTE, kind: "move", headline: "Bank stocks wobble as customers remember money is “just numbers on a screen”" }],
  },
];

type Tab = "clock" | "scenarios" | "account";

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

/** Presenter panel: toggle with Shift + D, or from the sidebar / Account page. */
export function DemoControls() {
  const open = useDemoStore((s) => s.panelOpen);
  const setOpen = useDemoStore((s) => s.setPanelOpen);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      const demo = useDemoStore.getState();
      if (!e.shiftKey) {
        if (e.key === "Escape") setOpen(false);
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "d") setOpen(!demo.panelOpen);
      else if (key === "p") demo.setSpeed(demo.speed === 0 ? 1 : 0);
      else if (key === "l") demo.goLive();
      else if (key === ">" || key === ".") demo.jump(HOUR);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return open ? <Panel onClose={() => setOpen(false)} /> : null;
}

function Panel({ onClose }: { onClose: () => void }) {
  const now = useNow();
  const demo = useDemoStore();
  const [tab, setTab] = useState<Tab>("scenarios");
  const live = isLive(demo);
  const offset = clockOffset();
  const status = demo.speed === 0 ? "Paused" : live ? "Live" : "Demo";

  return (
    <div className="animate-sheet fixed right-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-40 flex max-h-[calc(100dvh-110px)] w-[min(440px,calc(100vw-24px))] flex-col rounded-3xl border border-demo/30 bg-surface/95 shadow-2xl backdrop-blur-xl md:right-6 md:bottom-6 md:max-h-[calc(100dvh-48px)]">
      {/* Header */}
      <div className="border-b border-line p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <Zap size={16} className="text-demo" /> Demo controls
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  status === "Live" ? "bg-gain/15 text-gain" : status === "Paused" ? "bg-surface-2 text-fg" : "bg-demo/15 text-demo"
                }`}
              >
                {status}
              </span>
            </p>
            <p className="tabular mt-2 text-2xl font-semibold tracking-tight">
              {new Date(now).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="tabular text-xs text-muted">
              {new Date(now).toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {Math.abs(offset) > 60_000 && <span className="text-demo"> · {formatOffset(offset)} vs real time</span>}
            </p>
          </div>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-surface-2 text-muted hover:text-fg" aria-label="Close demo controls">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 rounded-full bg-surface-2 p-0.5 text-xs font-semibold">
          {(["clock", "scenarios", "account"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full py-1.5 capitalize ${tab === t ? "bg-line text-fg" : "text-muted hover:text-fg"}`}
            >
              {t}
              {t === "scenarios" && demo.events.length > 0 && <span className="ml-1 text-demo">{demo.events.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {tab === "clock" && <ClockTab now={now} />}
        {tab === "scenarios" && <ScenariosTab now={now} />}
        {tab === "account" && <AccountTab now={now} />}
      </div>

      {/* Footer */}
      <div className="border-t border-line p-4">
        <button
          disabled={live}
          onClick={() => demo.goLive()}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-fg py-2.5 text-sm font-semibold text-bg disabled:opacity-40"
        >
          <Radio size={15} /> {live ? "Live: real time, no scenarios" : "Back to live"}
        </button>
        <p className="mt-2.5 text-center text-[11px] text-muted">
          Only this browser. <Kbd>⇧D</Kbd> panel · <Kbd>⇧P</Kbd> pause · <Kbd>⇧.</Kbd> +1 h · <Kbd>⇧L</Kbd> live
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clock
// ---------------------------------------------------------------------------

function ClockTab({ now }: { now: number }) {
  const demo = useDemoStore();
  const [custom, setCustom] = useState("");
  const [date, setDate] = useState("");
  const target = date ? new Date(date).getTime() : NaN;

  return (
    <>
      <Section title="Speed" note="How fast market time runs compared to real time.">
        <div className="grid grid-cols-4 gap-1.5">
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = Number(custom);
              if (v >= 0) demo.setSpeed(v);
            }}
            className="flex items-center gap-1 rounded-xl bg-surface-2 px-2"
          >
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="×"
              className="tabular w-full min-w-0 bg-transparent text-center text-xs font-semibold outline-none placeholder:text-muted"
              aria-label="Custom speed multiplier"
            />
          </form>
        </div>
        {!SPEEDS.some((s) => s.speed === demo.speed) && <p className="mt-2 text-xs text-demo">Custom speed: {demo.speed}×</p>}
      </Section>

      <Section title="Step forward" note="Open orders, alerts and news catch up along the way.">
        <div className="grid grid-cols-3 gap-1.5">
          {STEPS.map((s) => (
            <button key={s.ms} onClick={() => demo.jump(s.ms)} className="flex items-center justify-center gap-1.5 rounded-xl bg-surface-2 py-2 text-xs font-semibold text-muted hover:text-fg">
              <SkipForward size={13} /> {s.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Jump to a moment">
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm outline-none [color-scheme:dark]"
          />
          <button
            disabled={!(target > now)}
            onClick={() => demo.jump(target - now)}
            className="flex items-center gap-1.5 rounded-xl bg-fg px-4 text-sm font-semibold text-bg disabled:opacity-40"
          >
            <CalendarClock size={15} /> Go
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">Only forward in time, so your trade history stays consistent.</p>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

function TargetSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const pathname = usePathname();
  const pageSymbol = pathname.startsWith("/asset/") ? decodeURIComponent(pathname.split("/")[2]) : null;
  const assets = market.listAssets();
  const sectors = [...new Set(assets.map((a) => a.sector))].sort();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm font-semibold outline-none"
    >
      <option value="*">Whole market</option>
      {pageSymbol && <option value={pageSymbol}>This asset ({pageSymbol})</option>}
      <optgroup label="Asset types">
        {(["stock", "etf", "crypto"] as const).map((t) => (
          <option key={t} value={`type:${t}`}>
            All {ASSET_TYPE_LABEL[t].toLowerCase()}
          </option>
        ))}
      </optgroup>
      <optgroup label="Regions">
        {REGIONS.map((r) => (
          <option key={r} value={`region:${r}`}>
            {REGION_FLAG[r]} {r === "Europe" ? "Rest of Europe" : r}
          </option>
        ))}
      </optgroup>
      <optgroup label="Sectors">
        {sectors.map((s) => (
          <option key={s} value={`sector:${s}`}>
            {s}
          </option>
        ))}
      </optgroup>
      <optgroup label="Single asset">
        {assets.map((a) => (
          <option key={a.symbol} value={a.symbol}>
            {a.name} ({a.symbol})
          </option>
        ))}
      </optgroup>
    </select>
  );
}

function ScenariosTab({ now }: { now: number }) {
  const demo = useDemoStore();
  const pathname = usePathname();
  const pageSymbol = pathname.startsWith("/asset/") ? decodeURIComponent(pathname.split("/")[2]) : null;
  const [target, setTarget] = useState<string>(pageSymbol ?? "*");

  // Custom builder state
  const [kind, setKind] = useState<MarketEvent["kind"]>("move");
  const [size, setSize] = useState(-10);
  const [duration, setDuration] = useState(15 * MINUTE);
  const [delay, setDelay] = useState(0);
  const [headline, setHeadline] = useState("");

  function addCustom() {
    const label = kind === "volatility" ? "Custom volatility" : `Custom ${size > 0 ? "+" : ""}${size}%`;
    demo.addEvent({ label, target, move: size / 100, duration, kind, headline: headline.trim() || undefined }, delay);
    setHeadline("");
    toast({ title: `Scenario ${delay ? "scheduled" : "started"}`, body: `${label} · ${targetLabel(target)}`, tone: "neutral" });
  }

  return (
    <>
      <Section title="Who is affected">
        <TargetSelect value={target} onChange={setTarget} />
        <p className="mt-2 text-xs text-muted">Groups move by each asset&apos;s volatility: crypto and chip stocks swing harder than ETFs.</p>
      </Section>

      <Section title="Quick scenarios" note="Each one also posts a BREAKING headline in the news feed.">
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => p.events(target).forEach((e) => demo.addEvent(e))}
              className="rounded-xl border border-line px-2.5 py-2 text-left transition hover:bg-surface-2"
            >
              <span className={`block text-[13px] font-semibold ${p.tone === "loss" ? "text-loss" : p.tone === "gain" ? "text-gain" : "text-accent"}`}>
                {p.label}
              </span>
              <span className="block text-[11px] leading-tight text-muted">{p.detail}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">The last six presets have their own targets and ignore the selection above.</p>
      </Section>

      <Section title="Build your own">
        <div className="flex flex-col gap-3 rounded-2xl bg-surface-2 p-3">
          <div className="grid grid-cols-2 rounded-full bg-bg p-0.5 text-xs font-semibold">
            {(["move", "volatility"] as const).map((k) => (
              <button key={k} onClick={() => setKind(k)} className={`rounded-full py-1.5 capitalize ${kind === k ? "bg-line text-fg" : "text-muted"}`}>
                {k === "move" ? "Price move" : "Volatility"}
              </button>
            ))}
          </div>
          {kind === "move" && (
            <label className="block">
              <span className="flex justify-between text-xs text-muted">
                Size
                <span className={`tabular font-semibold ${size > 0 ? "text-gain" : size < 0 ? "text-loss" : "text-fg"}`}>
                  {size > 0 ? "+" : ""}
                  {size}%
                </span>
              </span>
              <input type="range" min={-60} max={60} step={1} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 w-full accent-[var(--color-accent)]" />
            </label>
          )}
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted">
              Plays out over
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line bg-bg px-2 py-1.5 text-sm font-semibold text-fg outline-none">
                {DURATIONS.map((d) => (
                  <option key={d.ms} value={d.ms}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted">
              Starts
              <select value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line bg-bg px-2 py-1.5 text-sm font-semibold text-fg outline-none">
                {DELAYS.map((d) => (
                  <option key={d.ms} value={d.ms}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-xs text-muted">
            Headline (optional, appears as BREAKING news)
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Coffee shortage hits trading floors"
              className="mt-1 w-full rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm text-fg outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <button
            disabled={kind === "move" && size === 0}
            onClick={addCustom}
            className="rounded-full bg-accent py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
          >
            {delay ? "Schedule scenario" : "Start scenario"}
          </button>
        </div>
      </Section>

      <Section
        title={`Active scenarios (${demo.events.length})`}
        action={
          demo.events.length > 0 && (
            <button onClick={demo.clearEvents} className="text-xs font-semibold text-accent">
              Clear all
            </button>
          )
        }
      >
        {demo.events.length === 0 ? (
          <p className="text-xs text-muted">Nothing running. The market is behaving (for now).</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {[...demo.events].reverse().map((e) => {
              const progress = Math.min(1, Math.max(0, (now - e.start) / e.duration));
              const state = now < e.start ? `Starts in ${formatDuration(e.start - now)}` : progress < 1 ? `Playing · ${Math.round(progress * 100)}%` : "Done, effect stays";
              return (
                <li key={e.id} className="rounded-xl border border-line p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {e.label}{" "}
                        {e.kind === "move" && (
                          <span className={`tabular ${e.move < 0 ? "text-loss" : "text-gain"}`}>{pct(e.move)}</span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {targetLabel(e.target)} · {state}
                      </span>
                    </span>
                    <button onClick={() => demo.removeEvent(e.id)} className="text-muted hover:text-loss" aria-label="Remove scenario">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-demo transition-[width]" style={{ width: `${progress * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {demo.events.length > 0 && <p className="mt-2 text-[11px] text-muted">Removing a scenario also removes its effect from the charts.</p>}
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

function AccountTab({ now }: { now: number }) {
  const account = useAccount();
  const store = useAccountStore();
  const [confirm, setConfirm] = useState<"demo" | "fresh" | null>(null);
  const open = openOrders(account);
  const invested = Object.values(account.positions).reduce((s, p) => s + p.quantity * market.priceAt(p.symbol, now), 0);

  return (
    <>
      <Section title="Right now">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Cash", money(account.cash)],
            ["Invested", money(invested)],
            ["Open orders", String(open.length)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface-2 p-2.5">
              <p className="text-[11px] text-muted">{label}</p>
              <p className="tabular text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Play money">
        <div className="grid grid-cols-3 gap-1.5">
          {[1_000, 10_000, 100_000].map((v) => (
            <button key={v} onClick={() => store.deposit(v)} className="flex items-center justify-center gap-1.5 rounded-xl bg-surface-2 py-2 text-xs font-semibold text-muted hover:text-fg">
              <Wallet size={13} /> +{money(v).replace(".00", "")}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Orders">
        <button
          disabled={open.length === 0}
          onClick={() => open.forEach((o) => store.cancelOrder(o.id))}
          className="w-full rounded-xl bg-surface-2 py-2 text-xs font-semibold text-muted hover:text-fg disabled:opacity-40"
        >
          Cancel all open orders
        </button>
      </Section>

      <Section title="Start over" note="Wipes positions and history in this browser.">
        <div className="grid grid-cols-2 gap-1.5">
          {(["demo", "fresh"] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                if (confirm !== k) return setConfirm(k);
                store.reset(k);
                setConfirm(null);
                toast({ title: k === "demo" ? "Demo portfolio restored" : "Fresh €10,000 account", tone: "neutral" });
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold ${
                confirm === k ? "bg-loss text-white" : "bg-surface-2 text-muted hover:text-fg"
              }`}
            >
              <RotateCcw size={13} />
              {confirm === k ? "Click again to confirm" : k === "demo" ? "Demo portfolio" : "Empty account"}
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Bits
// ---------------------------------------------------------------------------

function Section({ title, note, action, children }: { title: string; note?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
        {action}
      </div>
      {children}
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded bg-surface-2 px-1 font-sans">{children}</kbd>;
}

function formatDuration(ms: number) {
  if (ms >= DAY) return `${(ms / DAY).toFixed(1)} days`;
  if (ms >= HOUR) return `${(ms / HOUR).toFixed(1)} h`;
  if (ms >= MINUTE) return `${Math.ceil(ms / MINUTE)} min`;
  return `${Math.ceil(ms / 1000)} s`;
}

function formatOffset(ms: number) {
  return `${ms >= 0 ? "+" : "−"}${formatDuration(Math.abs(ms))}`;
}

/** Thin bar at the top of the page whenever the market isn't live. */
export function DemoBanner() {
  const demo = useDemoStore();
  const now = useNow();
  if (isLive(demo)) return null;
  const speed = SPEEDS.find((s) => s.speed === demo.speed)?.label ?? `${demo.speed}×`;
  const running = demo.events.filter((e) => now >= e.start && now < e.start + e.duration).length;
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-demo/30 bg-demo/10 px-4 py-2 text-xs font-medium text-demo backdrop-blur md:-mx-8 xl:-mx-12">
      <Zap size={13} />
      <span className="tabular">
        Demo mode · {new Date(now).toLocaleString("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} ·{" "}
        {demo.speed === 0 ? "paused" : speed}
        {demo.events.length > 0 && ` · ${demo.events.length} scenario${demo.events.length === 1 ? "" : "s"}${running ? ` (${running} playing)` : ""}`}
      </span>
      <button onClick={() => demo.setPanelOpen(true)} className="font-semibold underline-offset-2 hover:underline">
        Controls
      </button>
      <button onClick={() => demo.goLive()} className="font-semibold underline-offset-2 hover:underline">
        Back to live
      </button>
    </div>
  );
}
