/**
 * Simulated listed options: European-style, cash-settled at expiry.
 *
 * Prices come from Black-Scholes on the simulated underlying, using each asset's
 * volatility with a gentle "smile" (out-of-the-money strikes are a bit pricier).
 * Contracts are identified by a string id: "NVDA|20261127|C|210".
 */

import { getAsset, type Asset } from "./assets";
import { DAY, YEAR, priceAt } from "./simulator";

export type OptionType = "call" | "put";

export interface OptionContract {
  id: string;
  symbol: string;
  type: OptionType;
  strike: number;
  /** Expiry moment (ms). Options expire on Fridays at 16:00 UTC. */
  expiry: number;
}

export interface OptionQuote {
  contract: OptionContract;
  underlying: number;
  bid: number;
  ask: number;
  mid: number;
  /** Value if exercised right now. */
  intrinsic: number;
  /** Implied volatility used for pricing (annualised). */
  iv: number;
  delta: number;
  /** Change in option price per day from time passing, per share. */
  theta: number;
  expired: boolean;
}

export const RISK_FREE_RATE = 0.02;

/** Shares per contract: 100 for stocks and ETFs, 1 for crypto. */
export function multiplier(asset: Asset | string): number {
  const a = typeof asset === "string" ? getAsset(asset) : asset;
  return a?.type === "crypto" ? 1 : 100;
}

// ---------------------------------------------------------------------------
// Contract ids
// ---------------------------------------------------------------------------

function ymd(t: number) {
  const d = new Date(t);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function contractId(symbol: string, type: OptionType, strike: number, expiry: number): string {
  return `${symbol}|${ymd(expiry)}|${type === "call" ? "C" : "P"}|${strike}`;
}

export function parseContract(id: string): OptionContract {
  const [symbol, date, t, strike] = id.split("|");
  const expiry = Date.UTC(Number(date.slice(0, 4)), Number(date.slice(4, 6)) - 1, Number(date.slice(6, 8)), 16);
  return { id, symbol, type: t === "C" ? "call" : "put", strike: Number(strike), expiry };
}

export function contractLabel(c: OptionContract): string {
  const date = new Date(c.expiry).toLocaleDateString("en-IE", { day: "numeric", month: "short" });
  return `${c.symbol} ${formatStrike(c.strike)} ${c.type === "call" ? "Call" : "Put"} · ${date}`;
}

export function formatStrike(k: number) {
  return k >= 1 ? k.toLocaleString("en-IE", { maximumFractionDigits: 2 }) : k.toString();
}

// ---------------------------------------------------------------------------
// Expiries and strikes
// ---------------------------------------------------------------------------

/** Friday 16:00 UTC on or after `t`'s day. */
function nextFriday(t: number): number {
  const d = new Date(t);
  const base = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 16);
  const add = (5 - new Date(base).getUTCDay() + 7) % 7;
  let friday = base + add * DAY;
  if (friday <= t) friday += 7 * DAY;
  return friday;
}

/** Third Friday of the month containing `t`. */
function thirdFriday(year: number, month: number): number {
  const first = Date.UTC(year, month, 1, 16);
  const add = (5 - new Date(first).getUTCDay() + 7) % 7;
  return first + (add + 14) * DAY;
}

/** Listed expiries at time `now`: the next 4 weekly Fridays plus the next 3 monthly ones after that. */
export function expiriesAt(now: number): number[] {
  const weeks: number[] = [];
  let f = nextFriday(now);
  for (let i = 0; i < 4; i++, f += 7 * DAY) weeks.push(f);
  const months: number[] = [];
  const d = new Date(now);
  for (let m = 0; months.length < 3 && m < 12; m++) {
    const tf = thirdFriday(d.getUTCFullYear(), d.getUTCMonth() + m);
    if (tf > weeks[weeks.length - 1]) months.push(tf);
  }
  return [...weeks, ...months];
}

