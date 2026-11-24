"use client";

import { useId, useState } from "react";
import { blackScholes, payoffAtExpiry, RISK_FREE_RATE } from "@/lib/market/options";
import { money, signedMoney } from "@/lib/ui/format";

const SPOT = 100;
const MULT = 100;

/**
 * Interactive options playground on a made-up stock (Waffle Corp, €100).
 * Pick call/put, strike, time and volatility; the premium is priced with
 * Black-Scholes. Then drag the price at expiry and see what you'd make or lose.
 */
export function OptionsLab() {
  const uid = useId();
  const [type, setType] = useState<"call" | "put">("call");
  const [strike, setStrike] = useState(105);
  const [days, setDays] = useState(30);
  const [vol, setVol] = useState(35);
  const [end, setEnd] = useState(112);

  const years = days / 365;
  const bs = blackScholes(type, SPOT, strike, years, vol / 100, RISK_FREE_RATE);
  const premium = Math.round(bs.price * 100) / 100;
  const intrinsicNow = Math.max(0, type === "call" ? SPOT - strike : strike - SPOT);
  const timeValue = Math.max(0, premium - intrinsicNow);
  const breakeven = type === "call" ? strike + premium : strike - premium;
  const pnl = payoffAtExpiry({ type, strike }, end, premium, MULT);
  const cost = premium * MULT;
  const thetaContract = bs.theta * MULT;

  // Payoff chart
  const W = 520;
  const H = 180;
  const lo = 50;
  const hi = 150;
  const xs = Array.from({ length: 101 }, (_, i) => lo + i);
  const ys = xs.map((s) => payoffAtExpiry({ type, strike }, s, premium, MULT));
  const yMin = Math.min(...ys, -cost) * 1.1;
  const yMax = Math.max(...ys, cost) * 1.05;
  const sx = (s: number) => ((s - lo) / (hi - lo)) * W;
  const sy = (v: number) => H - 10 - ((v - yMin) / (yMax - yMin)) * (H - 20);
  const d = xs.map((s, i) => `${i ? "L" : "M"}${sx(s).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join("");
  const zero = sy(0);

  const verdict =
    pnl > cost * 2
      ? `🚀 Waffle Corp went to the moon. Your ${type} made ${signedMoney(pnl)}: more than three times your money.`
      : pnl > 0
        ? `🧇 Nicely done: ${signedMoney(pnl)}. You were right, and by enough.`
        : pnl > -cost
          ? `😬 Right direction, not far enough. You keep some value, but lose ${money(-pnl)} overall.`
          : `🫠 Expired worthless. The full ${money(cost)} premium is gone. The waffles were tasty, though.`;

  return (
    <div className="rounded-2xl border border-accent/30 bg-surface-2/50 p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">Options Lab</p>
          <p className="font-semibold">Waffle Corp (WAFL) · €{SPOT.toFixed(2)} today</p>
        </div>
        <div className="flex rounded-full bg-bg p-0.5 text-sm font-semibold">
          {(["call", "put"] as const).map((t) => (
            <button
              key={t}
              onClick={() => (setType(t), setStrike(t === "call" ? 105 : 95), setEnd(t === "call" ? 112 : 88))}
              className={`rounded-full px-4 py-1.5 capitalize ${type === t ? (t === "call" ? "bg-gain text-black" : "bg-loss text-white") : "text-muted"}`}
            >
              Buy a {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <Slider label="Strike" value={`€${strike}`} min={70} max={130} step={5} v={strike} set={setStrike} />
        <Slider label="Days to expiry" value={`${days} d`} min={1} max={180} step={1} v={days} set={setDays} />
        <Slider label="Implied volatility" value={`${vol}%`} min={10} max={120} step={5} v={vol} set={setVol} />
      </div>

      {/* Premium breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="Premium per share" value={`€${premium.toFixed(2)}`} />
        <Stat label="One contract costs" value={money(cost)} sub="= your max loss" />
        <Stat label="Breakeven at expiry" value={`€${breakeven.toFixed(2)}`} />
        <Stat label="Delta · time decay" value={`${bs.delta.toFixed(2)} · ${money(thetaContract)}/d`} />
      </div>
      <div className="mt-3">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-bg">
          <div className="bg-accent" style={{ width: `${premium ? (intrinsicNow / premium) * 100 : 0}%` }} />
          <div className="bg-accent/35" style={{ width: `${premium ? (timeValue / premium) * 100 : 0}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-muted">
          <span className="text-accent">■</span> intrinsic €{intrinsicNow.toFixed(2)} <span className="ml-2 text-accent/50">■</span> time value €
          {timeValue.toFixed(2)}
          {intrinsicNow === 0 && " (all hope, no substance yet)"}
        </p>
      </div>

      {/* Payoff */}
      <div className="mt-5">
        <Slider label="Where does WAFL end up at expiry?" value={`€${end}`} min={lo} max={hi} step={1} v={end} set={setEnd} />
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-44 w-full" preserveAspectRatio="none" aria-label="Profit or loss at expiry">
          <defs>
            <clipPath id={`${uid}up`}>
              <rect x="0" y="0" width={W} height={zero} />
            </clipPath>
            <clipPath id={`${uid}down`}>
              <rect x="0" y={zero} width={W} height={H - zero} />
            </clipPath>
          </defs>
          <path d={`${d}L${W},${zero}L0,${zero}Z`} fill="var(--color-gain)" opacity="0.18" clipPath={`url(#${uid}up)`} />
          <path d={`${d}L${W},${zero}L0,${zero}Z`} fill="var(--color-loss)" opacity="0.18" clipPath={`url(#${uid}down)`} />
          <line x1="0" x2={W} y1={zero} y2={zero} stroke="var(--color-line)" vectorEffect="non-scaling-stroke" />
          <line x1={sx(SPOT)} x2={sx(SPOT)} y1="0" y2={H} stroke="var(--color-muted)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          <line x1={sx(strike)} x2={sx(strike)} y1="0" y2={H} stroke="var(--color-accent)" strokeDasharray="3 4" opacity="0.6" vectorEffect="non-scaling-stroke" />
          <path d={d} fill="none" stroke="var(--color-fg)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line x1={sx(end)} x2={sx(end)} y1="0" y2={H} stroke={pnl >= 0 ? "var(--color-gain)" : "var(--color-loss)"} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="flex justify-between text-[11px] text-muted">
          <span>€{lo}</span>
          <span>
            ┆ today €{SPOT} <span className="text-accent">┆ strike €{strike}</span>
          </span>
          <span>€{hi}</span>
        </div>
        <p className={`mt-3 rounded-xl p-3 text-sm font-medium ${pnl >= 0 ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"}`}>
          {verdict} <span className="tabular block text-xs font-normal text-muted">P/L at expiry for one contract: {signedMoney(pnl)} (fees not included)</span>
        </p>
      </div>

      <p className="mt-3 text-xs text-muted">
        Try this: set expiry to 1 day and slide the strike far out of the money. Cheap, right? Now look at how far WAFL has to move to break even.
      </p>
    </div>
  );
}

function Slider({ label, value, min, max, step, v, set }: { label: string; value: string; min: number; max: number; step: number; v: number; set: (n: number) => void }) {
  return (
    <label className="block text-xs text-muted">
      <span className="flex justify-between">
        {label} <span className="tabular font-semibold text-fg">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="mt-1 w-full accent-[var(--color-accent)]" />
    </label>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-bg p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="tabular font-semibold">{value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}
