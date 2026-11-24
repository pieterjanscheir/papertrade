"use client";

import { useEffect, useState } from "react";
import { enabledFeatures } from "@/features";
import { useDemoStore } from "@/lib/demo/store";
import { rehydrateLocalStores } from "@/lib/local-store";
import { market } from "@/lib/market/provider";
import type { OrderEvent } from "@/lib/trading/orders";
import { useAccountStore } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { contractLabel, parseContract } from "@/lib/market/options";
import { money, price, qty, signedMoney } from "@/lib/ui/format";
import { toast } from "@/lib/ui/toasts";
import { DemoControls } from "./demo-controls";
import { Coin3D } from "./tilt";
import { Toaster } from "./toaster";

/**
 * Loads the persisted account from localStorage, then keeps open orders running.
 * First visit → a demo account with some history is created.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      useDemoStore.persist.rehydrate(),
      useAccountStore.persist.rehydrate(),
      rehydrateLocalStores(),
    ]).then(() => {
      if (cancelled) return;
      if (!useAccountStore.getState().account) useAccountStore.getState().reset("demo");
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pages always render (Next.js validates them), but stay hidden behind a splash
  // until the account is loaded from localStorage.
  return (
    <>
      {!ready && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg">
          <Coin3D size={64} label="€" />
        </div>
      )}
      {ready && <OrderProcessor />}
      {ready && <DemoControls />}
      {ready && <FeatureRunners />}
      <Toaster />
      <div className={ready ? undefined : "invisible"}>{children}</div>
    </>
  );
}

/** On every clock tick: fill, reject or expire open orders and announce it. */
function OrderProcessor() {
  const now = useNow();
  useEffect(() => {
    if (!now) return;
    const events = useAccountStore.getState().processOrders(now);
    events.forEach(announce);
    for (const { position, tx } of useAccountStore.getState().settleOptions(now)) {
      const label = contractLabel(parseContract(position.contract));
      toast({
        title: tx.amount > 0 ? `Option expired in the money · ${label}` : `Option expired worthless · ${label}`,
        body: tx.amount > 0 ? `Paid out ${money(tx.amount)} (P/L ${signedMoney(tx.realizedPnl ?? 0)})` : `Lost the premium of ${money(position.avgCost * position.quantity)}`,
        tone: (tx.realizedPnl ?? 0) >= 0 ? "gain" : "loss",
        href: "/activity",
      });
    }
  }, [now]);
  return null;
}

/** Background `Runner`s from registered features (src/features). */
function FeatureRunners() {
  const now = useNow();
  return (
    <>
      {enabledFeatures().map((f) => (f.Runner ? <f.Runner key={f.id} now={now} /> : null))}
    </>
  );
}

function announce(e: OrderEvent) {
  const o = e.order;
  const name = market.getAsset(o.symbol)?.name ?? o.symbol;
  const kind = `${o.type === "limit" ? "Limit" : "Stop"} ${o.side}`;
  const href = `/asset/${o.symbol}`;
  if (e.kind === "filled") {
    toast({
      title: `${kind} filled · ${name}`,
      body: `${o.side === "buy" ? "Bought" : "Sold"} ${qty(o.quantity)} at ${price(o.fillPrice!)}`,
      tone: o.side === "buy" ? "gain" : "neutral",
      href,
    });
  } else if (e.kind === "rejected") {
    toast({ title: `${kind} rejected · ${name}`, body: o.reason, tone: "loss", href });
  } else {
    toast({ title: `${kind} expired · ${name}`, body: `Never reached ${price(o.triggerPrice)}`, tone: "neutral", href });
  }
}
