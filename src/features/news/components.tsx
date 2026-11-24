"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Leaf, Newspaper, TrendingDown, TrendingUp, Minus, Smile, Siren } from "lucide-react";
import { Card, ChangePill, SectionTitle, EmptyState } from "@/components/ui";
import { useDemoStore } from "@/lib/demo/store";
import { market } from "@/lib/market/provider";
import { useAccount } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { toast } from "@/lib/ui/toasts";
import { newsFeed, type NewsItem, type Sentiment } from "./generator";

const ICON: Record<Sentiment, typeof Newspaper> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
  fun: Smile,
  esg: Leaf,
  breaking: Siren,
};

const ICON_STYLE: Record<Sentiment, string> = {
  up: "bg-gain/12 text-gain",
  down: "bg-loss/12 text-loss",
  flat: "bg-surface-2 text-muted",
  fun: "bg-accent/12 text-accent",
  esg: "bg-gain/12 text-gain",
  breaking: "bg-loss text-white",
};

/** Feed for the current moment, including BREAKING items from demo scenarios. */
function useFeed(now: number, opts: { symbol?: string; limit?: number; lookback?: number } = {}) {
  const events = useDemoStore((s) => s.events);
  // Stories only change at slot boundaries; recompute once per market minute.
  const minute = Math.floor(now / 60_000);
  return useMemo(
    () => (minute ? newsFeed(minute * 60_000 + 59_999, { ...opts, events }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minute, events, opts.symbol, opts.limit, opts.lookback],
  );
}

export function timeAgo(t: number, now: number) {
  const s = Math.max(0, (now - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86_400)} d ago`;
}

export function NewsList({ items, now, compact = false }: { items: NewsItem[]; now: number; compact?: boolean }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((n) => {
        const Icon = ICON[n.sentiment];
        return (
          <li key={n.id} className={`flex gap-3 ${compact ? "py-3" : "px-1 py-4"}`}>
            <span className={`grid size-8 shrink-0 place-items-center rounded-full ${ICON_STYLE[n.sentiment]}`}>
              <Icon size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
                {n.sentiment === "breaking" ? (
                  <span className="rounded bg-loss px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">BREAKING</span>
                ) : (
                  <span className="font-semibold text-fg/80">{n.source}</span>
                )}
                <span>{timeAgo(n.t, now)}</span>
              </p>
              <p className={`mt-1 leading-snug ${compact ? "text-sm" : "text-[15px]"} font-medium`}>{n.headline}</p>
              {n.symbols.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {n.symbols.map((s) => (
                    <Link key={s} href={`/asset/${s}`} className="flex items-center gap-1.5 rounded-full bg-surface-2 py-0.5 pr-1 pl-2.5 text-xs font-semibold hover:bg-line">
                      {s}
                      <ChangePill value={market.quote(s, now).changePct} className="!py-0 text-[11px]" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const Disclaimer = () => <p className="mt-3 text-[11px] text-muted">Satirical news generated from simulated prices. Not real, not advice.</p>;

/** Home widget: latest headlines. */
export function NewsWidget({ now }: { now: number }) {
  const items = useFeed(now, { limit: 5 });
  return (
    <div>
      <SectionTitle
        action={
          <Link href="/news" className="text-sm font-semibold text-accent">
            All news
          </Link>
        }
      >
        Market news
      </SectionTitle>
      <Card className="px-4 py-1">
        <NewsList items={items} now={now} compact />
        <div className="pb-3">
          <Disclaimer />
        </div>
      </Card>
    </div>
  );
}

/** Asset panel: stories about this asset. */
export function AssetNews({ symbol, now }: { symbol: string; now: number }) {
  const items = useFeed(now, { symbol, limit: 4, lookback: 5 * 86_400_000 });
  return (
    <div>
      <SectionTitle>News</SectionTitle>
      <Card className="px-4 py-1">
        {items.length === 0 ? <p className="py-4 text-sm text-muted">Suspiciously quiet. No news yet.</p> : <NewsList items={items} now={now} compact />}
        <div className="pb-3">
          <Disclaimer />
        </div>
      </Card>
    </div>
  );
}

/** Runner: pop a toast when a BREAKING story appears. */
const seen = new Set<string>();
let primed = false;
export function NewsRunner({ now }: { now: number }) {
  const events = useDemoStore((s) => s.events);
  useEffect(() => {
    if (!now) return;
    const breaking = events.filter((e) => e.headline && e.start <= now);
    if (!primed) {
      breaking.forEach((e) => seen.add(e.id));
      primed = true;
      return;
    }
    for (const e of breaking) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      toast({ title: "BREAKING", body: e.headline, tone: e.move < 0 ? "loss" : e.move > 0 ? "gain" : "neutral", href: "/news" });
    }
  }, [now, events]);
  return null;
}

type Filter = "all" | "holdings" | "watchlist" | "breaking" | "esg" | "fun";

/** The /news page. */
export function NewsScreen() {
  const now = useNow();
  const account = useAccount();
  const [filter, setFilter] = useState<Filter>("all");
  const items = useFeed(now, { limit: 200, lookback: 4 * 86_400_000 });
  const held = new Set(Object.keys(account.positions));
  const watched = new Set(account.watchlist);
  const shown = items.filter((n) =>
    filter === "all"
      ? true
      : filter === "holdings"
        ? n.symbols.some((s) => held.has(s))
        : filter === "watchlist"
          ? n.symbols.some((s) => watched.has(s))
          : filter === "breaking"
            ? n.sentiment === "breaking"
            : filter === "esg"
              ? n.sentiment === "esg"
              : n.sentiment === "fun",
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">News</h1>
        <p className="mt-2 text-sm text-muted">
          Satirical headlines generated from the simulated market. The moves are real (in the simulator); the reasons are not. Try a scenario
          in the demo controls to make BREAKING news.
        </p>
      </div>
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {(
          [
            ["all", "All"],
            ["holdings", "My investments"],
            ["watchlist", "Watchlist"],
            ["breaking", "Breaking"],
            ["esg", "🌱 ESG"],
            ["fun", "Just for fun"],
          ] as const
        ).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === f ? "bg-fg text-bg" : "bg-surface text-muted hover:text-fg"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <Card className="px-4">
        {shown.length === 0 ? (
          <EmptyState title="No news here" body={filter === "breaking" ? "Trigger a scenario in the demo controls (Shift + D)." : "Nothing matches this filter yet."} />
        ) : (
          <NewsList items={shown} now={now} />
        )}
      </Card>
    </div>
  );
}
