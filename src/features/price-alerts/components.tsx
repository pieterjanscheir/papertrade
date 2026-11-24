"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { market } from "@/lib/market/provider";
import { marketNow } from "@/lib/demo/store";
import { dateTime, pct, price as fmtPrice } from "@/lib/ui/format";
import { toast } from "@/lib/ui/toasts";
import { isCrossed, useAlerts, type PriceAlert } from "./store";

/** Background runner: checks alerts on every tick and shows a notification. */
export function AlertRunner({ now }: { now: number }) {
  useEffect(() => {
    if (!now) return;
    const { alerts, markTriggered } = useAlerts.getState();
    for (const a of alerts) {
      if (a.triggeredAt) continue;
      const p = market.priceAt(a.symbol, now);
      if (!isCrossed(a, p)) continue;
      markTriggered(a.id, now);
      toast({
        title: `${a.symbol} is ${a.direction} ${fmtPrice(a.price)}`,
        body: `Now trading at ${fmtPrice(p)}`,
        tone: a.direction === "above" ? "gain" : "loss",
        href: `/asset/${a.symbol}`,
      });
    }
  }, [now]);
  return null;
}

/** Asset panel: create an alert for this asset and list existing ones. */
export function AlertPanel({ symbol, now }: { symbol: string; now: number }) {
  const { alerts, add, remove } = useAlerts();
  const current = market.priceAt(symbol, now);
  const [input, setInput] = useState("");
  const target = Number(input.replace(",", "."));
  const mine = alerts.filter((a) => a.symbol === symbol);

  function create() {
    if (!(target > 0)) return;
    add({ symbol, price: target, direction: target >= current ? "above" : "below", createdAt: marketNow() });
    setInput("");
  }

  return (
    <div>
      <SectionTitle>Price alerts</SectionTitle>
      <Card className="p-4">
        <div className="flex gap-2">
          <input
            inputMode="decimal"
            placeholder={`Alert price, now ${fmtPrice(current)}`}
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^0-9.,]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && create()}
            className="tabular min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button onClick={create} disabled={!(target > 0)} className="rounded-xl bg-fg px-4 text-sm font-semibold text-bg disabled:opacity-40">
            Add
          </button>
        </div>
        {target > 0 && (
          <p className="mt-2 text-xs text-muted">
            Notifies you when {symbol} goes {target >= current ? "above" : "below"} {fmtPrice(target)} ({pct(target / current - 1)}).
          </p>
        )}
        {mine.length > 0 && <AlertList alerts={mine} now={now} onRemove={remove} />}
      </Card>
    </div>
  );
}

/** Home widget: active alerts across all assets. */
export function AlertsWidget({ now }: { now: number }) {
  const { alerts, remove } = useAlerts();
  const active = alerts.filter((a) => !a.triggeredAt);
  return (
    <div>
      <SectionTitle
        action={
          <Link href="/alerts" className="text-sm font-semibold text-accent">
            Manage
          </Link>
        }
      >
        Price alerts
      </SectionTitle>
      <Card className="p-4">
        {active.length === 0 ? (
          <p className="text-sm text-muted">No active alerts. Add one from any asset page.</p>
        ) : (
          <AlertList alerts={active} now={now} onRemove={remove} />
        )}
      </Card>
    </div>
  );
}

export function AlertList({ alerts, now, onRemove }: { alerts: PriceAlert[]; now: number; onRemove: (id: string) => void }) {
  return (
    <ul className="mt-1 divide-y divide-line">
      {alerts.map((a) => {
        const p = market.priceAt(a.symbol, now);
        return (
          <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
            <BellRing size={16} className={a.triggeredAt ? "text-muted" : "text-accent"} />
            <Link href={`/asset/${a.symbol}`} className="min-w-0 flex-1">
              <span className="font-semibold">{a.symbol}</span> {a.direction} {fmtPrice(a.price)}
              <span className="block text-xs text-muted">
                {a.triggeredAt ? `Triggered ${dateTime(a.triggeredAt)}` : `${pct(a.price / p - 1)} away`}
              </span>
            </Link>
            <button onClick={() => onRemove(a.id)} className="text-muted hover:text-loss" aria-label="Delete alert">
              <Trash2 size={15} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
