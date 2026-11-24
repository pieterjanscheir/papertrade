# Hackathon guide

You've just come out of a design-thinking workshop with real traders. You have a problem worth solving and an idea of how. This repo gives you a working trading app to build that idea into, so you can spend two days on **your** idea instead of on login screens and charts.

> Everything here is play money with simulated prices. Nothing is connected to a real market or broker.

---

## 1. Get running (10 minutes)

```bash
git clone <your team's fork> papertrade
cd papertrade
npm install
npm run dev
```

Open http://localhost:3000. You start with a demo portfolio that has about 7 months of history.

Take five minutes to click around:

- **Home**: portfolio value, holdings, allocation, open orders
- **Invest**: every stock, ETF and coin
- **An asset page**: line and candle charts, and the order panel (market, limit and stop orders)
- **Activity**: transactions and orders
- **For builders** (bottom of the sidebar): **Demo controls** (`Shift + D`) and the **Design system** page

## 2. From workshop idea to code

Most ideas fit one of these. Find yours, then go to the matching recipe.

| Your idea looks like… | Example | Where it goes |
| --- | --- | --- |
| A new insight on the dashboard | "Show how risky my portfolio is today" | **Feature → `HomeWidget`** (recipe A) |
| Help while looking at one stock | "Explain why this stock moved", "Show what other traders did" | **Feature → `AssetPanel`** (recipe A) |
| A whole new flow or screen | Trade journal, onboarding, strategy builder | **Feature + new page** (recipes A + B) |
| Something that happens on its own | Alerts, auto-rebalancing, nudges | **Feature → `Runner`** (recipe A) |
| A new way to trade | Trailing stop, savings plan, "buy the dip" | **Trading engine** (recipe F) |
| A different look or feel | Calmer UI, a "pro mode", accessibility | **Design tokens and components** (recipe G) |
| Something with AI | Explain my P/L, a coach, a natural-language order | **API route + Claude** (recipe H) |

Your feature lives in **its own folder** and plugs into the app through *slots*, so several teams can work in parallel without editing the same files.

## 3. Recipes

### A. Add a feature (start here)

1. Copy the example: `cp -r src/features/price-alerts src/features/my-feature`
2. In `src/features/my-feature/index.ts`, rename it and keep only the slots you need:

   ```ts
   export const myFeature: Feature = {
     id: "my-feature",
     name: "My feature",
     description: "One line about what it does",
     enabled: true,
     HomeWidget: MyWidget,      // card on the Home dashboard
     AssetPanel: MyPanel,       // card on every asset page, gets { symbol, now }
     nav: { href: "/my-feature", label: "Mine", icon: Sparkles }, // menu entry
     Runner: MyRunner,          // invisible, re-renders on every clock tick
   };
   ```

3. Register it in `src/features/index.ts`:

   ```ts
   export const FEATURES: Feature[] = [priceAlerts, myFeature];
   ```

It now shows up in the app. Set `enabled: false` to hide it (handy for comparing before and after in your demo).

### B. Add a page

Create `src/app/my-feature/page.tsx`:

```tsx
import { MyScreen } from "@/features/my-feature/my-screen";

export default function Page() {
  return <MyScreen />;
}
```

Put the actual UI in a client component (`"use client"` at the top) inside your feature folder. Look at `src/features/price-alerts/alerts-screen.tsx`.

### C. Read the portfolio and prices

```tsx
"use client";
import { market } from "@/lib/market/provider";
import { summarize } from "@/lib/trading/engine";
import { useAccount } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";

export function MyWidget() {
  const now = useNow();                // ticks every 2 seconds (and follows demo controls)
  const account = useAccount();        // cash, positions, transactions, orders, watchlist
  const portfolio = summarize(account, market.priceAt, now);
  // portfolio.total, .invested, .cash, .pnl, .pnlPct, .holdings[] (value, pnl, weight…)

  const nvda = market.quote("NVDA", now);              // price, change, changePct
  const chart = market.history("NVDA", "1M", now);     // [{ t, price }]
  const candles = market.candles("NVDA", "1Y", now);   // [{ t, open, high, low, close, volume }]
  const asset = market.getAsset("NVDA");               // name, type, sector, volatility…
  // …
}
```

Prices are a formula of time, so you can also ask for **any past moment**: `market.priceAt("BTC", now - 7 * 86_400_000)`. That makes backtests and "what if" features easy.

### D. Remember things across reloads

