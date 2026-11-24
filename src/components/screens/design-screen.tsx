"use client";

import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { FEATURES } from "@/features";
import { market } from "@/lib/market/provider";
import type { Range } from "@/lib/market/simulator";
import { useNow } from "@/lib/ui/clock";
import { compactMoney, money, pct, price, qty, signedMoney } from "@/lib/ui/format";
import { toast } from "@/lib/ui/toasts";
import { AssetRow } from "../asset-row";
import { CandleChart } from "../candle-chart";
import { PriceChart, Sparkline } from "../price-chart";
import { Sheet } from "../sheet";
import { AssetAvatar, Button, Card, ChangePill, EmptyState, IconAction, RangeTabs, SectionTitle } from "../ui";

const COLORS = [
  { token: "bg", use: "Page background", cls: "bg-bg" },
  { token: "surface", use: "Cards, panels", cls: "bg-surface" },
  { token: "surface-2", use: "Inputs, raised elements, hover", cls: "bg-surface-2" },
  { token: "line", use: "Borders, dividers", cls: "bg-line" },
  { token: "fg", use: "Primary text, primary button", cls: "bg-fg" },
  { token: "muted", use: "Secondary text, labels", cls: "bg-muted" },
  { token: "accent", use: "Links, focus, pending things", cls: "bg-accent" },
  { token: "accent-2", use: "Gradient partner of accent", cls: "bg-accent-2" },
  { token: "gain", use: "Up, profit, buy — direction only", cls: "bg-gain" },
  { token: "loss", use: "Down, loss, sell, errors", cls: "bg-loss" },
];

const TYPE = [
  { name: "Display", cls: "text-5xl font-semibold tracking-tight", sample: "€11,216.06", note: "Hero numbers: portfolio value, price" },
  { name: "Title", cls: "text-3xl font-semibold tracking-tight", sample: "Invest", note: "Page titles" },
  { name: "Heading", cls: "text-base font-semibold", sample: "Your investments", note: "Section titles (SectionTitle)" },
  { name: "Body", cls: "text-[15px]", sample: "Tracks the 500 largest US listed companies.", note: "Rows, descriptions" },
  { name: "Label", cls: "text-xs font-medium text-muted", sample: "Available cash", note: "Labels above values" },
];

