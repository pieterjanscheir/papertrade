"use client";

import { useState } from "react";
import { Check, Clock } from "lucide-react";
import { market } from "@/lib/market/provider";
import {
  availableCash,
  availableQuantity,
  ORDER_FEE,
  previewOrder,
  type OrderType,
  type Side,
} from "@/lib/trading/engine";
import { describeTrigger, isTriggered, previewPendingOrder } from "@/lib/trading/orders";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { money, pct, price as fmtPrice, qty as fmtQty } from "@/lib/ui/format";
import { Button } from "./ui";

type Mode = "amount" | "quantity";
type Expiry = "gtc" | "day" | "week" | "month";

const EXPIRY: Record<Expiry, { label: string; ms: number | null }> = {
  gtc: { label: "Until cancelled", ms: null },
  day: { label: "1 day", ms: 86_400_000 },
  week: { label: "1 week", ms: 7 * 86_400_000 },
  month: { label: "1 month", ms: 30 * 86_400_000 },
};

const TYPE_HELP: Record<OrderType, string> = {
  market: "Buy or sell right now at the current price.",
  limit: "Set your price. Buy below or sell above the current price.",
  stop: "Act on a move. A stop sell is a stop-loss; a stop buy catches a breakout.",
};

/** Default trigger offset per order type and side, as a fraction of the price. */
function defaultOffset(type: OrderType, side: Side): number {
  if (type === "limit") return side === "buy" ? -0.03 : 0.05;
  if (type === "stop") return side === "buy" ? 0.03 : -0.05;
  return 0;
}

const round2 = (x: number) => (x >= 1 ? Math.round(x * 100) / 100 : Math.round(x * 10_000) / 10_000);

type Done = { title: string; body: string };

