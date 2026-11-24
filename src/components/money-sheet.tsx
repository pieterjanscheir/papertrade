"use client";

import { useState } from "react";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { money } from "@/lib/ui/format";
import { Sheet } from "./sheet";
import { Button } from "./ui";

export type MoneyAction = "deposit" | "withdraw";

/** Add or withdraw (fake) cash. */
export function MoneySheet({ action, onClose }: { action: MoneyAction | null; onClose: () => void }) {
  return (
    <Sheet open={action !== null} onClose={onClose} title={action === "withdraw" ? "Withdraw" : "Add money"}>
      {action && <MoneyForm key={action} action={action} onClose={onClose} />}
    </Sheet>
  );
}

function MoneyForm({ action, onClose }: { action: MoneyAction; onClose: () => void }) {
  const account = useAccount();
  const store = useAccountStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const value = Number(input.replace(",", "."));

  function submit() {
    const r = action === "deposit" ? store.deposit(value) : store.withdraw(value);
    if (r.ok) onClose();
    else setError(r.error);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-surface-2 p-4">
        <p className="mb-2 text-xs text-muted">
          {action === "deposit" ? "Play money — top up as much as you like" : `Available: ${money(account.cash)}`}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-muted">€</span>
          <input
            data-autofocus
            inputMode="decimal"
            placeholder="0"
            value={input}
            onChange={(e) => (setInput(e.target.value.replace(/[^0-9.,]/g, "")), setError(null))}
            onKeyDown={(e) => e.key === "Enter" && value > 0 && submit()}
            className="tabular w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-line"
          />
        </div>
        <div className="mt-3 flex gap-2">
          {(action === "deposit" ? [100, 500, 1000, 5000] : [100, 500]).map((v) => (
            <button key={v} onClick={() => setInput(String(v))} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:text-fg">
              €{v.toLocaleString()}
            </button>
          ))}
          {action === "withdraw" && (
            <button onClick={() => setInput(String(account.cash))} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:text-fg">
              All
            </button>
          )}
        </div>
      </div>
      {error && <p className="-mt-2 text-sm font-medium text-loss">{error}</p>}
      <Button className="w-full py-4 text-base" disabled={!(value > 0)} onClick={submit}>
        {action === "deposit" ? "Add money" : "Withdraw"}
      </Button>
    </div>
  );
}
