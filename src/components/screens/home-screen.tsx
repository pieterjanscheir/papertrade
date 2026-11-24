"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpFromLine, Compass, History, Plus } from "lucide-react";
import { market } from "@/lib/market/provider";
import { sampleTimes, type Range } from "@/lib/market/simulator";
import { netDeposits, summarize, valueHistory } from "@/lib/trading/engine";
import { availableCash, openOrders } from "@/lib/trading/orders";
import { useAccount } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { dateTime, money, pct, signedMoney, tone } from "@/lib/ui/format";
import { useIsWide } from "@/lib/ui/media";
import { AllocationCard } from "../allocation-card";
import { AssetRow } from "../asset-row";
import { HoldingsTable } from "../holdings-table";
import { MoneySheet, type MoneyAction } from "../money-sheet";
import { OrderList } from "../open-orders";
import { PriceChart } from "../price-chart";
import { Button, Card, EmptyState, IconAction, RangeTabs, SectionTitle } from "../ui";

export function HomeScreen() {
  const now = useNow();
  const wide = useIsWide();
  const account = useAccount();
  const [range, setRange] = useState<Range>("1M");
  const [hover, setHover] = useState<number | null>(null);
  const [moneyAction, setMoneyAction] = useState<MoneyAction | null>(null);

  const summary = summarize(account, market.priceAt, now);
  const orders = openOrders(account);

  const firstTx = account.transactions.reduce((m, t) => Math.min(m, t.time), Infinity);
  const history = useMemo(() => {
    let times = sampleTimes(range, now).filter((t) => t >= firstTx);
    if (times.length < 2) times = [Math.min(firstTx, now - 60_000), now];
    return valueHistory(account.transactions, times, market.priceAt);
  }, [account.transactions, range, now, firstTx]);

  const first = history[0];
  const shown = hover !== null ? history[hover] : history[history.length - 1];
  // Strip out deposits/withdrawals so adding cash doesn't look like a gain.
  const flows = netDeposits(account.transactions, shown.t) - netDeposits(account.transactions, first.t);
  const change = shown.value - first.value - flows;
  const changePct = first.value + flows > 0 ? change / (first.value + flows) : 0;

  const movers = useMemo(
    () =>
      market
        .listAssets()
        .map((a) => ({ symbol: a.symbol, pct: market.quote(a.symbol, now).changePct }))
        .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
        .slice(0, 5),
    [now],
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:gap-10">
      {/* Main column */}
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <header>
            <p className="text-sm font-medium text-muted">Total portfolio</p>
            <p className="tabular mt-1 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{money(shown.value)}</p>
            <p className={`tabular mt-2 text-sm font-semibold lg:text-base ${tone(change)}`}>
              {signedMoney(change)} ({pct(changePct)})
              <span className="ml-1.5 font-normal text-muted">{hover !== null ? dateTime(shown.t) : rangeLabel(range)}</span>
            </p>
          </header>
          <div className="hidden gap-2 lg:flex">
            <Button onClick={() => setMoneyAction("deposit")}>
              <Plus size={16} /> Add money
            </Button>
            <Button variant="secondary" onClick={() => setMoneyAction("withdraw")}>
              Withdraw
            </Button>
          </div>
        </div>

        <Card className="flex flex-col gap-4 p-3 pt-6 sm:p-5 sm:pt-8">
          <PriceChart points={history.map((p) => ({ t: p.t, v: p.value }))} onHover={setHover} height={wide ? 340 : 200} />
          <RangeTabs value={range} onChange={setRange} />
        </Card>

        <div className="flex justify-around sm:justify-start sm:gap-10 lg:hidden">
          <IconAction icon={<Plus size={20} />} label="Add money" onClick={() => setMoneyAction("deposit")} />
          <IconAction icon={<Compass size={20} />} label="Invest" href="/markets" />
          <IconAction icon={<ArrowUpFromLine size={20} />} label="Withdraw" onClick={() => setMoneyAction("withdraw")} />
          <IconAction icon={<History size={20} />} label="Activity" href="/activity" />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Invested" value={money(summary.invested)} />
          <Stat
            label="Total return"
            value={<span className={tone(summary.pnl)}>{signedMoney(summary.pnl)}</span>}
            sub={<span className={tone(summary.pnl)}>{pct(summary.pnlPct)}</span>}
          />
          <Stat label="Cash" value={money(summary.cash)} />
          <Stat label="Available to invest" value={money(availableCash(account))} sub={orders.length ? `${orders.length} open orders` : undefined} />
        </div>

        <div>
          <SectionTitle
            action={
              <Link href="/markets" className="text-sm font-semibold text-accent">
                Invest more
              </Link>
            }
          >
            Your investments
          </SectionTitle>
          <Card className="overflow-hidden">
            {summary.holdings.length === 0 ? (
              <EmptyState
                title="No investments yet"
                body="Pick a stock, ETF or coin and make your first (fake) trade."
                action={
                  <Link href="/markets" className="rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg">
                    Explore markets
                  </Link>
                }
              />
            ) : (
              <HoldingsTable summary={summary} now={now} />
            )}
          </Card>
        </div>
      </div>

      {/* Side column (stacks below on smaller screens) */}
      <aside className="flex min-w-0 flex-col gap-8 xl:gap-6">
        {summary.holdings.length > 0 && <AllocationCard summary={summary} />}

        <div>
          <SectionTitle
            action={
              <Link href="/activity?tab=orders" className="text-sm font-semibold text-accent">
                All orders
              </Link>
            }
          >
            Open orders
          </SectionTitle>
          <Card className="overflow-hidden">
            {orders.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted">
                No open orders. Use a limit or stop order on any asset to buy or sell automatically at your price.
              </p>
            ) : (
              <OrderList orders={orders} now={now} />
            )}
          </Card>
        </div>

        {account.watchlist.length > 0 && (
          <div>
            <SectionTitle>Watchlist</SectionTitle>
            <Card className="p-1.5">
              {account.watchlist.map((s) => (
                <AssetRow key={s} symbol={s} now={now} spark={!wide} />
              ))}
            </Card>
          </div>
        )}

        <div>
          <SectionTitle
            action={
              <Link href="/markets" className="text-sm font-semibold text-accent">
                See all
              </Link>
            }
          >
            Biggest movers today
          </SectionTitle>
          <Card className="p-1.5">
            {movers.map((m) => (
              <AssetRow key={m.symbol} symbol={m.symbol} now={now} spark={!wide} />
            ))}
          </Card>
        </div>
      </aside>

      <MoneySheet action={moneyAction} onClose={() => setMoneyAction(null)} />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="tabular mt-1 text-lg font-semibold">{value}</p>
      {sub && <p className="tabular text-xs font-semibold text-muted">{sub}</p>}
    </Card>
  );
}

function rangeLabel(r: Range) {
  return { "1D": "Today", "1W": "Past week", "1M": "Past month", "1Y": "Past year", "5Y": "All time" }[r];
}
