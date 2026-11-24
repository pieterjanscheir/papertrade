"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { chainAt, contractId, contractLabel, expiriesAt, formatStrike, multiplier, parseContract } from "@/lib/market/options";
import { DAY } from "@/lib/market/simulator";
import type { OptionHoldingValue } from "@/lib/trading/engine";
import { money, price as fmtPrice, signedMoney, tone, pct } from "@/lib/ui/format";
import { DataTable, type Column } from "./data-table";
import { OptionTradeSheet } from "./option-trade-sheet";
import { Card, SectionTitle } from "./ui";

type ChainRow = ReturnType<typeof chainAt>[number];

/** Calls on the left, puts on the right, strikes in the middle. Click a price to trade. */
export function OptionsChain({ symbol, now }: { symbol: string; now: number }) {
  // Listed expiries change only when a Friday passes; recompute per market hour.
  const hour = Math.floor(now / 3_600_000);
  const expiries = useMemo(() => expiriesAt(hour * 3_600_000), [hour]);
  const [picked, setPicked] = useState<number | null>(null);
  const expiry = picked !== null && expiries.includes(picked) ? picked : expiries[0];
  const [trade, setTrade] = useState<{ id: string; side: "buy" | "sell" } | null>(null);

  const rows = chainAt(symbol, expiry, now);
  const spot = rows[0]?.call.underlying ?? 0;
  const mult = multiplier(symbol);
  const firstAbove = rows.find((r) => r.strike > spot)?.strike;
  const strikesSorted = rows.map((r) => r.strike);
  const atmIndex = strikesSorted.reduce((best, k, i) => (Math.abs(k - spot) < Math.abs(strikesSorted[best] - spot) ? i : best), 0);

  const open = (type: "call" | "put", strike: number, side: "buy" | "sell") => setTrade({ id: contractId(symbol, type, strike, expiry), side });

  const priceButton = (type: "call" | "put", strike: number, value: number, side: "buy" | "sell") => (
    <button
      onClick={(e) => (e.stopPropagation(), open(type, strike, side))}
      className={`tabular rounded-md px-1.5 py-0.5 font-semibold transition ${side === "buy" ? "hover:bg-gain hover:text-black" : "hover:bg-loss hover:text-white"}`}
      title={`${side === "buy" ? "Buy" : "Sell"} ${symbol} ${formatStrike(strike)} ${type}`}
    >
      {value.toFixed(2)}
    </button>
  );

  const itmCall = (r: ChainRow) => r.strike < spot;
  const shade = (on: boolean) => (on ? "rounded-md bg-accent/[0.08] px-1 py-0.5" : "px-1 py-0.5");

  const columns: Column<ChainRow>[] = [
    {
      key: "strike",
      header: "Strike",
      align: "center",
      sortValue: (r) => r.strike,
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          {formatStrike(r.strike)}
          {r.strike === firstAbove && <span className="rounded bg-accent/15 px-1 text-[10px] text-accent">↑ spot</span>}
        </span>
      ),
    },
    { key: "cBid", header: "Call bid", align: "right", sortValue: (r) => r.call.bid, render: (r) => <span className={shade(itmCall(r))}>{priceButton("call", r.strike, r.call.bid, "sell")}</span> },
    { key: "cAsk", header: "Call ask", align: "right", sortValue: (r) => r.call.ask, render: (r) => <span className={shade(itmCall(r))}>{priceButton("call", r.strike, r.call.ask, "buy")}</span> },
    { key: "cDelta", header: "Call Δ", align: "right", sortValue: (r) => r.call.delta, render: (r) => <span className="text-muted">{r.call.delta.toFixed(2)}</span> },
    { key: "pBid", header: "Put bid", align: "right", sortValue: (r) => r.put.bid, render: (r) => <span className={shade(!itmCall(r))}>{priceButton("put", r.strike, r.put.bid, "sell")}</span> },
    { key: "pAsk", header: "Put ask", align: "right", sortValue: (r) => r.put.ask, render: (r) => <span className={shade(!itmCall(r))}>{priceButton("put", r.strike, r.put.ask, "buy")}</span> },
    { key: "pDelta", header: "Put Δ", align: "right", sortValue: (r) => r.put.delta, render: (r) => <span className="text-muted">{r.put.delta.toFixed(2)}</span> },
  ];

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
        <div className="flex items-center gap-3 border-b border-line p-3">
          <div className="scrollbar-none flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
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
          <span className="tabular shrink-0 text-xs text-muted">
            {symbol} <span className="font-semibold text-accent">{fmtPrice(spot)}</span>
          </span>
        </div>
        <DataTable
          id="options-chain"
          rows={rows}
          rowKey={(r) => String(r.strike)}
          columns={columns}
          stickyFirst
          defaultSort={{ key: "strike", dir: "asc" }}
          filters={[
            { key: "near", label: "Near the money", test: (r) => Math.abs(rows.indexOf(r) - atmIndex) <= 2 },
            { key: "itmCalls", label: "Calls in the money", test: (r) => itmCall(r) },
            { key: "itmPuts", label: "Puts in the money", test: (r) => !itmCall(r) },
          ]}
          rowClassName={(r) => (r.strike === firstAbove ? "border-t-2 !border-t-accent/60" : "")}
        />
        <p className="border-t border-line p-3 text-[11px] text-muted">
          Prices per {mult === 1 ? "unit" : "share"}; 1 contract = {mult} {mult === 1 ? "unit" : "shares"}. Tap an ask to buy, a bid to sell. Shaded = in the money.
          European-style, cash-settled at expiry (Fridays 16:00 UTC). Simulated.
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
