# papertrade

A good-looking paper-trading app you can fork for a hackathon. Buy and sell stocks, ETFs and crypto with play money, at **simulated** prices that tick live.

> Play money only. Prices come from a simulator, not a market feed. Nothing here is investment advice.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The first visit creates a **demo portfolio** with about 7 months of history, so every chart has something on it. You can reset to an empty €10,000 account from the Account tab.

```bash
npm test          # engine + simulator tests (vitest)
npm run typecheck # route types + tsc
npm run lint
npm run build
```

## What's in the box

| Screen | What it does |
| --- | --- |
| **Home** | Total value, scrubbable portfolio chart (1D–5Y), holdings table with return and weight, allocation donut (by asset / type / sector), open orders, watchlist, biggest movers |
| **Invest** | Market overview cards, search, filters (watchlist, stocks, ETFs, crypto), sorting (A–Z, gainers, losers, best 1Y), a full table with 7-day sparklines on wide screens |
| **Asset** | Live price, chart with lines for your average cost and open orders, position, stats, about, order history, trades |
| **Order panel** | **Market, limit and stop orders**, buy or sell by EUR amount or units, fractional shares, expiry (1 day, 1 week, 1 month, until cancelled), €1 flat fee, live estimate. Docked next to the chart on desktop, a bottom sheet on mobile |
| **Activity** | Transactions grouped by day, plus an Orders tab (open, filled, cancelled, expired, rejected) |
| **Account** | Add or withdraw play money, reset to the demo or an empty account |

Notifications pop up when an order fills, is rejected or expires. The layout is responsive: a bottom tab bar on phones; a sidebar, two-column dashboards and tables on desktop. The UI also scales up slightly on very large screens.

### Order types

| Type | Buy | Sell |
| --- | --- | --- |
| **Market** | now, at the current price | now, at the current price |
| **Limit @ X** | when the price drops to X or lower | when the price rises to X or higher (take profit) |
| **Stop @ X** | when the price rises to X or higher (breakout) | when the price drops to X or lower (stop-loss) |

Once a limit or stop order triggers, it fills at the market price at that moment, as a real broker would. A stop-loss can therefore fill a little below its stop price. Open buy orders reserve cash, and open sell orders reserve units, so you can't spend the same money twice.

Orders also fill **while the app is closed**. When you come back, the app replays the prices since your last visit and fills each order at the minute it triggered (see `src/lib/trading/orders.ts`).

## How it works

```
src/
├─ lib/
│  ├─ market/
│  │  ├─ assets.ts      ← the tradable universe (34 instruments)
│  │  ├─ simulator.ts   ← deterministic price engine: price = f(symbol, time)
│  │  └─ provider.ts    ← `market`: the ONLY thing the UI reads prices from
│  ├─ trading/
│  │  ├─ engine.ts      ← pure functions: market orders, fees, positions, P/L, valuation
│  │  ├─ orders.ts      ← limit/stop orders: reserve, trigger, fill, expire, catch up
│  │  ├─ seed.ts        ← demo and fresh starting accounts
│  │  ├─ store.ts       ← zustand store persisted to localStorage
│  │  └─ *.test.ts
│  └─ ui/               ← formatting, shared clock (ticks every 2s)
├─ components/          ← chart, sheets, rows, screens
└─ app/                 ← routes + JSON API
```

**Prices are a pure function of time.** `priceAt("AAPL", t)` layers smooth noise at many time scales (from yearly trends down to 15-second wiggles) on top of each asset's drift and volatility. That means:

- everyone at the hackathon sees the same price at the same moment, with no backend;
- you can get the price at any past moment, which is how the portfolio chart works: the app replays your transaction log against historical prices;
- backtesting a strategy is a simple loop.

### "How do prices continue into the future?"

Nothing is stored or downloaded. The price is a formula of the clock: `priceAt(symbol, time)`. Each time the app ticks (every 2 seconds) it asks for the price at the new current time, and the formula gives the next value. It's like a song that is already "written" for every second, past and future; the app just plays it at the current moment. That's why:

- tomorrow the chart will show today as history, with exactly the same values everyone saw today;
- an order you left open overnight can fill at the exact minute it was triggered.

**Hackathon caveat:** because the formula is in the code, someone could compute *future* prices (`priceAt("BTC", Date.now() + 86_400_000)`) and "win" a trading competition. If you run a leaderboard, either set the rule "no peeking", or have a team (or yourself) move price generation to the server with a secret seed and only send prices up to now. That's a good challenge too.

**The trading engine is pure.** `engine.ts` has no React, storage or clock in it, so it's easy to test and easy to move to a server.

### JSON API

The simulator is also served over HTTP, for bots, notebooks or a second client:

```
GET /api/quotes                    → every asset with a live quote
GET /api/quotes?symbols=AAPL,BTC
GET /api/history/NVDA?range=1M     → range: 1D | 1W | 1M | 1Y | 5Y
```

## Plugging in real market data

Can you? Yes, but read the provider's terms first. Most free tiers (Finnhub, Alpha Vantage, Twelve Data, Polygon, and so on) need an API key, have tight rate limits, and often don't allow you to redistribute or display the data publicly. That's why this starter uses simulated prices by default.

To switch, implement the `MarketData` interface in `src/lib/market/provider.ts` and export it as `market`. Because the UI reads prices synchronously, a real provider should:

1. poll quotes on the server (a route handler, with the API key kept in `.env.local`) every few seconds;
2. keep the latest quotes and history in an in-memory cache on the client;
3. answer `priceAt` / `quote` / `history` from that cache.

A hybrid also works well: real prices for the current quote, and the simulator for anything the provider doesn't cover.

## Hackathon challenge ideas

**Trading features**
- Stop-limit and trailing-stop orders (build on `orders.ts`)
- Make a fair leaderboard: generate prices on the server with a secret seed so nobody can peek ahead
- Savings plans: recurring buys (for example €50 of VWCE every month), backfilled with the historical simulator
- Market hours per exchange (only crypto trades 24/7)
- Multi-currency: USD assets with an FX rate and an FX fee
- Short selling or margin, with liquidation

**Insight and UX**
- Portfolio breakdown donut by sector, type or region
- Price alerts and push notifications
- Generated "news" events that move prices (the simulator is a good place to hook in)
- Leaderboard: who made the best return since the hackathon started?
- Onboarding flow, light mode, animations, haptics, a PWA install

**Backend and AI**
- Accounts and auth, moving `engine.ts` behind API routes with a real database
- A trading bot that uses `/api/quotes`; let teams' bots compete
- An AI assistant that explains your portfolio, or suggests rebalancing (as education, not advice)
- Backtesting UI: "what if I had bought X a year ago?"

## Disclaimer

Company names and tickers are used only so the app feels familiar. All prices, charts and statistics are simulated and do not reflect real markets. No logos or brand assets are included.
