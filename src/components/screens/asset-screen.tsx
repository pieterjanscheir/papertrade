"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { enabledFeatures } from "@/features";
import { ASSET_TYPE_LABEL } from "@/lib/market/assets";
import { market } from "@/lib/market/provider";
import { sma, type Range } from "@/lib/market/simulator";
import type { Side } from "@/lib/trading/engine";
import { portfolioSummary } from "@/lib/trading/portfolio";
import { useAccount, useAccountStore } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { dateTime, money, pct, price as fmtPrice, qty, signedMoney, tone } from "@/lib/ui/format";
import { useIsWide } from "@/lib/ui/media";
import { CandleChart, type Indicator } from "../candle-chart";
import { OptionPositions, OptionsChain } from "../options-chain";
import { OrderList } from "../open-orders";
import { OrderForm } from "../order-form";
import { PriceChart, type ChartMarker } from "../price-chart";
import { TradeSheet } from "../trade-sheet";
import { AssetAvatar, Button, Card, RangeTabs, ScreenSkeleton, SectionTitle } from "../ui";

export function AssetScreen({ symbol }: { symbol: string }) {
  const now = useNow();
  const wide = useIsWide();
  const account = useAccount();
  const toggleWatch = useAccountStore((s) => s.toggleWatch);
  const asset = market.getAsset(symbol)!;
  const [range, setRange] = useState<Range>("1D");
  const [hover, setHover] = useState<number | null>(null);
  const [trade, setTrade] = useState<Side | null>(null);
  const [chartType, setChartType] = useState<"line" | "candles">("line");
  const [overlays, setOverlays] = useState({ ma20: true, ma50: false, volume: true });

  const history = useMemo(() => market.history(symbol, range, now), [symbol, range, now]);
  const stats = useMemo(() => market.stats(symbol, now), [symbol, now]);

  const MA_EXTRA = 50;
  const allCandles = useMemo(
    () => (chartType === "candles" ? market.candles(symbol, range, now, MA_EXTRA) : []),
    [chartType, symbol, range, now],
  );
  const candles = allCandles.slice(MA_EXTRA);
  const indicators: Indicator[] = [];
  if (chartType === "candles") {
    if (overlays.ma20) indicators.push({ label: "MA 20", color: "#22b8cf", values: sma(allCandles, 20).slice(MA_EXTRA) });
    if (overlays.ma50) indicators.push({ label: "MA 50", color: "#b48cff", values: sma(allCandles, 50).slice(MA_EXTRA) });
  }

  // Header follows whichever chart is being hovered.
  const first = history[0];
  const shown =
    hover === null
      ? history[history.length - 1]
      : chartType === "candles"
        ? { t: candles[hover].t, price: candles[hover].close }
        : history[hover];
  const change = shown.price - first.price;
  const changePct = change / first.price;

  const position = account.positions[symbol];
  const livePrice = history[history.length - 1].price;
  const watched = account.watchlist.includes(symbol);
  const trades = account.transactions.filter((t) => t.symbol === symbol).sort((a, b) => b.time - a.time);
  const orders = account.orders.filter((o) => o.symbol === symbol).sort((a, b) => b.createdAt - a.createdAt);
  const open = orders.filter((o) => o.status === "open");

  const markers: ChartMarker[] = [
    ...(position ? [{ value: position.avgCost, label: `Avg ${fmtPrice(position.avgCost)}`, tone: "muted" as const }] : []),
    ...open.map((o) => ({
      value: o.triggerPrice,
      label: `${o.type === "limit" ? "Limit" : "Stop"} ${o.side} ${fmtPrice(o.triggerPrice)}`,
      tone: o.side === "buy" ? ("gain" as const) : ("loss" as const),
    })),
  ];

  const myOptions = portfolioSummary(account, now).options.filter((o) => o.contract.startsWith(`${symbol}|`));
  const optionsCard = myOptions.length > 0 && (
    <div>
      <SectionTitle>Your options</SectionTitle>
      <Card className="overflow-hidden">
        <OptionPositions options={myOptions} now={now} />
      </Card>
    </div>
  );

  const featurePanels = enabledFeatures().map((f) => (f.AssetPanel ? <f.AssetPanel key={f.id} symbol={symbol} now={now} /> : null));

  const positionCard = position && (
    <Card className="grid grid-cols-2 gap-x-4 gap-y-4 p-5">
      <Stat label="Value" value={money(position.quantity * livePrice)} />
      <Stat
        label="Return"
        value={
          <span className={tone(livePrice - position.avgCost)}>
            {signedMoney((livePrice - position.avgCost) * position.quantity)}
            <span className="block text-xs">{pct((livePrice - position.avgCost) / position.avgCost)}</span>
          </span>
        }
      />
      <Stat label="Units" value={qty(position.quantity)} />
      <Stat label="Average cost" value={fmtPrice(position.avgCost)} />
    </Card>
  );

  // Server HTML inside a Suspense boundary can show before it hydrates; never show it with time = 0.
  if (!now) return <ScreenSkeleton />;

  return (
    <div className="grid gap-8 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] lg:gap-10 lg:pb-0">
      {/* Main column */}
      <div className="flex min-w-0 flex-col gap-7">
        <div className="flex items-center justify-between">
          <Link href="/markets" className="-ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-muted hover:text-fg">
            <ChevronLeft size={18} /> Invest
          </Link>
          <button
            onClick={() => toggleWatch(symbol)}
            className={`flex h-10 items-center gap-2 rounded-full bg-surface px-3 text-sm font-semibold ${watched ? "text-amber-400" : "text-muted hover:text-fg"}`}
            aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star size={17} fill={watched ? "currentColor" : "none"} />
            <span className="hidden sm:inline">{watched ? "Watching" : "Watch"}</span>
          </button>
        </div>

        <header className="flex items-start gap-4">
          <AssetAvatar asset={asset} size={wide ? 60 : 52} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted">
              {asset.name} · {asset.symbol} · {asset.exchange}
            </p>
            <p className="tabular mt-1 text-4xl font-semibold tracking-tight lg:text-5xl">{fmtPrice(shown.price)}</p>
            <p className={`tabular mt-1.5 text-sm font-semibold lg:text-base ${tone(change)}`}>
              {signedMoney(change)} ({pct(changePct)})
              <span className="ml-1.5 font-normal text-muted">{hover !== null ? dateTime(shown.t) : range === "1D" ? "Today" : range}</span>
            </p>
          </div>
        </header>

        <Card className="flex flex-col gap-4 p-3 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-surface-2 p-0.5 text-xs font-semibold">
              {(["line", "candles"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => (setChartType(t), setHover(null))}
                  className={`rounded-full px-3 py-1.5 capitalize ${chartType === t ? "bg-line text-fg" : "text-muted hover:text-fg"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            {chartType === "candles" && (
              <>
                {(
                  [
                    ["ma20", "MA 20", "#22b8cf"],
                    ["ma50", "MA 50", "#b48cff"],
                    ["volume", "Volume", "var(--color-muted)"],
                  ] as const
                ).map(([key, label, color]) => (
                  <button
                    key={key}
                    onClick={() => setOverlays((o) => ({ ...o, [key]: !o[key] }))}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      overlays[key] ? "border-line text-fg" : "border-transparent text-muted hover:text-fg"
                    }`}
                  >
                    <span className="size-2 rounded-full" style={{ background: overlays[key] ? color : "var(--color-line)" }} />
                    {label}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted">{CANDLE_LABEL[range]} candles</span>
              </>
            )}
          </div>
          {chartType === "line" ? (
            <div className="pt-3">
              <PriceChart points={history.map((p) => ({ t: p.t, v: p.price }))} onHover={setHover} height={wide ? 380 : 240} markers={markers} />
            </div>
          ) : (
            <CandleChart
              candles={candles}
              indicators={indicators}
              showVolume={overlays.volume}
              markers={markers}
              height={wide ? 400 : 280}
              timeFormat={(t) => timeLabel(t, range)}
              onHover={setHover}
            />
          )}
          <RangeTabs value={range} onChange={(r) => (setRange(r), setHover(null))} />
        </Card>

        {!wide && position && (
          <div>
            <SectionTitle>Your position</SectionTitle>
            {positionCard}
          </div>
        )}

        {!wide && open.length > 0 && (
          <div>
            <SectionTitle>Open orders</SectionTitle>
            <Card className="overflow-hidden">
              <OrderList orders={open} now={now} showAsset={false} />
            </Card>
          </div>
        )}

        {!wide && optionsCard}

        <OptionsChain symbol={symbol} now={now} />

        {/* Feature slot: AssetPanel (src/features), in the main column on small screens */}
        {!wide && featurePanels}

        <div>
          <SectionTitle>Stats</SectionTitle>
          <Card className="grid grid-cols-2 gap-x-4 gap-y-5 p-5 sm:grid-cols-3 xl:grid-cols-6">
            <Stat label="Day high" value={fmtPrice(stats.dayHigh)} />
            <Stat label="Day low" value={fmtPrice(stats.dayLow)} />
            <Stat label="52w high" value={fmtPrice(stats.yearHigh)} />
            <Stat label="52w low" value={fmtPrice(stats.yearLow)} />
            <Stat label="1Y return" value={<span className={tone(stats.yearChangePct)}>{pct(stats.yearChangePct)}</span>} />
            <Stat label="Volatility" value={pct(asset.volatility, false)} />
          </Card>
        </div>

        <div>
          <SectionTitle>About</SectionTitle>
          <Card className="p-5">
            <p className="text-[15px] leading-relaxed">{asset.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {[...new Set([ASSET_TYPE_LABEL[asset.type].replace(/s$/, ""), asset.sector, asset.exchange])].map((t) => (
                <span key={t} className="rounded-full bg-surface-2 px-3 py-1 font-medium text-muted">
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {orders.some((o) => o.status !== "open") && (
          <div>
            <SectionTitle>Order history</SectionTitle>
            <Card className="overflow-hidden">
              <OrderList orders={orders.filter((o) => o.status !== "open")} now={now} showAsset={false} />
            </Card>
          </div>
        )}

        {trades.length > 0 && (
          <div>
            <SectionTitle>Your trades</SectionTitle>
            <Card className="divide-y divide-line">
              {trades.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <div>
                    <p className="font-semibold capitalize">{t.type}</p>
                    <p className="text-muted">{dateTime(t.time)}</p>
                  </div>
                  <div className="tabular text-right">
                    <p className="font-semibold">{money(t.amount)}</p>
                    <p className="text-muted">
                      {qty(t.quantity!)} @ {fmtPrice(t.price!)}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* Order panel (wide screens) */}
      {wide && (
        <aside className="flex flex-col gap-6 self-start lg:sticky lg:top-8">
          <Card className="p-5">
            <OrderForm key={symbol} symbol={symbol} />
          </Card>
          {position && (
            <div>
              <SectionTitle>Your position</SectionTitle>
              {positionCard}
            </div>
          )}
          {open.length > 0 && (
            <div>
              <SectionTitle>Open orders</SectionTitle>
              <Card className="overflow-hidden">
                <OrderList orders={open} now={now} showAsset={false} />
              </Card>
            </div>
          )}
          {optionsCard}
          {featurePanels}
        </aside>
      )}

      {/* Mobile sticky trade bar */}
      {!wide && (
        <div className="fixed inset-x-0 bottom-[calc(62px+env(safe-area-inset-bottom))] z-20 flex gap-3 border-t border-line bg-bg/85 px-4 py-3 backdrop-blur-xl md:bottom-0 md:left-60">
          <Button variant="gain" className="flex-1" onClick={() => setTrade("buy")}>
            Buy
          </Button>
          <Button variant="secondary" className="flex-1" disabled={!position} onClick={() => setTrade("sell")}>
            Sell
          </Button>
        </div>
      )}

      <TradeSheet symbol={symbol} open={trade !== null} side={trade ?? "buy"} onClose={() => setTrade(null)} />
    </div>
  );
}

const CANDLE_LABEL: Record<Range, string> = { "1D": "15-minute", "1W": "2-hour", "1M": "8-hour", "1Y": "2-day", "5Y": "2-week" };

function timeLabel(t: number, range: Range) {
  const d = new Date(t);
  if (range === "1D") return d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
  if (range === "1W") return d.toLocaleString("en-IE", { weekday: "short", hour: "2-digit", minute: "2-digit" });
  if (range === "5Y") return d.toLocaleDateString("en-IE", { month: "short", year: "numeric" });
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "short" });
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="tabular mt-0.5 text-[15px] font-semibold">{value}</p>
    </div>
  );
}