export function DesignScreen() {
  const now = useNow();
  const [range, setRange] = useState<Range>("1W");
  const [sheet, setSheet] = useState(false);
  const aapl = market.getAsset("AAPL")!;
  const line = market.history("ASML", range, now).map((p) => ({ t: p.t, v: p.price }));
  const candles = market.candles("ASML", "1M", now);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <header>
        <p className="text-sm font-semibold text-accent">For builders</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Design system</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Everything you need to prototype in the same style. Colours live in <Code>src/app/globals.css</Code> (the{" "}
          <Code>@theme</Code> block); change a token there and the whole app follows. Components live in{" "}
          <Code>src/components</Code>. Prefer these over new one-off styles.
        </p>
      </header>

      <Block title="Colour tokens" note="Use them as Tailwind classes: bg-surface, text-muted, border-line, text-gain …">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COLORS.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-2xl border border-line">
              <div className={`h-16 ${c.cls}`} />
              <div className="p-3">
                <p className="font-mono text-xs font-semibold">{c.token}</p>
                <p className="mt-0.5 text-xs text-muted">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Typography" note="Font: Inter. Add the `tabular` class to any number that changes, so digits don't jump.">
        <Card className="divide-y divide-line">
          {TYPE.map((t) => (
            <div key={t.name} className="flex flex-wrap items-baseline justify-between gap-4 px-5 py-4">
              <span className={`${t.cls} tabular`}>{t.sample}</span>
              <span className="text-right text-xs text-muted">
                <span className="block font-semibold text-fg">{t.name}</span>
                <span className="font-mono">{t.cls}</span>
                <span className="block">{t.note}</span>
              </span>
            </div>
          ))}
        </Card>
      </Block>

      <Block title="Formatting helpers" note="src/lib/ui/format.ts: always format money and percentages through these.">
        <Card className="grid gap-x-6 gap-y-3 p-5 font-mono text-sm sm:grid-cols-2">
          {[
            ["money(1234.5)", money(1234.5)],
            ["price(0.4321)", price(0.4321)],
            ["signedMoney(-42.1)", signedMoney(-42.1)],
            ["pct(0.0345)", pct(0.0345)],
            ["compactMoney(2_400_000)", compactMoney(2_400_000)],
            ["qty(0.00012345)", qty(0.00012345)],
          ].map(([call, out]) => (
            <div key={call} className="flex justify-between gap-4">
              <span className="text-muted">{call}</span>
              <span>{out}</span>
            </div>
          ))}
        </Card>
      </Block>

      <Block title="Buttons" note={`import { Button } from "@/components/ui"`}>
        <Card className="flex flex-wrap items-center gap-3 p-5">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="gain">Buy</Button>
          <Button variant="loss">Sell</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <span className="mx-2 h-10 w-px bg-line" />
          <IconAction icon={<Plus size={20} />} label="IconAction" />
        </Card>
      </Block>

      <Block title="Small parts" note={`AssetAvatar, ChangePill, RangeTabs, Sparkline from "@/components/ui" and "@/components/price-chart"`}>
        <Card className="flex flex-wrap items-center gap-6 p-5">
          <AssetAvatar asset={aapl} />
          <AssetAvatar asset={market.getAsset("BTC")!} size={52} />
          <ChangePill value={0.0231} />
          <ChangePill value={-0.0114} />
          <ChangePill value={0} />
          <Sparkline values={market.history("NVDA", "1D", now).filter((_, i) => i % 6 === 0).map((p) => p.price)} />
          <RangeTabs value={range} onChange={setRange} />
        </Card>
      </Block>

      <Block title="Cards and lists" note={`Card, SectionTitle, EmptyState from "@/components/ui"; AssetRow from "@/components/asset-row"`}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <SectionTitle action={<span className="text-sm font-semibold text-accent">Action</span>}>SectionTitle</SectionTitle>
            <Card className="p-1.5">
              <AssetRow symbol="VWCE" now={now} />
              <AssetRow symbol="SAP" now={now} />
            </Card>
          </div>
          <div>
            <SectionTitle>EmptyState</SectionTitle>
            <Card>
              <EmptyState title="Nothing here yet" body="Explain what will appear and how to get started." action={<Button>Do the thing</Button>} />
            </Card>
          </div>
        </div>
      </Block>

      <Block title="Charts" note={`PriceChart (line, with markers) and CandleChart (OHLC, volume, indicators). Data from market.history() and market.candles().`}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <PriceChart points={line} height={200} markers={[{ value: line[0].v, label: "Marker", tone: "accent" }]} />
          </Card>
          <Card className="p-5">
            <CandleChart candles={candles} height={200} timeFormat={(t) => new Date(t).toLocaleDateString("en-IE", { day: "numeric", month: "short" })} />
          </Card>
        </div>
      </Block>

      <Block title="Overlays" note={`Sheet from "@/components/sheet" (bottom sheet on phones, dialog on desktop); toast() from "@/lib/ui/toasts"`}>
        <Card className="flex flex-wrap gap-3 p-5">
          <Button variant="secondary" onClick={() => setSheet(true)}>
            Open a Sheet
          </Button>
          <Button variant="secondary" onClick={() => toast({ title: "Something happened", body: "Toasts disappear after 6 seconds.", tone: "gain" })}>
            Show a toast
          </Button>
          <Button variant="secondary" onClick={() => toast({ title: "Order rejected", body: "Not enough cash", tone: "loss" })}>
            Error toast
          </Button>
        </Card>
        <Sheet open={sheet} onClose={() => setSheet(false)} title="A sheet">
          <p className="mb-5 text-sm text-muted">Use sheets for focused tasks: a trade, a deposit, a confirmation.</p>
          <label className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <Search size={16} className="text-muted" />
            <input data-autofocus placeholder="Inputs use surface-2" className="w-full bg-transparent outline-none placeholder:text-muted" />
          </label>
          <Button className="w-full" onClick={() => setSheet(false)}>
            Close
          </Button>
        </Sheet>
      </Block>

      <Block title="Principles" note="What makes it feel like a neobroker app">
        <Card className="grid gap-5 p-5 text-sm sm:grid-cols-2">
          {[
            ["Numbers first", "The most important number is the biggest thing on the screen. Labels are small and muted."],
            ["Green and red mean direction", "Use gain/loss only for up/down, buy/sell and errors. Never as decoration."],
            ["One action per moment", "Each screen has one obvious primary button. Everything else is secondary or ghost."],
            ["Say it plainly", "“Sells when the price drops to €90”, not “STOP SELL TRG 90.00”. Traders are people too."],
            ["Show, then confirm", "Always show the estimated total and fee before an order is placed."],
            ["Simulated, and say so", "Never let anyone mistake play money or simulated prices for real ones."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-muted">{body}</p>
            </div>
          ))}
        </Card>
      </Block>

      <Block title="Registered features" note="src/features/index.ts: add yours there to plug into Home, asset pages, navigation and the clock.">
        <Card className="divide-y divide-line">
          {FEATURES.map((f) => (
            <div key={f.id} className="flex items-center gap-4 px-5 py-4">
              <Bell size={18} className="text-accent" />
              <div className="flex-1">
                <p className="font-semibold">
                  {f.name} <span className="font-mono text-xs text-muted">{f.id}</span>
                </p>
                <p className="text-sm text-muted">{f.description}</p>
              </div>
              <p className="text-right text-xs text-muted">
                {[f.HomeWidget && "HomeWidget", f.AssetPanel && "AssetPanel", f.nav && "nav", f.Runner && "Runner"].filter(Boolean).join(" · ")}
                <span className={`block font-semibold ${f.enabled ? "text-gain" : "text-muted"}`}>{f.enabled ? "enabled" : "disabled"}</span>
              </p>
            </div>
          ))}
        </Card>
      </Block>
    </div>
  );
}

function Block({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      {note && <p className="mt-1 mb-4 text-sm text-muted">{note}</p>}
      {children}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</code>;
}
