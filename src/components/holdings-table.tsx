"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { market } from "@/lib/market/provider";
import type { PortfolioSummary } from "@/lib/trading/engine";
import { money, pct, price as fmtPrice, qty, signedMoney, tone } from "@/lib/ui/format";
import { AssetRow } from "./asset-row";
import { AssetAvatar } from "./ui";

/** Table on wide screens, compact rows on phones. */
export function HoldingsTable({ summary, now }: { summary: PortfolioSummary; now: number }) {
  const router = useRouter();
  const investedTotal = summary.invested || 1;

  return (
    <>
      <div className="p-1.5 md:hidden">
        {summary.holdings.map((h) => (
          <AssetRow
            key={h.symbol}
            symbol={h.symbol}
            now={now}
            spark={false}
            subtitle={`${qty(h.quantity)} ${h.symbol}`}
            right={
              <>
                <p className="tabular text-[15px] font-semibold">{money(h.value)}</p>
                <p className={`tabular text-xs font-semibold ${tone(h.pnl)}`}>{signedMoney(h.pnl)}</p>
              </>
            }
          />
        ))}
      </div>

      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="text-left text-xs font-medium text-muted [&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">
            <th>Name</th>
            <th className="text-right">Price</th>
            <th className="text-right">24h</th>
            <th className="hidden text-right 2xl:table-cell">Units</th>
            <th className="hidden text-right 2xl:table-cell">Avg cost</th>
            <th className="text-right">Value</th>
            <th className="text-right">Return</th>
            <th className="hidden w-32 lg:table-cell">Weight</th>
          </tr>
        </thead>
        <tbody>
          {summary.holdings.map((h) => {
            const asset = market.getAsset(h.symbol)!;
            const q = market.quote(h.symbol, now);
            const weight = h.value / investedTotal;
            return (
              <tr
                key={h.symbol}
                onClick={() => router.push(`/asset/${h.symbol}`)}
                className="tabular cursor-pointer border-t border-line whitespace-nowrap transition hover:bg-surface-2 [&>td]:px-4 [&>td]:py-3"
              >
                <td>
                  <Link href={`/asset/${h.symbol}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <AssetAvatar asset={asset} size={34} />
                    <span className="min-w-0">
                      <span className="block font-semibold whitespace-nowrap">{asset.name}</span>
                      <span className="block text-xs text-muted">{asset.symbol}</span>
                    </span>
                  </Link>
                </td>
                <td className="text-right">
                  {fmtPrice(h.price)}
                  <span className="block text-xs text-muted 2xl:hidden">{qty(h.quantity)} units</span>
                </td>
                <td className={`text-right font-semibold ${tone(q.changePct)}`}>{pct(q.changePct)}</td>
                <td className="hidden text-right text-muted 2xl:table-cell">{qty(h.quantity)}</td>
                <td className="hidden text-right text-muted 2xl:table-cell">{fmtPrice(h.avgCost)}</td>
                <td className="text-right font-semibold">{money(h.value)}</td>
                <td className={`text-right font-semibold ${tone(h.pnl)}`}>
                  {signedMoney(h.pnl)}
                  <span className="block text-xs font-medium">{pct(h.pnlPct)}</span>
                </td>
                <td className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${weight * 100}%` }} />
                    </div>
                    <span className="w-10 text-right text-xs text-muted">{(weight * 100).toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
