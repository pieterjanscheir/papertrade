"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { market } from "@/lib/market/provider";
import { useAccount } from "@/lib/trading/store";
import { esgReport, quarterOf, type Pillar } from "./score";

const DISCLAIMER = "Entirely made up. Not a real ESG rating and not an opinion about the company.";

function scoreColor(score: number) {
  return score >= 75 ? "var(--color-gain)" : score >= 55 ? "var(--color-accent)" : "var(--color-loss)";
}

function Ring({ score, size = 64 }: { score: number; size?: number }) {
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="shrink-0">
      <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-surface-2)" strokeWidth="7" />
      <circle
        cx="32"
        cy="32"
        r={R}
        fill="none"
        stroke={scoreColor(score)}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * C} ${C}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" className="tabular" fontSize="16" fontWeight="600" fill="var(--color-fg)">
        {score}
      </text>
    </svg>
  );
}

function PillarRow({ p, open }: { p: Pillar; open: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-bold">{p.key}</span>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">{p.name}</span>
            <span className="tabular font-semibold">{p.score}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: scoreColor(p.score) }} />
          </div>
          <p className="mt-1 text-[11px] text-muted">{p.subtitle}</p>
        </div>
      </div>
      {open && (
        <ul className="mt-2 ml-10 space-y-1 text-xs">
          {p.metrics.map((m) => (
            <li key={m.label} className="flex justify-between gap-3">
              <span className="text-muted">{m.label}</span>
              <span className="tabular shrink-0 font-semibold">{m.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Asset panel: the ESG vibes report for one instrument. */
export function EsgPanel({ symbol, now }: { symbol: string; now: number }) {
  const [open, setOpen] = useState(false);
  const asset = market.getAsset(symbol);
  if (!asset || !now) return null;
  const report = esgReport(asset, now);

  return (
    <div>
      <SectionTitle
        action={
          <button onClick={() => setOpen(!open)} className="text-sm font-semibold text-accent">
            {open ? "Hide details" : "Full report"}
          </button>
        }
      >
        🌱 ESG vibes
      </SectionTitle>
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <Ring score={report.score} />
          <div className="min-w-0">
            <p className="text-lg font-semibold">{report.rating}</p>
            <p className="text-sm text-muted">“{report.verdict}”</p>
            <p className="text-[11px] text-muted">{report.quarter} report</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {report.pillars.map((p) => (
            <PillarRow key={p.key} p={p} open={open} />
          ))}
        </div>
        <p className="mt-4 text-[11px] text-muted">{DISCLAIMER}</p>
      </Card>
    </div>
  );
}

/** Home widget: value-weighted ESG vibes of what you own. */
export function PortfolioEsg({ now }: { now: number }) {
  const account = useAccount();
  if (!now) return null;
  const rows = Object.values(account.positions)
    .map((p) => {
      const asset = market.getAsset(p.symbol)!;
      return { asset, value: p.quantity * market.priceAt(p.symbol, now), report: esgReport(asset, now) };
    })
    .filter((r) => r.value > 0);
  if (rows.length === 0) return null;

  const total = rows.reduce((s, r) => s + r.value, 0);
  const score = Math.round(rows.reduce((s, r) => s + r.report.score * r.value, 0) / total);
  const best = rows.reduce((b, r) => (r.report.score > b.report.score ? r : b));
  const worst = rows.reduce((w, r) => (r.report.score < w.report.score ? r : w));
  const meetings = Math.round(
    rows.reduce((s, r) => s + parseInt(r.report.pillars[2].metrics.find((m) => m.label.startsWith("Meetings"))?.value ?? "60") * r.value, 0) / total,
  );

  return (
    <div>
      <SectionTitle>Portfolio ESG vibes</SectionTitle>
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <Ring score={score} size={56} />
          <div className="min-w-0 text-sm">
            <p className="font-semibold">
              <Leaf size={14} className="mr-1 inline text-gain" />
              {quarterOf(now)}: your money is “{score >= 75 ? "basically a hedge (the plant kind)" : score >= 55 ? "medium-green" : "beige, at best"}”
            </p>
            <p className="mt-1 text-muted">
              Greenest: <Link href={`/asset/${best.asset.symbol}`} className="font-semibold text-fg hover:underline">{best.asset.name}</Link>
              {worst.asset.symbol !== best.asset.symbol && (
                <>
                  {" "}· Needs a hug:{" "}
                  <Link href={`/asset/${worst.asset.symbol}`} className="font-semibold text-fg hover:underline">
                    {worst.asset.name}
                  </Link>
                </>
              )}
            </p>
            {Number.isFinite(meetings) && <p className="mt-1 text-xs text-muted">{meetings}% of meetings in your portfolio could have been an email.</p>}
          </div>
        </div>
        <p className="mt-4 text-[11px] text-muted">{DISCLAIMER}</p>
      </Card>
    </div>
  );
}
