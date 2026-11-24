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
    a.volatility * (fractal(symbol, t) - fractal(symbol, REF_TIME));
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
