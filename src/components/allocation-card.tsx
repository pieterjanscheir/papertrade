"use client";

import { useState } from "react";
import { ASSET_TYPE_LABEL } from "@/lib/market/assets";
import { market } from "@/lib/market/provider";
import type { PortfolioSummary } from "@/lib/trading/engine";
import { money } from "@/lib/ui/format";
import { Card } from "./ui";

type By = "asset" | "type" | "sector";

const PALETTE = ["#6d7cff", "#2fd18b", "#f5a524", "#ff5d6c", "#a46bff", "#22b8cf", "#f472b6", "#94a3b8"];

/** Donut chart of where the money is: by asset, asset type or sector. */
export function AllocationCard({ summary }: { summary: PortfolioSummary }) {
  const [by, setBy] = useState<By>("asset");

  const buckets = new Map<string, number>();
  for (const h of summary.holdings) {
    const a = market.getAsset(h.symbol)!;
    const key = by === "asset" ? a.symbol : by === "type" ? ASSET_TYPE_LABEL[a.type] : a.sector;
    buckets.set(key, (buckets.get(key) ?? 0) + h.value);
  }
  if (summary.cash > 0) buckets.set("Cash", summary.cash);

  let slices = [...buckets.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  if (slices.length > PALETTE.length) {
    const rest = slices.slice(PALETTE.length - 1).reduce((s, x) => s + x.value, 0);
    slices = [...slices.slice(0, PALETTE.length - 1), { label: "Other", value: rest }];
  }
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;

  const R = 42;
  const C = 2 * Math.PI * R;
  // Precompute where each slice starts on the ring.
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((s, x) => s + (x.value / total) * C, 0));

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Allocation</h2>
        <div className="flex rounded-full bg-surface-2 p-0.5 text-xs font-semibold">
          {(["asset", "type", "sector"] as const).map((b) => (
            <button key={b} onClick={() => setBy(b)} className={`rounded-full px-2.5 py-1 capitalize ${by === b ? "bg-line text-fg" : "text-muted"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="size-28 shrink-0 -rotate-90">
          {slices.map((s, i) => {
            const len = (s.value / total) * C;
            return (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={s.label === "Cash" ? "#3a3f4b" : PALETTE[i % PALETTE.length]}
                strokeWidth="14"
                strokeDasharray={`${Math.max(len - 1.2, 0)} ${C}`}
                strokeDashoffset={-starts[i]}
              />
            );
          })}
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
          {slices.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2" title={money(s.value)}>
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.label === "Cash" ? "#3a3f4b" : PALETTE[i % PALETTE.length] }} />
              <span className="min-w-0 flex-1 truncate">{s.label}</span>
              <span className="tabular font-semibold">{((s.value / total) * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
