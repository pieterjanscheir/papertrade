"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { chainAt, contractId, contractLabel, expiriesAt, formatStrike, multiplier, parseContract } from "@/lib/market/options";
import { DAY } from "@/lib/market/simulator";
import type { OptionHoldingValue } from "@/lib/trading/engine";
import { money, price as fmtPrice, signedMoney, tone, pct } from "@/lib/ui/format";
import { OptionTradeSheet } from "./option-trade-sheet";
import { Card, SectionTitle } from "./ui";

/** Calls on the left, puts on the right, strikes in the middle. Click a price to trade. */
export function OptionsChain({ symbol, now }: { symbol: string; now: number }) {
  // Listed expiries change only when a Friday passes; recompute per market hour.
  const hour = Math.floor(now / 3_600_000);
  const expiries = useMemo(() => expiriesAt(hour * 3_600_000), [hour]);
  const [picked, setPicked] = useState<number | null>(null);
  const expiry = picked !== null && expiries.includes(picked) ? picked : expiries[0];
  const [mobileSide, setMobileSide] = useState<"call" | "put">("call");
  const [trade, setTrade] = useState<{ id: string; side: "buy" | "sell" } | null>(null);

  const rows = chainAt(symbol, expiry, now);
  const spot = rows[0]?.call.underlying ?? 0;
  const mult = multiplier(symbol);
  const spotIndex = rows.findIndex((r) => r.strike > spot);

  const open = (type: "call" | "put", strike: number, side: "buy" | "sell") => setTrade({ id: contractId(symbol, type, strike, expiry), side });

  const cell = (type: "call" | "put", strike: number, value: number, side: "buy" | "sell") => (
    <button
      onClick={() => open(type, strike, side)}
      className={`tabular rounded-md px-1.5 py-0.5 font-semibold transition ${side === "buy" ? "hover:bg-gain hover:text-black" : "hover:bg-loss hover:text-white"}`}
      title={`${side === "buy" ? "Buy" : "Sell"} ${symbol} ${formatStrike(strike)} ${type}`}
    >
      {value.toFixed(2)}
    </button>
  );

  return (
    <div>
      <SectionTitle
        action={
          <Link href="/learn#options" className="flex items-center gap-1.5 text-sm font-semibold text-accent">
            <GraduationCap size={15} /> What are options?
          </Link>
        }
      >
        Options
      </SectionTitle>
      <Card className="overflow-hidden">
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-line p-3">
          {expiries.map((e) => {
            const days = Math.max(0, Math.ceil((e - now) / DAY));
            return (
              <button
                key={e}
                onClick={() => setPicked(e)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${e === expiry ? "bg-fg text-bg" : "bg-surface-2 text-muted hover:text-fg"}`}
              >
                {new Date(e).toLocaleDateString("en-IE", { day: "numeric", month: "short" })} <span className="opacity-60">· {days}d</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-1 p-3 pb-0 md:hidden">
          {(["call", "put"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setMobileSide(s)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold capitalize ${mobileSide === s ? "bg-surface-2 text-fg" : "text-muted"}`}
            >
              {s}s
            </button>
          ))}
        </div>

        <table className="tabular w-full text-center text-xs sm:text-sm">
          <thead className="text-[11px] text-muted">
            <tr>
              <th colSpan={3} className={`pt-3 font-semibold text-gain ${mobileSide === "put" ? "hidden md:table-cell" : ""}`}>
                Calls
              </th>
              <th />
              <th colSpan={3} className={`pt-3 font-semibold text-loss ${mobileSide === "call" ? "hidden md:table-cell" : ""}`}>
                Puts
              </th>
            </tr>
            <tr className="[&>th]:py-2 [&>th]:font-medium">
              {(["Δ", "Bid", "Ask"] as const).map((h) => (
                <th key={`c${h}`} className={mobileSide === "put" ? "hidden md:table-cell" : ""}>
                  {h}
                </th>
              ))}
              <th className="text-fg">Strike</th>
              {(["Bid", "Ask", "Δ"] as const).map((h) => (
                <th key={`p${h}`} className={mobileSide === "call" ? "hidden md:table-cell" : ""}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const callItm = r.strike < spot;
              const callCls = `${callItm ? "bg-accent/[0.06]" : ""} ${mobileSide === "put" ? "hidden md:table-cell" : ""}`;
              const putCls = `${!callItm ? "bg-accent/[0.06]" : ""} ${mobileSide === "call" ? "hidden md:table-cell" : ""}`;
              return [
                i === spotIndex && (
                  <tr key="spot">
                    <td colSpan={7} className="py-0">
                      <div className="flex items-center gap-2 px-3 text-[11px] font-semibold text-accent">
                        <span className="h-px flex-1 bg-accent/50" /> {symbol} {fmtPrice(spot)} <span className="h-px flex-1 bg-accent/50" />
                      </div>
                    </td>
                  </tr>
                ),
                <tr key={r.strike} className="border-t border-line/60 [&>td]:py-1.5">
                  <td className={`text-muted ${callCls}`}>{r.call.delta.toFixed(2)}</td>
                  <td className={callCls}>{cell("call", r.strike, r.call.bid, "sell")}</td>
                  <td className={callCls}>{cell("call", r.strike, r.call.ask, "buy")}</td>
                  <td className="bg-surface-2/60 font-semibold">{formatStrike(r.strike)}</td>
                  <td className={putCls}>{cell("put", r.strike, r.put.bid, "sell")}</td>
                  <td className={putCls}>{cell("put", r.strike, r.put.ask, "buy")}</td>
                  <td className={`text-muted ${putCls}`}>{r.put.delta.toFixed(2)}</td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
        <p className="border-t border-line p-3 text-[11px] text-muted">
          Prices per {mult === 1 ? "unit" : "share"}; 1 contract = {mult} {mult === 1 ? "unit" : "shares"}. Tap an ask to buy. Shaded = in the money. European-style, cash-settled at
          expiry (Fridays 16:00 UTC). Simulated.
        </p>
      </Card>
      <OptionTradeSheet contract={trade?.id ?? null} side={trade?.side ?? "buy"} onClose={() => setTrade(null)} />
    </div>
  );
}

/** List of option positions with value and P/L; click to close. */
export function OptionPositions({ options, now }: { options: OptionHoldingValue[]; now: number }) {
  const [closing, setClosing] = useState<string | null>(null);
  if (options.length === 0) return null;
  return (
    <>
      <ul className="divide-y divide-line">
        {options.map((o) => {
          const c = parseContract(o.contract);
          const days = (c.expiry - now) / DAY;
          return (
            <li key={o.contract}>
              <button onClick={() => setClosing(o.contract)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-2">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${c.type === "call" ? "bg-gain/15 text-gain" : "bg-loss/15 text-loss"}`}>
                  {c.type === "call" ? "C" : "P"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold">{contractLabel(c)}</span>
                  <span className="block text-sm text-muted">
                    {o.quantity} contract{o.quantity === 1 ? "" : "s"} · {days > 0 ? `expires in ${days < 1 ? `${Math.round(days * 24)} h` : `${Math.ceil(days)} d`}` : "settling"}
                  </span>
                </span>
                <span className="tabular text-right">
                  <span className="block text-[15px] font-semibold">{money(o.value)}</span>
                  <span className={`block text-xs font-semibold ${tone(o.pnl)}`}>
                    {signedMoney(o.pnl)} · {pct(o.pnlPct)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <OptionTradeSheet contract={closing} side="sell" onClose={() => setClosing(null)} />
    </>
  );
}
