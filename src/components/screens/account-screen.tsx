"use client";

import { useState } from "react";
import Link from "next/link";
import { Palette, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { market } from "@/lib/market/provider";
import { ORDER_FEE } from "@/lib/trading/engine";
import { STARTING_CASH } from "@/lib/trading/seed";
import { useAccount, useAccountStore, type StartKind } from "@/lib/trading/store";
import { money } from "@/lib/ui/format";
import { Logo } from "../logo";
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
    <div className="mx-auto flex max-w-3xl flex-col gap-7">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>

      <Card className="flex items-center gap-4 p-5">
        <Logo size={48} />
        <div className="flex-1">
          <p className="font-semibold">Paper trading account</p>
          <p className="text-sm text-muted">Cash balance {money(account.cash)}</p>
        </div>
      </Card>

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
        <SectionTitle>Start over</SectionTitle>
        <Card className="divide-y divide-line">
          <ResetRow
            icon={<Sparkles size={18} />}
            title="Demo portfolio"
            body="About 7 months of trading history, so every chart has something to show."
            onClick={() => setConfirm("demo")}
          />
          <ResetRow
            icon={<RotateCcw size={18} />}
            title="Empty account"
            body={`Start from scratch with ${money(STARTING_CASH)} in cash.`}
            onClick={() => setConfirm("fresh")}
          />
        </Card>
      </div>

      <div>
        <SectionTitle>For builders</SectionTitle>
        <Card className="flex gap-3 p-4">
          <Button variant="secondary" className="flex-1" onClick={() => setPanelOpen(true)}>
            <Zap size={16} /> Demo controls
          </Button>
          <Link href="/design" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-surface-2 px-5 py-3 text-sm font-semibold hover:bg-line">
            <Palette size={16} /> Design system
          </Link>
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
          This wipes your positions and history and starts a {confirm === "demo" ? "new demo portfolio" : "fresh empty account"}.
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

function ResetRow({ icon, title, body, onClick }: { icon: React.ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-surface-2">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2">{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted">{body}</span>
      </span>
    </button>
  );
}
