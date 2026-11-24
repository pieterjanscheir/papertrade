/**
 * Deterministic market simulator.
 *
 * The price of every asset is a pure function of (symbol, timestamp). That means:
 *  - everyone at the hackathon sees the same prices at the same moment,
 *  - you can ask for the price at ANY point in the past (charts, portfolio history,
 *    backtests) without storing anything,
 *  - prices keep "ticking" live just because time moves on.
 *
 * How: log(price) = log(refPrice) + drift * years + volatility * F(t), where F is
 * layered smooth noise (big slow waves for long-term trends, tiny fast wiggles for
 * live ticks). No real market data is used anywhere.
 */

import { ASSETS_BY_SYMBOL, type Asset } from "./assets";

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const YEAR = 365 * DAY;

/** Reference moment where every asset trades exactly at its `refPrice`. */
export const REF_TIME = Date.UTC(2026, 0, 1);

/** Noise octaves: [period in ms, relative amplitude]. */
const OCTAVES: ReadonlyArray<readonly [number, number]> = [
  [365 * DAY, 0.6],
  [90 * DAY, 0.35],
  [21 * DAY, 0.2],
  [5 * DAY, 0.1],
  [1 * DAY, 0.05],
  [4 * HOUR, 0.025],
  [1 * HOUR, 0.012],
  [15 * MINUTE, 0.006],
  [2 * MINUTE, 0.003],
  [15_000, 0.0015],
];

// ---------------------------------------------------------------------------
// Noise primitives
// ---------------------------------------------------------------------------

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Hash two integers into a float in [-1, 1]. */
function lattice(seed: number, i: number): number {
  let h = seed ^ Math.imul(i | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return ((h >>> 0) / 0xffffffff) * 2 - 1;
}

/** Smooth 1D value noise in roughly [-1, 1]. */
function valueNoise(seed: number, x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f); // smoothstep
  return lattice(seed, i) * (1 - u) + lattice(seed, i + 1) * u;
}

const seedCache = new Map<string, number[]>();
function seedsFor(symbol: string): number[] {
  let seeds = seedCache.get(symbol);
  if (!seeds) {
    const base = hashString(symbol);
    seeds = OCTAVES.map((_, k) => (base + Math.imul(k + 1, 0x27d4eb2d)) >>> 0);
    seedCache.set(symbol, seeds);
  }
  return seeds;
}

function fractal(symbol: string, t: number): number {
  const seeds = seedsFor(symbol);
  let sum = 0;
  for (let k = 0; k < OCTAVES.length; k++) {
    const [period, amp] = OCTAVES[k];
    // Offset each octave so lattice points don't line up across octaves.
    sum += amp * valueNoise(seeds[k], t / period + k * 0.37);
  }
  return sum;
}

// ---------------------------------------------------------------------------
// Scenario events (demo controls)
// ---------------------------------------------------------------------------

/**
 * A scripted market move layered on top of the normal simulation, e.g. "the whole
 * market drops 15% over 10 minutes". Used by the demo controls so a team can show
 * their feature reacting to a crash on stage. Events live on the client only
 * (see lib/demo/store.ts); the JSON API never sees them.
 */
export interface MarketEvent {
  id: string;
  label: string;
  /**
   * Who is affected:
   *  - "*"                 the whole market
   *  - "type:crypto"       an asset type (stock | etf | crypto)
   *  - "sector:Financials" a sector
   *  - "NVDA"              a single asset
   * Group moves are scaled by each asset's volatility (a crude "beta").
   */
  target: string;
  start: number;
  /** How long the move takes to play out, in ms. */
  duration: number;
  /** Size of the move, e.g. -0.15 for a 15% drop. Ignored when `kind` is "volatility". */
  move: number;
  kind: "move" | "volatility";
  /** Optional headline for the news feed. */
  headline?: string;
}

export function matchesTarget(target: string, a: Asset): boolean {
  if (target === "*") return true;
  if (target.startsWith("type:")) return a.type === target.slice(5);
  if (target.startsWith("sector:")) return a.sector === target.slice(7);
  return a.symbol === target;
}

