"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Palette, Trophy, Zap } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { market } from "@/lib/market/provider";
import { ORDER_FEE } from "@/lib/trading/engine";
import { PRESETS } from "@/lib/trading/seed";
import { useAccount, useAccountStore, type StartKind } from "@/lib/trading/store";
import { money } from "@/lib/ui/format";
import { PlayCard } from "../play-card";
import { Tilt } from "../tilt";
import { MoneySheet, type MoneyAction } from "../money-sheet";
import { Sheet } from "../sheet";
import { Button, Card, SectionTitle } from "../ui";

export function AccountScreen() {
  const account = useAccount();
  const reset = useAccountStore((s) => s.reset);
  const setPanelOpen = useDemoStore((s) => s.setPanelOpen);
  const [moneyAction, setMoneyAction] = useState<MoneyAction | null>(null);
  const [confirm, setConfirm] = useState<StartKind | null>(null);

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6">
        <PlayCard balance={account.cash} />
        <div className="text-center sm:text-left">
          <p className="font-semibold">Paper trading account</p>
          <p className="text-sm text-muted">Cash balance {money(account.cash)}</p>
          <p className="mt-1 text-xs text-muted">Tip: click the card.</p>
        </div>
      </div>

      <div>
        <SectionTitle>Cash</SectionTitle>
        <Card className="flex gap-3 p-4">
          <Button className="flex-1" onClick={() => setMoneyAction("deposit")}>
            Add money
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => setMoneyAction("withdraw")}>
            Withdraw
          </Button>
        </Card>
      </div>

      <div>
        <SectionTitle>Load a different account</SectionTitle>
        <p className="-mt-2 mb-3 px-1 text-sm text-muted">
          Each one comes with a full trading history built from the simulated prices. Handy for demos and user tests.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRESETS.map((p) => (
            <Tilt key={p.id} max={6}>
              <button onClick={() => setConfirm(p.id)} className="flex h-full w-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 text-left">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2 text-2xl">{p.emoji}</span>
                <span>
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block text-sm text-muted">{p.description}</span>
                </span>
              </button>
            </Tilt>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>For builders</SectionTitle>
        <Card className="grid grid-cols-2 gap-3 p-4">
          <Button variant="secondary" onClick={() => setPanelOpen(true)}>
            <Zap size={16} /> Demo controls
          </Button>
          {[
            { href: "/hackathon", label: "Hackathon info", icon: Trophy },
            { href: "/testing", label: "User testing", icon: ClipboardList },
            { href: "/design", label: "Design system", icon: Palette },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center justify-center gap-2 rounded-full bg-surface-2 px-5 py-3 text-sm font-semibold hover:bg-line">
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
        </Card>
      </div>

      <div>
        <SectionTitle>How this works</SectionTitle>
        <Card className="space-y-3 p-5 text-sm leading-relaxed text-muted">
          <p>
            <span className="font-semibold text-fg">{market.sourceLabel}.</span> Prices come from a deterministic
            simulator, not a market feed. They move every couple of seconds and everyone running the app sees the same
            numbers.
          </p>
          <p>
            Orders are market orders, filled instantly at the simulated price, with fractional units and a flat{" "}
            {money(ORDER_FEE)} fee. Your account lives in this browser&apos;s local storage.
          </p>
          <p>Play money only. Nothing here is investment advice.</p>
        </Card>
      </div>

      <MoneySheet action={moneyAction} onClose={() => setMoneyAction(null)} />

      <Sheet open={confirm !== null} onClose={() => setConfirm(null)} title="Reset account?">
        <p className="mb-5 text-sm text-muted">
          This replaces your positions and history with “{PRESETS.find((p) => p.id === confirm)?.name}”.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="loss"
            className="flex-1"
            onClick={() => {
              if (confirm) reset(confirm);
              setConfirm(null);
            }}
          >
            Reset
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