```ts
import { createLocalStore } from "@/lib/local-store";

export const useJournal = createLocalStore("journal", (set) => ({
  entries: [] as { text: string; time: number }[],
  add: (text: string, time: number) => set((s) => ({ entries: [...s.entries, { text, time }] })),
}));

// in a component:
const entries = useJournal((s) => s.entries);
```

### E. Show a notification

```ts
import { toast } from "@/lib/ui/toasts";
toast({ title: "Heads up", body: "NVDA dropped 5% today", tone: "loss", href: "/asset/NVDA" });
```

### F. Change how trading works

- Market orders, fees and P/L: `src/lib/trading/engine.ts`
- Limit and stop orders, reservations, catch-up fills: `src/lib/trading/orders.ts`
- The order panel UI: `src/components/order-form.tsx`

These are pure functions with tests (`*.test.ts`). Add a test for your rule and run `npm test`.

### G. Change the look

- Colours and radius: the `@theme` block in `src/app/globals.css`. Change a token and everything follows.
- Components: `src/components/ui.tsx` (Button, Card, ChangePill…), `price-chart.tsx`, `candle-chart.tsx`, `sheet.tsx`
- See all of it live at **/design**, with the principles behind the current look.

### H. Use AI (Claude)

Put the API key on the server only, never in a client component:

```bash
npm install @anthropic-ai/sdk
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
```

`src/app/api/explain/route.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

export async function POST(request: Request) {
  const { question, context } = await request.json();

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 2000,
    output_config: { effort: "low" }, // fast answers for a chat-like feature
    // If the model declines (finance can trip safety checks), retry on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system:
      "You explain a user's simulated paper-trading portfolio in plain language. " +
      "Be educational, not advice. Keep it under 120 words.",
    messages: [{ role: "user", content: `${question}\n\nPortfolio data:\n${JSON.stringify(context)}` }],
  });

  if (response.stop_reason === "refusal") {
    return Response.json({ answer: "I can't help with that one." });
  }
  const answer = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  return Response.json({ answer });
}
```

Call it from your component with `fetch("/api/explain", { method: "POST", body: JSON.stringify({ question, context }) })`. Send the numbers the model needs (for example the output of `summarize(...)`), not the whole account. For long answers, stream the response so users see text right away.

## 4. Demo controls: rehearse your pitch

Open them with **`Shift + D`** (or "Demo controls" in the sidebar).

- **Clock speed**: pause (perfect for screenshots), real time, or 1 minute / 10 minutes / 1 hour per second.
- **Jump ahead**: +1 hour, day, week or month. Open orders fill along the way at the exact minute they trigger.
- **Scenarios**: crash, flash dip, rally, spike or volatility storm, for the whole market or one asset. Crypto and volatile stocks move more in a market-wide crash.
- **Back to live** puts everything back to normal.

A yellow banner shows whenever the app is not live, so your audience knows.

Story idea: "Here's Sam's portfolio. A crash hits." Trigger it. "Without our feature… With it…" Toggle `enabled` on your feature, or show both on two laptops.

Demo controls only change your own browser. The JSON API (`/api/quotes`) always serves the normal, undisturbed prices.

## 5. Working with AI coding tools

The repo has an `AGENTS.md` (read by Claude Code, Cursor, Codex and others; `CLAUDE.md` points to it). It tells the agent where things go and which rules matter. Prompts that work well:

- *"Read HACKATHON.md and AGENTS.md. Then build a feature in src/features/trade-journal that lets me write a note when I place an order, and shows my notes on the asset page."*
- *"Using the components on /design, add a HomeWidget that shows my portfolio's riskiest position."*
- *"Add a trailing stop order type to src/lib/trading/orders.ts with tests, then add it to the order form."*

Ask it to run `npm run typecheck && npm run lint && npm test` at the end.

## 6. Good to know

- **Your data** lives in your browser's localStorage. Account → "Start over" resets it. A different browser means a different account.
- **Prices are a formula of time.** So anyone could compute future prices from the code. If there's a trading competition, don't peek ;-)
- **Deploying:** it's a normal Next.js app. `npx vercel` or any Node host works. Add `ANTHROPIC_API_KEY` as an environment variable there if you use recipe H.
- **Stuck?** `npm run typecheck` usually tells you exactly what's wrong. Otherwise ask a mentor.

## 7. Checklist before you present

- [ ] Can you explain the trader's problem in one sentence, using a quote from the workshop?
- [ ] Does the demo show that problem first, then your solution?
- [ ] Is your demo scripted with demo controls, and rehearsed from "Back to live"?
- [ ] Did you test it with at least one trader during the hackathon?
- [ ] `npm run build` passes, if you're deploying