/** Human label for a target, e.g. "Crypto", "Financials", "NVIDIA". */
export function targetLabel(target: string): string {
  if (target === "*") return "Whole market";
  if (target.startsWith("type:")) return { stock: "All stocks", etf: "All ETFs", crypto: "All crypto" }[target.slice(5)] ?? target;
  if (target.startsWith("sector:")) return target.slice(7);
  return ASSETS_BY_SYMBOL[target]?.name ?? target;
}

export function eventsNow(): readonly MarketEvent[] {
  return events;
}

let events: MarketEvent[] = [];

/** Replace the active scenario events. */
export function setMarketEvents(next: MarketEvent[]) {
  events = next;
}

/** Whole-market moves hit volatile assets harder (a crude "beta"). */
function beta(a: Asset) {
  return Math.min(2.2, Math.max(0.5, a.volatility / 0.25));
}

function eventShift(a: Asset, t: number): number {
  let shift = 0;
  for (const e of events) {
    if (t <= e.start || !matchesTarget(e.target, a)) continue;
    const single = e.target === a.symbol;
    const x = Math.min(1, (t - e.start) / e.duration);
    const eased = x * x * (3 - 2 * x);
    if (e.kind === "move") {
      shift += Math.log(1 + e.move) * eased * (single ? 1 : beta(a));
    } else if (x < 1) {
      // Volatility burst: extra fast noise that fades in and out over the window.
      const envelope = Math.sin(Math.PI * x);
      shift += 4 * a.volatility * envelope * fastNoise(a.symbol + e.id, t);
    }
  }
  return shift;
}

