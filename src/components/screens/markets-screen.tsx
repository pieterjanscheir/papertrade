"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import { ASSET_TYPE_LABEL, REGION_FLAG, REGIONS, type Asset, type AssetType, type Region } from "@/lib/market/assets";
import { market } from "@/lib/market/provider";
import { DAY, YEAR, type Quote } from "@/lib/market/simulator";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { pct, price as fmtPrice, tone } from "@/lib/ui/format";
import { usePref } from "@/lib/ui/prefs";
import { DataTable, type Column } from "../data-table";
import { Sparkline } from "../price-chart";
import { Tilt } from "../tilt";
import { AssetAvatar, Card, ChangePill } from "../ui";

type Filter = "all" | "watchlist" | AssetType;

const OVERVIEW = ["CSPX", "DAX", "AEX", "BEL20"];

/** Sparkline points over the past week, every 6 hours. */
function weekSpark(symbol: string, now: number): number[] {
  return Array.from({ length: 29 }, (_, i) => market.priceAt(symbol, now - (28 - i) * (DAY / 4)));
}

interface Row {
  a: Asset;
  quote: Quote;
  year: number;
}

export function MarketsScreen() {
  const now = useNow();
  const router = useRouter();
  const account = useAccount();
  const toggleWatch = useAccountStore((s) => s.toggleWatch);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = usePref<Filter>("markets.filter", "all");
  const [region, setRegion] = usePref<Region | "all">("markets.region", "all");

  const q = query.trim().toLowerCase();
  const rows: Row[] = market
    .listAssets()
    .filter((a) => (filter === "all" ? true : filter === "watchlist" ? account.watchlist.includes(a.symbol) : a.type === filter))
    .filter((a) => region === "all" || a.region === region)
    .filter((a) => !q || `${a.name} ${a.symbol} ${a.sector} ${a.region} ${a.exchange}`.toLowerCase().includes(q))
    .map((a) => {
      const quote = market.quote(a.symbol, now);
      return { a, quote, year: quote.price / market.priceAt(a.symbol, now - YEAR) - 1 };
    });

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (r) => r.a.name,
      render: ({ a }) => {
        const watched = account.watchlist.includes(a.symbol);
        return (
          <span className="flex items-center gap-3">
            <button
              onClick={(e) => (e.stopPropagation(), toggleWatch(a.symbol))}
              className={watched ? "text-amber-400" : "text-line hover:text-muted"}
              aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Star size={15} fill={watched ? "currentColor" : "none"} />
            </button>
            <AssetAvatar asset={a} size={34} />
            <span className="min-w-0">
              <span className="block font-semibold">{a.name}</span>
              <span className="block text-xs text-muted">
                {REGION_FLAG[a.region]} {a.symbol} · {ASSET_TYPE_LABEL[a.type].replace(/s$/, "")}
              </span>
            </span>
          </span>
        );
      },
    },
    { key: "price", header: "Price", align: "right", sortValue: (r) => r.quote.price, render: (r) => <span className="font-semibold">{fmtPrice(r.quote.price)}</span> },
    { key: "24h", header: "24h", align: "right", sortValue: (r) => r.quote.changePct, render: (r) => <ChangePill value={r.quote.changePct} /> },
    { key: "1y", header: "1Y", align: "right", sortValue: (r) => r.year, render: (r) => <span className={`font-semibold ${tone(r.year)}`}>{pct(r.year)}</span> },
    {
      key: "spark",
      header: "7 days",
      align: "center",
      card: false,
      render: (r) => (
        <span className="inline-block">
          <Sparkline values={weekSpark(r.a.symbol, now)} width={110} height={30} />
        </span>
      ),
    },
    { key: "sector", header: "Sector", sortValue: (r) => r.a.sector, render: (r) => <span className="text-muted">{r.a.sector}</span> },
    { key: "region", header: "Region", sortValue: (r) => r.a.region, render: (r) => <span className="text-muted">{r.a.region}</span> },
    { key: "exchange", header: "Exchange", sortValue: (r) => r.a.exchange, render: (r) => <span className="text-muted">{r.a.exchange}</span> },
    {
      key: "trade",
      header: "",
      align: "right",
      card: false,
      render: (r) => (
        <Link
          href={`/asset/${r.a.symbol}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full bg-surface-2 px-4 py-1.5 text-xs font-semibold hover:bg-gain hover:text-black"
        >
          Trade
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Invest</h1>
        <label className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 focus-within:border-accent md:w-96">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks, ETFs, crypto, sectors"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </label>
      </div>

      {/* Market overview */}
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 py-1 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {OVERVIEW.map((s) => {
          const a = market.getAsset(s)!;
          const quote = market.quote(s, now);
          return (
            <Tilt key={s} className="min-w-44">
              <Link href={`/asset/${s}`} className="block rounded-[var(--radius-card)] border border-line bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {REGION_FLAG[a.region]} {a.name}
                  </span>
                  <ChangePill value={quote.changePct} />
                </div>
                <p className="tabular mt-2 text-xl font-semibold">{fmtPrice(quote.price)}</p>
                <div className="mt-2 overflow-hidden">
                  <Sparkline values={market.history(s, "1D", now).filter((_, i) => i % 4 === 0).map((p) => p.price)} width={220} height={36} />
                </div>
              </Link>
            </Tilt>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {(["all", "watchlist", "stock", "etf", "crypto"] as const).map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All types" : f === "watchlist" ? "★ Watchlist" : ASSET_TYPE_LABEL[f]}
            </Chip>
          ))}
        </div>
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip active={region === "all"} onClick={() => setRegion("all")}>
            All regions
          </Chip>
          {REGIONS.map((r) => (
            <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
              {REGION_FLAG[r]} {r === "Europe" ? "Rest of Europe" : r}
            </Chip>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <DataTable
          id="markets"
          rows={rows}
          rowKey={(r) => r.a.symbol}
          columns={columns}
          onRowClick={(r) => router.push(`/asset/${r.a.symbol}`)}
          defaultSort={{ key: "name", dir: "asc" }}
          filters={[
            { key: "gainers", label: "Up today", test: (r) => r.quote.changePct > 0 },
            { key: "losers", label: "Down today", test: (r) => r.quote.changePct < 0 },
            { key: "big", label: "Moving >2%", test: (r) => Math.abs(r.quote.changePct) > 0.02 },
          ]}
          empty={filter === "watchlist" ? "Star an asset to add it to your watchlist." : `Nothing matches${query ? ` “${query}”` : " these filters"}.`}
        />
      </Card>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-fg text-bg" : "bg-surface text-muted hover:text-fg"}`}
    >
      {children}
    </button>
  );
}
