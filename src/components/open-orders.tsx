"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { market } from "@/lib/market/provider";
import type { Order } from "@/lib/trading/engine";
import { describeTrigger } from "@/lib/trading/orders";
import { useAccountStore } from "@/lib/trading/store";
import { dateTime, pct, price as fmtPrice, qty } from "@/lib/ui/format";
import { AssetAvatar } from "./ui";

const STATUS_STYLE: Record<Order["status"], string> = {
  open: "bg-accent/15 text-accent",
  filled: "bg-gain/15 text-gain",
  cancelled: "bg-surface-2 text-muted",
  expired: "bg-surface-2 text-muted",
  rejected: "bg-loss/15 text-loss",
};

/** List of orders. Open ones show distance to trigger and a cancel button. */
export function OrderList({ orders, now, showAsset = true }: { orders: Order[]; now: number; showAsset?: boolean }) {
  const cancel = useAccountStore((s) => s.cancelOrder);
  return (
    <div className="divide-y divide-line">
      {orders.map((o) => {
        const asset = market.getAsset(o.symbol)!;
        const current = market.priceAt(o.symbol, now);
        const distance = o.triggerPrice / current - 1;
        return (
          <div key={o.id} className="flex items-center gap-3 px-4 py-3.5">
            {showAsset && (
              <Link href={`/asset/${o.symbol}`}>
                <AssetAvatar asset={asset} size={36} />
              </Link>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
                <span className="capitalize">
                  {o.type} {o.side}
                </span>
                {showAsset && <span className="text-muted">{asset.symbol}</span>}
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[o.status]}`}>{o.status}</span>
              </p>
              <p className="text-sm text-muted">
                {o.status === "open" ? (
                  <>
                    {describeTrigger(o).replace(/^(Buys|Sells) when the price /, "")} {fmtPrice(o.triggerPrice)}{" "}
                    <span className="tabular">({pct(distance)} away)</span>
                  </>
                ) : o.status === "filled" ? (
                  <>
                    Filled at {fmtPrice(o.fillPrice!)} · {dateTime(o.closedAt!)}
                  </>
                ) : (
                  <>
                    {o.reason ?? `${o.type === "limit" ? "Limit" : "Stop"} ${fmtPrice(o.triggerPrice)}`} · {dateTime(o.closedAt ?? o.createdAt)}
                  </>
                )}
              </p>
            </div>
            <div className="tabular text-right text-sm">
              <p className="font-semibold">
                {qty(o.quantity)} {showAsset ? "" : asset.symbol}
              </p>
              <p className="text-muted">
                {o.status === "open" ? (o.expiresAt ? `until ${dateTime(o.expiresAt)}` : "until cancelled") : ""}
              </p>
            </div>
            {o.status === "open" && (
              <button
                onClick={() => cancel(o.id)}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-muted hover:text-loss"
                aria-label="Cancel order"
                title="Cancel order"
              >
                <X size={15} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
