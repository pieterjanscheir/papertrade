<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Papertrade: guide for coding agents

A paper-trading app (Next.js 16, React 19, TypeScript, Tailwind v4, zustand) used as the starting point for a hackathon. Teams are mixed (developers, designers, traders) and prototype ideas from a design-thinking workshop. Optimise for: working software fast, matching the existing look, not breaking what's there.

Humans: start with `HACKATHON.md`. It has the same map with more explanation.

## Commands

```bash
npm run dev        # http://localhost:3000
npm test           # vitest: trading engine, orders, simulator
npm run typecheck  # generates route types, then tsc
npm run lint
npm run build
```

Before saying a change is done: `npm run typecheck && npm run lint && npm test`.

## Where things go

| You're building… | Put it in |
| --- | --- |
| A new feature (most work) | `src/features/<name>/`, registered in `src/features/index.ts`. Copy `src/features/price-alerts/`. Slots: `HomeWidget`, `AssetPanel`, `nav`, `Runner` (see `src/features/types.ts`) |
| A new page | `src/app/<route>/page.tsx` (server file, renders a client component from your feature folder) |
| State that survives reloads | `createLocalStore(name, …)` from `src/lib/local-store.ts` |
| A notification | `toast({ title, body, tone, href })` from `src/lib/ui/toasts.ts` |
| A table | `DataTable` from `src/components/data-table.tsx`: scrolling, sticky first column, sort, search, filter chips and a card view, all remembered per `id` |
| A remembered UI setting | `usePref(key, default)` from `src/lib/ui/prefs.ts` (like `useState`, saved in localStorage) |
| 3D / motion | `Tilt`, `Coin3D` from `src/components/tilt.tsx`, `PlayCard` from `src/components/play-card.tsx` |
| A preset account | `PRESETS` / `createPresetAccount` in `src/lib/trading/seed.ts` |
| Trading rules (orders, fees, P/L) | `src/lib/trading/engine.ts` and `orders.ts`: pure functions, add tests next to them |
| Prices, candles, assets | Read through `market` from `src/lib/market/provider.ts`. Assets are in `src/lib/market/assets.ts` |
| Options | Pricing/contracts: `src/lib/market/options.ts`. Trading/settlement: `src/lib/trading/options-trading.ts`. Portfolio totals incl. options: `portfolioSummary` / `portfolioHistory` from `src/lib/trading/portfolio.ts` |
| Styling | Tailwind classes using tokens from `src/app/globals.css` (`bg-surface`, `text-muted`, `text-gain`…). Reuse components from `src/components/ui.tsx` and friends; see `/design` |

## Rules

- **Time:** use `marketNow()` (`src/lib/demo/store.ts`) or `useNow()` (`src/lib/ui/clock.ts`), never `Date.now()`, in app code. Demo controls can speed up, pause or jump the market clock. Server route handlers are the exception: they use real time.
- **Prices:** always via `market.priceAt / quote / history / candles`. Never import the simulator directly in UI code, so a real data provider can be swapped in.
- **Engine stays pure:** no React, storage or clock inside `engine.ts` / `orders.ts`. Pass `now` and a price function in.
- **Money formatting:** `money`, `price`, `pct`, `signedMoney`, `qty` from `src/lib/ui/format.ts`. Add the `tabular` class to changing numbers.
- **Colour meaning:** `gain`/`loss` only for up/down, buy/sell, errors.
- **Client components:** screens are client components (`"use client"`). The app renders behind a splash until localStorage has loaded, so don't fight hydration; use `createLocalStore` for persisted state.
- **Prefer slots over editing screens.** Only edit `src/components/screens/*` when a slot can't do it.
- Keep the "simulated prices / play money" disclaimers. Don't add real brokerage, payment or personal-data flows.

## Next.js 16 gotchas in this repo

- `cacheComponents` is on. `params` is a Promise; `useSearchParams()` needs a `<Suspense>` boundary in the page; `dynamicParams` and `export const dynamic` don't exist.
- Route handlers that depend on the clock call `await connection()` first (see `src/app/api/quotes/route.ts`).
- Route prop types (`PageProps<"/x/[id]">`, `RouteContext<…>`) come from `npm run typecheck`, which runs `next typegen`.
- When unsure, read `node_modules/next/dist/docs/`.
