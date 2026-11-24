"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { market } from "@/lib/market/provider";
import type { Transaction } from "@/lib/trading/engine";
import { useAccount } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { OrderList } from "../open-orders";
import { dayLabel, money, price as fmtPrice, qty, signedMoney, time, tone } from "@/lib/ui/format";
import { AssetAvatar, Card, EmptyState } from "../ui";

type Tab = "transactions" | "orders";

export function ActivityScreen() {
  const account = useAccount();
  const now = useNow();
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(params.get("tab") === "orders" ? "orders" : "transactions");
  const switchTab = (t: Tab) => {
    setTab(t);
    router.replace(t === "orders" ? "/activity?tab=orders" : "/activity", { scroll: false });
  };
  const orders = [...account.orders].sort(
    (a, b) => Number(b.status === "open") - Number(a.status === "open") || (b.closedAt ?? b.createdAt) - (a.closedAt ?? a.createdAt),
  );
  const txs = [...account.transactions].sort((a, b) => b.time - a.time);

  const groups: { label: string; items: Transaction[] }[] = [];
  for (const tx of txs) {
    const label = dayLabel(tx.time);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(tx);
    else groups.push({ label, items: [tx] });
  }

  const realized = txs.reduce((s, t) => s + (t.realizedPnl ?? 0), 0);
  const fees = txs.reduce((s, t) => s + t.fee, 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Trades</p>
          <p className="tabular mt-1 text-lg font-semibold">{txs.filter((t) => t.type === "buy" || t.type === "sell").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Realised P/L</p>
          <p className={`tabular mt-1 text-lg font-semibold ${tone(realized)}`}>{signedMoney(realized)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Fees paid</p>
          <p className="tabular mt-1 text-lg font-semibold">{money(fees)}</p>
        </Card>
      </div>

      <div className="flex gap-1 rounded-full bg-surface p-1 text-sm font-semibold sm:w-fit">
        {(["transactions", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`flex-1 rounded-full px-5 py-2 capitalize transition ${tab === t ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"}`}
          >
            {t}
            {t === "orders" && orders.some((o) => o.status === "open") && (
              <span className="ml-2 rounded-full bg-accent px-1.5 text-xs text-white">{orders.filter((o) => o.status === "open").length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <Card className="overflow-hidden">
          {orders.length === 0 ? (
            <EmptyState title="No orders yet" body="Limit and stop orders you place show up here, open or closed." />
          ) : (
            <OrderList orders={orders} now={now} />
          )}
        </Card>
      )}

      {tab === "transactions" && groups.length === 0 && (
        <Card>
          <EmptyState title="No activity yet" body="Your deposits and trades will show up here." />
        </Card>
      )}

      {tab === "transactions" && groups.map((g) => (
        <div key={g.label}>
          <p className="mb-2 px-1 text-sm font-semibold text-muted">{g.label}</p>
          <Card className="p-1.5">
            {g.items.map((tx) => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function TxRow({ tx }: { tx: Transaction }) {
  const asset = tx.symbol ? market.getAsset(tx.symbol) : undefined;
  const isTrade = tx.type === "buy" || tx.type === "sell";
  const inflow = tx.type === "deposit" || tx.type === "sell";
  const cash = tx.type === "buy" ? tx.amount + tx.fee : tx.type === "sell" ? tx.amount - tx.fee : tx.amount;

  const body = (
    <>
      {asset ? (
        <AssetAvatar asset={asset} />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-fg">
          {inflow ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">
          {isTrade ? `${tx.type === "buy" ? "Bought" : "Sold"} ${asset?.name ?? tx.symbol}` : tx.type === "deposit" ? "Money added" : "Withdrawal"}
        </p>
        <p className="truncate text-sm text-muted">
          {time(tx.time)}
          {isTrade && ` · ${qty(tx.quantity!)} @ ${fmtPrice(tx.price!)}`}
        </p>
      </div>
      <div className="text-right">
        <p className={`tabular text-[15px] font-semibold ${inflow ? "text-gain" : ""}`}>
          {inflow ? "+" : "−"}
          {money(cash)}
        </p>
        {tx.realizedPnl !== undefined && (
          <p className={`tabular text-xs font-semibold ${tone(tx.realizedPnl)}`}>P/L {signedMoney(tx.realizedPnl)}</p>
        )}
        {tx.realizedPnl === undefined && tx.fee > 0 && <p className="tabular text-xs text-muted">fee {money(tx.fee)}</p>}
      </div>
    </>
  );

  const cls = "flex items-center gap-3 rounded-2xl px-3 py-3";
  return asset ? (
    <Link href={`/asset/${asset.symbol}`} className={`${cls} transition hover:bg-surface-2`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
