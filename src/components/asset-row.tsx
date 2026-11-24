"use client";

import Link from "next/link";
import { market } from "@/lib/market/provider";
import { price as fmtPrice } from "@/lib/ui/format";
import { Sparkline } from "./price-chart";
import { AssetAvatar, ChangePill } from "./ui";

/** A list row: avatar, name, sparkline, price and 24h change. */
export function AssetRow({
  symbol,
  now,
  right,
  subtitle,
  spark = true,
}: {
  symbol: string;
  now: number;
  /** Override the right-hand column (e.g. holding value instead of price). */
  right?: React.ReactNode;
  subtitle?: React.ReactNode;
  spark?: boolean;
}) {
  const asset = market.getAsset(symbol);
  if (!asset) return null;
  const q = market.quote(symbol, now);
  // 1D sparkline, down-sampled to keep lists cheap.
  const values = spark ? market.history(symbol, "1D", now).filter((_, i) => i % 6 === 0).map((p) => p.price) : [];

  return (
    <Link href={`/asset/${symbol}`} className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-surface-2">
      <AssetAvatar asset={asset} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">{asset.name}</p>
        <p className="truncate text-sm text-muted">{subtitle ?? asset.symbol}</p>
      </div>
      {spark && (
        <div className="hidden sm:block">
          <Sparkline values={values} />
        </div>
      )}
      <div className="w-28 text-right">
        {right ?? (
          <>
            <p className="tabular text-[15px] font-semibold">{fmtPrice(q.price)}</p>
            <ChangePill value={q.changePct} />
          </>
        )}
      </div>
    </Link>
  );
}
