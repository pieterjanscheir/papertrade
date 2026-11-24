/**
 * The single seam between the UI and market data.
 *
 * Every screen reads prices through `market`, never from the simulator directly.
 * To use real data, write another object that satisfies `MarketData` (for example
 * one that polls a quotes API into an in-memory cache) and export it here instead.
 * See README → "Plugging in real market data".
 */

import { ASSETS, getAsset, type Asset } from "./assets";
import {
  candlesFor,
  historyFor,
  priceAt,
  quoteAt,
  statsFor,
  type AssetStats,
  type Candle,
  type PricePoint,
  type Quote,
  type Range,
} from "./simulator";

export interface MarketData {
  /** Short label shown in the UI so nobody mistakes this for live data. */
  readonly sourceLabel: string;
  listAssets(): Asset[];
  getAsset(symbol: string): Asset | undefined;
  priceAt(symbol: string, t: number): number;
  quote(symbol: string, t: number): Quote;
  history(symbol: string, range: Range, now: number): PricePoint[];
  /** OHLC candles; `extra` = additional candles before the range (for indicators). */
  candles(symbol: string, range: Range, now: number, extra?: number): Candle[];
  stats(symbol: string, now: number): AssetStats;
}

export const simulatedMarket: MarketData = {
  sourceLabel: "Simulated prices",
  listAssets: () => ASSETS,
  getAsset,
  priceAt,
  quote: quoteAt,
  history: historyFor,
  candles: candlesFor,
  stats: statsFor,
};

export const market: MarketData = simulatedMarket;
