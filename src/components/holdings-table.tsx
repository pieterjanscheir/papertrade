"use client";

import { useRouter } from "next/navigation";
import { REGION_FLAG } from "@/lib/market/assets";
import { market } from "@/lib/market/provider";
import type { HoldingValue, PortfolioSummary } from "@/lib/trading/engine";
import { money, pct, price as fmtPrice, qty, signedMoney, tone } from "@/lib/ui/format";
import { DataTable, type Column } from "./data-table";
import { AssetAvatar, ChangePill } from "./ui";

/** Your positions: sortable, filterable, table or cards. */
export function HoldingsTable({ summary, now }: { summary: PortfolioSummary; now: number }) {
  const router = useRouter();
  const investedTotal = summary.holdings.reduce((s, h) => s + h.value, 0) || 1;
  const asset = (h: HoldingValue) => market.getAsset(h.symbol)!;
  const change = (h: HoldingValue) => market.quote(h.symbol, now).changePct;

  const columns: Column<HoldingValue>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (h) => asset(h).name,
      render: (h) => (
        <span className="flex items-center gap-3">
          <AssetAvatar asset={asset(h)} size={34} />
          <span className="min-w-0">
            <span className="block font-semibold">{asset(h).name}</span>
            <span className="block text-xs text-muted">
              {REGION_FLAG[asset(h).region]} {h.symbol}
            </span>
          </span>
        </span>
      ),
    },
    { key: "price", header: "Price", align: "right", sortValue: (h) => h.price, render: (h) => fmtPrice(h.price) },
    { key: "24h", header: "24h", align: "right", sortValue: change, render: (h) => <ChangePill value={change(h)} /> },
    { key: "units", header: "Units", align: "right", sortValue: (h) => h.quantity, render: (h) => <span className="text-muted">{qty(h.quantity)}</span> },
    { key: "avg", header: "Avg cost", align: "right", sortValue: (h) => h.avgCost, render: (h) => <span className="text-muted">{fmtPrice(h.avgCost)}</span> },
    { key: "value", header: "Value", align: "right", sortValue: (h) => h.value, render: (h) => <span className="font-semibold">{money(h.value)}</span> },
    {
      key: "return",
      header: "Return",
      align: "right",
      sortValue: (h) => h.pnlPct,
      render: (h) => (
        <span className={`font-semibold ${tone(h.pnl)}`}>
          {signedMoney(h.pnl)} <span className="text-xs font-medium">({pct(h.pnlPct)})</span>
        </span>
      ),
    },
    {
      key: "weight",
      header: "Weight",
      sortValue: (h) => h.value / investedTotal,
      render: (h) => (
        <span className="flex min-w-28 items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${(h.value / investedTotal) * 100}%` }} />
          </span>
          <span className="w-9 text-right text-xs text-muted">{((h.value / investedTotal) * 100).toFixed(0)}%</span>
        </span>
      ),
    },
  ];

  return (
    <DataTable
      id="holdings"
      rows={summary.holdings}
      rowKey={(h) => h.symbol}
      columns={columns}
      onRowClick={(h) => router.push(`/asset/${h.symbol}`)}
      search={(h) => `${asset(h).name} ${h.symbol} ${asset(h).sector} ${asset(h).region}`}
      searchPlaceholder="Filter holdings"
      defaultSort={{ key: "value", dir: "desc" }}
      filters={[
        { key: "stock", label: "Stocks", test: (h) => asset(h).type === "stock" },
        { key: "etf", label: "ETFs", test: (h) => asset(h).type === "etf" },
        { key: "crypto", label: "Crypto", test: (h) => asset(h).type === "crypto" },
        { key: "winners", label: "Winners", test: (h) => h.pnl > 0 },
        { key: "losers", label: "Losers", test: (h) => h.pnl < 0 },
      ]}
      empty="No holdings match this filter."
    />
  );
}
