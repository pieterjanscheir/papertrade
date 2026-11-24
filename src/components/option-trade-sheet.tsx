"use client";

import { useId, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import {
  contractLabel,
  formatStrike,
  multiplier,
  parseContract,
  payoffAtExpiry,
  quoteOption,
} from "@/lib/market/options";
import { DAY } from "@/lib/market/simulator";
import { availableCash } from "@/lib/trading/engine";
import { previewOptionOrder } from "@/lib/trading/options-trading";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { money, pct, price as fmtPrice } from "@/lib/ui/format";
import { Sheet } from "./sheet";
import { Button } from "./ui";

export function OptionTradeSheet({
  contract,
  side,
  onClose,
}: {
  contract: string | null;
  side: "buy" | "sell";
  onClose: () => void;
}) {
  return (
    <Sheet open={contract !== null} onClose={onClose} title={contract ? contractLabel(parseContract(contract)) : ""}>
      {contract && <OptionForm key={contract + side} id={contract} initialSide={side} onClose={onClose} />}
    </Sheet>
  );
}

function OptionForm({ id, initialSide, onClose }: { id: string; initialSide: "buy" | "sell"; onClose: () => void }) {
  const now = useNow();
  const account = useAccount();
  const place = useAccountStore((s) => s.placeOptionOrder);
  const c = parseContract(id);
  const q = quoteOption(c, now);
  const mult = multiplier(c.symbol);
  const held = account.optionPositions?.[id]?.quantity ?? 0;

  const [side, setSide] = useState<"buy" | "sell">(held > 0 ? initialSide : "buy");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preview = previewOptionOrder(account, { contract: id, side, quantity: qty }, q, mult);
  const premium = side === "buy" ? q.ask : q.bid;
  const breakeven = c.type === "call" ? c.strike + q.ask : c.strike - q.ask;
  const days = Math.max(0, (c.expiry - now) / DAY);
  const maxProfit = c.type === "call" ? "Unlimited" : money(Math.max(0, (c.strike - q.ask) * mult * qty - 1));

  function submit() {
    const r = place({ contract: id, side, quantity: qty });
    if (!r.ok) return setError(r.error);
    setDone(`${side === "buy" ? "Bought" : "Sold"} ${qty} contract${qty === 1 ? "" : "s"} at ${fmtPrice(r.value.price!)} per share`);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-gain/15 text-gain">
          <Check size={32} strokeWidth={3} />
        </span>
        <p className="text-lg font-semibold">{done}</p>
        <p className="text-sm text-muted">Settles automatically at expiry if you still hold it.</p>
        <Button className="mt-4 w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 rounded-full bg-surface-2 p-1 text-sm font-semibold">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            disabled={s === "sell" && held === 0}
            onClick={() => (setSide(s), setError(null), setQty(1))}
            className={`rounded-full py-2 transition disabled:opacity-30 ${
              side === s ? (s === "buy" ? "bg-gain text-black" : "bg-loss text-white") : "text-muted hover:text-fg"
            }`}
          >
            {s === "buy" ? "Buy to open" : `Sell to close${held ? ` (${held})` : ""}`}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-surface-2 p-4">
        <div>
          <p className="text-xs text-muted">Contracts</p>
          <p className="text-xs text-muted">1 contract = {mult} {mult === 1 ? "unit" : "shares"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-9 place-items-center rounded-full bg-bg text-muted hover:text-fg" aria-label="Fewer">
            <Minus size={16} />
          </button>
          <span className="tabular w-8 text-center text-2xl font-semibold">{qty}</span>
          <button
            onClick={() => setQty(side === "sell" ? Math.min(held, qty + 1) : qty + 1)}
            className="grid size-9 place-items-center rounded-full bg-bg text-muted hover:text-fg"
            aria-label="More"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <PayoffChart type={c.type} strike={c.strike} premium={q.ask} mult={mult * qty} spot={q.underlying} />

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <Row label={side === "buy" ? "Ask (per share)" : "Bid (per share)"}>{fmtPrice(premium)}</Row>
        <Row label="Underlying">{fmtPrice(q.underlying)}</Row>
        <Row label="Breakeven at expiry">{fmtPrice(breakeven)}</Row>
        <Row label="Expires in">{days < 1 ? `${Math.round(days * 24)} h` : `${days.toFixed(1)} days`}</Row>
        <Row label="Delta">{q.delta.toFixed(2)}</Row>
        <Row label="Time decay / day">{money(q.theta * mult * qty)}</Row>
        <Row label="Implied volatility">{pct(q.iv, false)}</Row>
        <Row label="Max profit">{side === "buy" ? maxProfit : "—"}</Row>
      </dl>

      <div className="rounded-2xl border border-line p-3 text-sm">
        <Row label={side === "buy" ? "Available cash" : "Contracts you own"}>{side === "buy" ? money(availableCash(account)) : held}</Row>
        <Row label="Fee">{money(1)}</Row>
        <Row label={side === "buy" ? "Total cost (= max loss)" : "You receive"} strong>
          {preview.ok ? money(preview.value.net) : "—"}
        </Row>
      </div>

      {(error ?? (!preview.ok ? preview.error : null)) && <p className="-mt-1 text-sm font-medium text-loss">{error ?? (!preview.ok && preview.error)}</p>}

      <Button variant={side === "buy" ? "gain" : "loss"} className="w-full py-4 text-base" disabled={!preview.ok} onClick={submit}>
        {side === "buy" ? "Buy" : "Sell"} {qty} {c.symbol} {formatStrike(c.strike)} {c.type}
        {qty === 1 ? "" : "s"}
      </Button>
      <p className="-mt-2 text-center text-xs text-muted">
        European-style, cash-settled at expiry. When buying, you can lose the full premium. Simulated, play money.
      </p>
    </div>
  );
}

/** Profit/loss at expiry across a range of underlying prices. */
function PayoffChart({ type, strike, premium, mult, spot }: { type: "call" | "put"; strike: number; premium: number; mult: number; spot: number }) {
  const uid = useId();
  const W = 400;
  const H = 120;
  const lo = Math.min(spot, strike) * 0.75;
  const hi = Math.max(spot, strike) * 1.25;
  const xs = Array.from({ length: 61 }, (_, i) => lo + ((hi - lo) * i) / 60);
  const ys = xs.map((s) => payoffAtExpiry({ type, strike }, s, premium, 1) * mult);
  const yMin = Math.min(...ys, 0);
  const yMax = Math.max(...ys, 0);
  const sx = (s: number) => ((s - lo) / (hi - lo)) * W;
  const sy = (v: number) => H - 8 - ((v - yMin) / (yMax - yMin || 1)) * (H - 16);
  const d = xs.map((s, i) => `${i ? "L" : "M"}${sx(s).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join("");
  const zero = sy(0);
  const be = type === "call" ? strike + premium : strike - premium;

  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <div className="mb-1 flex justify-between text-[11px] text-muted">
        <span>Profit / loss at expiry</span>
        <span>
          <span className="text-gain">■</span> profit <span className="text-loss">■</span> loss
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <clipPath id={`${uid}a`}>
            <rect x="0" y="0" width={W} height={zero} />
          </clipPath>
          <clipPath id={`${uid}b`}>
            <rect x="0" y={zero} width={W} height={H - zero} />
          </clipPath>
        </defs>
        <path d={`${d}L${W},${zero}L0,${zero}Z`} fill="var(--color-gain)" opacity="0.18" clipPath={`url(#${uid}a)`} />
        <path d={`${d}L${W},${zero}L0,${zero}Z`} fill="var(--color-loss)" opacity="0.18" clipPath={`url(#${uid}b)`} />
        <line x1="0" x2={W} y1={zero} y2={zero} stroke="var(--color-line)" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--color-fg)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <line x1={sx(spot)} x2={sx(spot)} y1="0" y2={H} stroke="var(--color-accent)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        {be > lo && be < hi && <circle cx={sx(be)} cy={zero} r="3.5" fill="var(--color-fg)" />}
      </svg>
      <div className="flex justify-between text-[11px] text-muted">
        <span className="tabular">{fmtPrice(lo)}</span>
        <span className="text-accent">— now {fmtPrice(spot)}</span>
        <span className="tabular">{fmtPrice(hi)}</span>
      </div>
    </div>
  );
}

function Row({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`tabular text-right ${strong ? "font-semibold" : ""}`}>{children}</dd>
    </div>
  );
}