export function OrderForm({
  symbol,
  initialSide = "buy",
  onClose,
}: {
  symbol: string;
  initialSide?: Side;
  /** When given (sheet mode), "Done" closes; otherwise the form resets. */
  onClose?: () => void;
}) {
  const now = useNow();
  const account = useAccount();
  const store = useAccountStore();
  const asset = market.getAsset(symbol)!;
  const livePrice = market.priceAt(symbol, now);
  const held = account.positions[symbol]?.quantity ?? 0;
  const freeQty = availableQuantity(account, symbol);
  const freeCash = availableCash(account);

  const [side, setSide] = useState<Side>(held > 0 ? initialSide : "buy");
  const [type, setType] = useState<OrderType>("market");
  const [mode, setMode] = useState<Mode>("amount");
  const [input, setInput] = useState("");
  const [triggerInput, setTriggerInput] = useState("");
  const [expiry, setExpiry] = useState<Expiry>("gtc");
  const [done, setDone] = useState<Done | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const value = Number(input.replace(",", "."));
  const trigger = Number(triggerInput.replace(",", "."));

  function resetTrigger(t: OrderType, s: Side) {
    setTriggerInput(t === "market" ? "" : String(round2(livePrice * (1 + defaultOffset(t, s)))));
  }

  function chooseType(t: OrderType) {
    setType(t);
    resetTrigger(t, side);
    setSubmitError(null);
  }

  function chooseSide(s: Side) {
    setSide(s);
    setInput("");
    resetTrigger(type, s);
    setSubmitError(null);
  }

  const pendingReq = {
    symbol,
    side,
    type: type === "market" ? ("limit" as const) : type,
    mode,
    value,
    triggerPrice: trigger,
    expiresAt: EXPIRY[expiry].ms === null ? null : now + EXPIRY[expiry].ms!,
  };

  const preview =
    !input ? null : type === "market" ? previewOrder(account, { symbol, side, mode, value }, livePrice) : previewPendingOrder(account, pendingReq);

  const firesNow = type !== "market" && trigger > 0 && isTriggered({ side, type, triggerPrice: trigger }, livePrice);
  const unitPrice = type === "market" ? livePrice : trigger;

  function submit() {
    if (type === "market") {
      const r = store.placeOrder({ symbol, side, mode, value });
      if (!r.ok) return setSubmitError(r.error);
      const tx = r.value;
      setDone({
        title: `${tx.type === "buy" ? "Bought" : "Sold"} ${fmtQty(tx.quantity!)} ${asset.symbol}`,
        body: `at ${fmtPrice(tx.price!)} · ${money(tx.amount)} + ${money(tx.fee)} fee`,
      });
    } else {
      const r = store.placePendingOrder(pendingReq);
      if (!r.ok) return setSubmitError(r.error);
      const o = r.value;
      setDone({
        title: `${type === "limit" ? "Limit" : "Stop"} ${side} placed`,
        body: `${describeTrigger(o)} ${fmtPrice(o.triggerPrice)} · ${fmtQty(o.quantity)} ${asset.symbol} · ${EXPIRY[expiry].label.toLowerCase()}`,
      });
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className={`grid size-16 place-items-center rounded-full ${type === "market" ? "bg-gain/15 text-gain" : "bg-accent/15 text-accent"}`}>
          {type === "market" ? <Check size={32} strokeWidth={3} /> : <Clock size={30} strokeWidth={2.5} />}
        </span>
        <p className="text-xl font-semibold">{done.title}</p>
        <p className="max-w-xs text-sm text-muted">{done.body}</p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            if (onClose) return onClose();
            setDone(null);
            setInput("");
          }}
        >
          {onClose ? "Done" : "New order"}
        </Button>
      </div>
    );
  }

  const error = submitError ?? (preview && !preview.ok ? preview.error : null);
  const quick =
    side === "buy"
      ? [50, 100, 250, 500].map((v) => ({ label: `€${v}`, set: () => (setMode("amount"), setInput(String(v))) }))
      : [0.25, 0.5, 1].map((f) => ({
          label: f === 1 ? "All" : `${f * 100}%`,
          set: () => (setMode("quantity"), setInput(String(Math.floor(freeQty * f * 1e6) / 1e6))),
        }));

  return (
    <div className="flex flex-col gap-4">
      {/* Side */}
      <div className="grid grid-cols-2 rounded-full bg-surface-2 p-1 text-sm font-semibold">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            disabled={s === "sell" && held <= 0}
            onClick={() => chooseSide(s)}
            className={`rounded-full py-2 capitalize transition disabled:opacity-30 ${
              side === s ? (s === "buy" ? "bg-gain text-black" : "bg-loss text-white") : "text-muted hover:text-fg"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Order type */}
      <div>
        <div className="flex gap-1.5">
          {(["market", "limit", "stop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => chooseType(t)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition ${
                type === t ? "border-fg/60 bg-surface-2 text-fg" : "border-line text-muted hover:text-fg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">{TYPE_HELP[type]}</p>
      </div>

      {/* Trigger price */}
      {type !== "market" && (
        <div className="rounded-2xl bg-surface-2 p-4">
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>{type === "limit" ? "Limit price" : "Stop price"}</span>
            <span className="tabular">Now {fmtPrice(livePrice)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-muted">€</span>
            <input
              inputMode="decimal"
              value={triggerInput}
              onChange={(e) => (setTriggerInput(e.target.value.replace(/[^0-9.,]/g, "")), setSubmitError(null))}
              className="tabular w-full bg-transparent text-2xl font-semibold outline-none"
            />
            {trigger > 0 && (
              <span className="tabular shrink-0 text-sm font-semibold text-muted">{pct(trigger / livePrice - 1)}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[-0.1, -0.05, -0.02, 0.02, 0.05, 0.1].map((d) => (
              <button
                key={d}
                onClick={() => setTriggerInput(String(round2(livePrice * (1 + d))))}
                className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-muted hover:text-fg"
              >
                {d > 0 ? "+" : "−"}
                {Math.abs(d * 100)}%
              </button>
            ))}
          </div>
          {trigger > 0 && (
            <p className={`mt-3 text-xs ${firesNow ? "text-amber-400" : "text-muted"}`}>
              {firesNow
                ? "The current price already meets this condition, so the order will fill right away."
                : `${describeTrigger({ side, type })} ${fmtPrice(trigger)}.`}
            </p>
          )}
        </div>
      )}

      {/* Amount */}
      <div className="rounded-2xl bg-surface-2 p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>{mode === "amount" ? "Amount in EUR" : `Number of ${asset.symbol}`}</span>
          <button className="font-semibold text-accent" onClick={() => (setMode(mode === "amount" ? "quantity" : "amount"), setInput(""))}>
            Switch to {mode === "amount" ? "units" : "EUR"}
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          {mode === "amount" && <span className="text-3xl font-semibold text-muted">€</span>}
          <input
            data-autofocus
            inputMode="decimal"
            placeholder="0"
            value={input}
            onChange={(e) => (setInput(e.target.value.replace(/[^0-9.,]/g, "")), setSubmitError(null))}
            onKeyDown={(e) => e.key === "Enter" && preview?.ok && submit()}
            className="tabular w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-line"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {quick.map((q) => (
            <button key={q.label} onClick={q.set} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:text-fg">
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {type !== "market" && (
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">Valid for</span>
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value as Expiry)}
            className="rounded-xl border border-line bg-surface-2 px-3 py-2 font-semibold outline-none"
          >
            {Object.entries(EXPIRY).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <dl className="flex flex-col gap-2 text-sm">
        <Row label={side === "buy" ? "Available cash" : "Available to sell"}>
          {side === "buy" ? money(freeCash) : `${fmtQty(freeQty)} ${asset.symbol}`}
        </Row>
        <Row label={type === "market" ? "Price" : `${type === "limit" ? "Limit" : "Stop"} price`}>
          {unitPrice > 0 ? fmtPrice(unitPrice) : "—"}
        </Row>
        <Row label="Estimated units">{preview?.ok ? fmtQty(preview.value.quantity) : "—"}</Row>
        <Row label="Order fee">{money(ORDER_FEE)}</Row>
        <Row label={side === "buy" ? "Estimated total" : "Estimated proceeds"} strong>
          {preview?.ok ? money(preview.value.net) : "—"}
        </Row>
      </dl>

      {error && <p className="-mt-1 text-sm font-medium text-loss">{error}</p>}

      <Button variant={side === "buy" ? "gain" : "loss"} className="w-full py-4 text-base" disabled={!preview?.ok} onClick={submit}>
        {type === "market" ? (side === "buy" ? "Buy" : "Sell") : `Place ${type} ${side}`} {asset.symbol}
      </Button>
      <p className="-mt-2 text-center text-xs text-muted">
        {type === "market"
          ? "Fills instantly at the live simulated price"
          : "Fills at the market price once triggered, even while the app is closed"}
      </p>
    </div>
  );
}

function Row({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={`tabular text-right ${strong ? "font-semibold text-fg" : ""}`}>{children}</dd>
    </div>
  );
}