function strikeStep(price: number): number {
  const steps = [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
  const target = price * 0.025;
  return steps.find((s) => s >= target) ?? 5000;
}

/** Strikes around the current price: `count` on each side of the at-the-money strike. */
export function strikesFor(price: number, count = 6): number[] {
  const step = strikeStep(price);
  const atm = Math.round(price / step) * step;
  const out: number[] = [];
  for (let i = -count; i <= count; i++) {
    const k = Math.round((atm + i * step) * 100) / 100;
    if (k > 0) out.push(k);
  }
  return out;
}

export function chainAt(symbol: string, expiry: number, now: number): { strike: number; call: OptionQuote; put: OptionQuote }[] {
  const s = priceAt(symbol, now);
  return strikesFor(s).map((strike) => ({
    strike,
    call: quoteOption(parseContract(contractId(symbol, "call", strike, expiry)), now),
    put: quoteOption(parseContract(contractId(symbol, "put", strike, expiry)), now),
  }));
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/** Standard normal CDF (Abramowitz–Stegun approximation, error < 1e-7). */
export function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

function normPdf(x: number) {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

export function blackScholes(type: OptionType, s: number, k: number, years: number, sigma: number, r = RISK_FREE_RATE) {
  if (years <= 0 || sigma <= 0) {
    const intrinsic = Math.max(0, type === "call" ? s - k : k - s);
    return { price: intrinsic, delta: intrinsic > 0 ? (type === "call" ? 1 : -1) : 0, theta: 0 };
  }
  const sq = sigma * Math.sqrt(years);
  const d1 = (Math.log(s / k) + (r + (sigma * sigma) / 2) * years) / sq;
  const d2 = d1 - sq;
  const disc = Math.exp(-r * years);
  const price = type === "call" ? s * normCdf(d1) - k * disc * normCdf(d2) : k * disc * normCdf(-d2) - s * normCdf(-d1);
  const delta = type === "call" ? normCdf(d1) : normCdf(d1) - 1;
  const thetaYear =
    (-s * normPdf(d1) * sigma) / (2 * Math.sqrt(years)) + (type === "call" ? -r * k * disc * normCdf(d2) : r * k * disc * normCdf(-d2));
  return { price: Math.max(price, 0), delta, theta: thetaYear / 365 };
}

/** Volatility smile: strikes further from the money get a slightly higher IV; puts a touch more. */
export function impliedVol(asset: Asset, type: OptionType, strike: number, spot: number): number {
  const m = Math.log(strike / spot);
  return asset.volatility * (1 + 1.2 * m * m - (type === "put" ? 0.15 : 0.05) * m);
}

const round2 = (x: number) => Math.round(x * 100) / 100;

export function quoteOption(contract: OptionContract, now: number): OptionQuote {
  const asset = getAsset(contract.symbol);
  if (!asset) throw new Error(`Unknown symbol ${contract.symbol}`);
  // Once expired, the option is worth its intrinsic value at the expiry moment.
  const t = Math.min(now, contract.expiry);
  const s = priceAt(contract.symbol, t);
  const years = Math.max(0, (contract.expiry - t) / YEAR);
  const iv = impliedVol(asset, contract.type, contract.strike, s);
  const bs = blackScholes(contract.type, s, contract.strike, years, iv);
  const intrinsic = Math.max(0, contract.type === "call" ? s - contract.strike : contract.strike - s);
  const mid = Math.max(bs.price, intrinsic);
  const half = Math.max(0.01, mid * 0.015);
  const expired = now >= contract.expiry;
  return {
    contract,
    underlying: s,
    mid: round2(mid),
    bid: expired ? round2(intrinsic) : Math.max(0, round2(mid - half)),
    ask: expired ? round2(intrinsic) : round2(mid + half),
    intrinsic,
    iv,
    delta: bs.delta,
    theta: bs.theta,
    expired,
  };
}

/** Mark-to-market value of one share's worth of the option at time `t` (mid price). */
export function optionMark(id: string, t: number): number {
  return quoteOption(parseContract(id), t).mid;
}

/** Profit/loss per contract at expiry for an underlying price `s`, given the premium paid per share. */
export function payoffAtExpiry(c: Pick<OptionContract, "type" | "strike">, s: number, premium: number, mult: number) {
  const intrinsic = Math.max(0, c.type === "call" ? s - c.strike : c.strike - s);
  return (intrinsic - premium) * mult;
}
