"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import { ASSET_TYPE_LABEL, REGION_FLAG, REGIONS, type AssetType, type Region } from "@/lib/market/assets";
import { market } from "@/lib/market/provider";
import { DAY, YEAR } from "@/lib/market/simulator";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { pct, price as fmtPrice, tone } from "@/lib/ui/format";
import { AssetRow } from "../asset-row";
import { Sparkline } from "../price-chart";
import { AssetAvatar, Card, ChangePill, EmptyState } from "../ui";

type Filter = "all" | "watchlist" | AssetType;
type Sort = "name" | "gainers" | "losers" | "year";

const OVERVIEW = ["CSPX", "DAX", "AEX", "BEL20"];

/** Sparkline points over the past week, every 6 hours. */
function weekSpark(symbol: string, now: number): number[] {
  return Array.from({ length: 29 }, (_, i) => market.priceAt(symbol, now - (28 - i) * (DAY / 4)));
}

export function MarketsScreen() {
  const now = useNow();
  const router = useRouter();
  const account = useAccount();
  const toggleWatch = useAccountStore((s) => s.toggleWatch);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("name");
  const [region, setRegion] = useState<Region | "all">("all");

  const q = query.trim().toLowerCase();
  const rows = market
    .listAssets()
    .filter((a) => (filter === "all" ? true : filter === "watchlist" ? account.watchlist.includes(a.symbol) : a.type === filter))
    .filter((a) => region === "all" || a.region === region)
    .filter((a) => !q || a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q) || a.sector.toLowerCase().includes(q))
    .map((a) => {
      const quote = market.quote(a.symbol, now);
      const yearAgo = market.priceAt(a.symbol, now - YEAR);
      return { a, quote, year: quote.price / yearAgo - 1 };
    })
    .sort((x, y) =>
      sort === "gainers"
        ? y.quote.changePct - x.quote.changePct
        : sort === "losers"
          ? x.quote.changePct - y.quote.changePct
          : sort === "year"
            ? y.year - x.year
            : x.a.name.localeCompare(y.a.name),
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Invest</h1>
        <label className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 focus-within:border-accent md:w-96">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks, ETFs, crypto"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </label>
      </div>

      {/* Market overview */}
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:px-0">
        {OVERVIEW.map((s) => {
          const a = market.getAsset(s)!;
          const quote = market.quote(s, now);
          return (
            <Link key={s} href={`/asset/${s}`} className="min-w-44 rounded-[var(--radius-card)] border border-line bg-surface p-4 transition hover:bg-surface-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{a.name}</span>
                <ChangePill value={quote.changePct} />
              </div>
              <p className="tabular mt-2 text-xl font-semibold">{fmtPrice(quote.price)}</p>
              <div className="mt-2">
                <Sparkline values={market.history(s, "1D", now).filter((_, i) => i % 4 === 0).map((p) => p.price)} width={220} height={36} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {(["all", "watchlist", "stock", "etf", "crypto"] as const).map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "watchlist" ? "Watchlist" : ASSET_TYPE_LABEL[f]}
          </Chip>
        ))}
        <span className="mx-1 w-px shrink-0 bg-line" />
        {(
          [
            ["name", "A–Z"],
            ["gainers", "Top gainers"],
            ["losers", "Top losers"],
            ["year", "Best 1Y"],
          ] as const
        ).map(([s, label]) => (
          <Chip key={s} active={sort === s} onClick={() => setSort(s)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="scrollbar-none -mx-4 -mt-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <Chip active={region === "all"} onClick={() => setRegion("all")}>
          All regions
        </Chip>
        {REGIONS.map((r) => (
          <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
            {REGION_FLAG[r]} {r === "Europe" ? "Rest of Europe" : r}
          </Chip>
        ))}
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState title="Nothing found" body={filter === "watchlist" ? "Star an asset to add it to your watchlist." : `No assets match “${query}”.`} />
        ) : (
          <>
            {/* Phones */}
            <div className="p-1.5 md:hidden">
              {rows.map(({ a }) => (
                <AssetRow key={a.symbol} symbol={a.symbol} now={now} subtitle={`${REGION_FLAG[a.region]} ${a.symbol} · ${a.sector}`} />
              ))}
            </div>

            {/* Wide screens */}
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="text-left text-xs text-muted [&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">
                  <th className="w-10" />
                  <th>Name</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">24h</th>
                  <th className="text-right">1Y</th>
                  <th className="hidden text-center lg:table-cell">7 days</th>
                  <th className="hidden xl:table-cell">Sector</th>
                  <th className="hidden 2xl:table-cell">Exchange</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ a, quote, year }) => {
                  const watched = account.watchlist.includes(a.symbol);
                  return (
                    <tr
                      key={a.symbol}
                      onClick={() => router.push(`/asset/${a.symbol}`)}
                      className="tabular cursor-pointer border-t border-line whitespace-nowrap transition hover:bg-surface-2 [&>td]:px-4 [&>td]:py-3"
                    >
                      <td>
                        <button
                          onClick={(e) => (e.stopPropagation(), toggleWatch(a.symbol))}
                          className={watched ? "text-amber-400" : "text-line hover:text-muted"}
                          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Star size={16} fill={watched ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td>
                        <Link href={`/asset/${a.symbol}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <AssetAvatar asset={a} size={34} />
                          <span>
                            <span className="block font-semibold">{a.name}</span>
                            <span className="block text-xs text-muted">
                              {REGION_FLAG[a.region]} {a.symbol} · {ASSET_TYPE_LABEL[a.type].replace(/s$/, "")}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="text-right font-semibold">{fmtPrice(quote.price)}</td>
                      <td className="text-right">
                        <ChangePill value={quote.changePct} />
                      </td>
                      <td className={`text-right font-semibold ${tone(year)}`}>{pct(year)}</td>
                      <td className="hidden lg:table-cell">
                        <div className="flex justify-center">
                          <Sparkline values={weekSpark(a.symbol, now)} width={110} height={30} />
                        </div>
                      </td>
                      <td className="hidden text-muted xl:table-cell">{a.sector}</td>
                      <td className="hidden text-muted 2xl:table-cell">{a.exchange}</td>
                      <td className="text-right">
                        <Link
                          href={`/asset/${a.symbol}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-full bg-surface-2 px-4 py-1.5 text-xs font-semibold hover:bg-gain hover:text-black"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-fg text-bg" : "bg-surface text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