/** Only the short-period octaves: the "wiggle" without the trend. */
function fastNoise(key: string, t: number): number {
  const seeds = seedsFor(key);
  let sum = 0;
  for (let k = 5; k < OCTAVES.length; k++) {
    const [period, amp] = OCTAVES[k];
    sum += amp * valueNoise(seeds[k], t / period);
  }
  return sum;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function requireAsset(symbol: string): Asset {
  const asset = ASSETS_BY_SYMBOL[symbol];
  if (!asset) throw new Error(`Unknown symbol: ${symbol}`);
  return asset;
}

/** Simulated price of `symbol` at timestamp `t` (ms since epoch), in EUR. */
export function priceAt(symbol: string, t: number): number {
  const a = requireAsset(symbol);
  const years = (t - REF_TIME) / YEAR;
  const logP =
    Math.log(a.refPrice) +
    a.drift * years +
    a.volatility * (fractal(symbol, t) - fractal(symbol, REF_TIME)) +
    (events.length ? eventShift(a, t) : 0);
  return roundPrice(Math.exp(logP));
}

/** Round to a sensible tick size: cents above €1, finer below. */
export function roundPrice(p: number): number {
  const decimals = p >= 1 ? 2 : 4;
  const f = 10 ** decimals;
  return Math.round(p * f) / f;
}

export interface Quote {
  symbol: string;
  price: number;
  /** Price 24h ago — the simulator trades 24/7, so "today" means "last 24h". */
  previousClose: number;
  change: number;
  changePct: number;
  time: number;
}

export function quoteAt(symbol: string, t: number): Quote {
  const price = priceAt(symbol, t);
  const previousClose = priceAt(symbol, t - DAY);
  const change = price - previousClose;
  return {
    symbol,
    price,
    previousClose,
    change,
    changePct: previousClose ? change / previousClose : 0,
    time: t,
  };
}

export type Range = "1D" | "1W" | "1M" | "1Y" | "5Y";
export const RANGES: Range[] = ["1D", "1W", "1M", "1Y", "5Y"];

export const RANGE_CONFIG: Record<Range, { span: number; step: number }> = {
  "1D": { span: DAY, step: 5 * MINUTE },
  "1W": { span: 7 * DAY, step: 30 * MINUTE },
  "1M": { span: 30 * DAY, step: 4 * HOUR },
  "1Y": { span: YEAR, step: DAY },
  "5Y": { span: 5 * YEAR, step: 7 * DAY },
};

export interface PricePoint {
  t: number;
  price: number;
}

/** Evenly spaced samples ending exactly at `now` (so the last point is the live price). */
export function sampleTimes(range: Range, now: number): number[] {
  const { span, step } = RANGE_CONFIG[range];
  const n = Math.round(span / step);
  const times: number[] = [];
  for (let i = n; i > 0; i--) times.push(now - i * step);
  times.push(now);
  return times;
}

export function historyFor(symbol: string, range: Range, now: number): PricePoint[] {
  return sampleTimes(range, now).map((t) => ({ t, price: priceAt(symbol, t) }));
}

export interface AssetStats {
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  yearChangePct: number;
}

export function statsFor(symbol: string, now: number): AssetStats {
  const day = historyFor(symbol, "1D", now).map((p) => p.price);
  const year = historyFor(symbol, "1Y", now).map((p) => p.price);
  return {
    dayHigh: Math.max(...day),
    dayLow: Math.min(...day),
    yearHigh: Math.max(...year),
    yearLow: Math.min(...year),
    yearChangePct: (year[year.length - 1] - year[0]) / year[0],
  };
}

// ---------------------------------------------------------------------------
// Candles (OHLC + volume)
// ---------------------------------------------------------------------------

export interface Candle {
  /** Start of the candle. */
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  /** Simulated traded units in this candle. */
  volume: number;
}

/** Candle size per range, chosen to give ~90–180 candles. */
export const CANDLE_CONFIG: Record<Range, { span: number; step: number; label: string }> = {
  "1D": { span: DAY, step: 15 * MINUTE, label: "15m" },
  "1W": { span: 7 * DAY, step: 2 * HOUR, label: "2h" },
  "1M": { span: 30 * DAY, step: 8 * HOUR, label: "8h" },
  "1Y": { span: YEAR, step: 2 * DAY, label: "2D" },
  "5Y": { span: 5 * YEAR, step: 14 * DAY, label: "2W" },
};

const SUBSAMPLES = 8;

/**
 * OHLC candles ending at `now`. `extra` adds that many candles before the range,
 * which moving averages need to be defined from the first visible candle.
 */
export function candlesFor(symbol: string, range: Range, now: number, extra = 0): Candle[] {
  const a = requireAsset(symbol);
  const { span, step } = CANDLE_CONFIG[range];
  const n = Math.round(span / step) + extra;
  // Typical move per candle, used to make volume rise on big moves.
  const typical = a.volatility * Math.sqrt(step / YEAR);
  // Roughly €40M traded per day, varying by asset.
  const baseUnits = ((40_000_000 / a.refPrice) * (0.4 + (hashString(symbol + "vol") % 1000) / 600) * step) / DAY;
  const volSeed = hashString(symbol + "volume");

  const candles: Candle[] = [];
  for (let i = n; i > 0; i--) {
    const start = now - i * step;
    const open = priceAt(symbol, start);
    let high = open;
    let low = open;
    let close = open;
    for (let k = 1; k <= SUBSAMPLES; k++) {
      close = priceAt(symbol, start + (step * k) / SUBSAMPLES);
      if (close > high) high = close;
      if (close < low) low = close;
    }
    const move = Math.abs(close / open - 1) + (high - low) / open / 2;
    const noise = 0.6 + 0.4 * (lattice(volSeed, Math.floor(start / step)) + 1);
    candles.push({ t: start, open, high, low, close, volume: Math.round(baseUnits * noise * (0.5 + move / typical)) });
  }
  return candles;
}

/** Simple moving average of closes; null until `window` values are available. */
export function sma(candles: Candle[], window: number): (number | null)[] {
  let sum = 0;
  return candles.map((c, i) => {
    sum += c.close;
    if (i >= window) sum -= candles[i - window].close;
    return i >= window - 1 ? sum / window : null;
  });
}
