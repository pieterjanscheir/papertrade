/**
 * Fake, satirical news, generated from the simulated prices.
 *
 * Headlines are deterministic (everyone sees the same stories at the same time) and
 * follow what the charts actually did: if a story says NVIDIA soared, it did, in the
 * simulator. Demo-control scenarios become BREAKING stories.
 *
 * Everything here is made up and meant to be silly. Keep jokes about situations,
 * never about real people, and never accuse a real company of wrongdoing.
 */

import { ASSETS, type Asset } from "@/lib/market/assets";
import { market } from "@/lib/market/provider";
import { HOUR, YEAR, matchesTarget, targetLabel, type MarketEvent } from "@/lib/market/simulator";
import { ASSET_QUIPS, SECTOR_QUIPS } from "./flavor";

export type Sentiment = "up" | "down" | "flat" | "fun" | "esg" | "breaking";

export interface NewsItem {
  id: string;
  t: number;
  headline: string;
  source: string;
  symbols: string[];
  sentiment: Sentiment;
  /** Price move the story is about, if any. */
  move?: number;
}

const SOURCES = [
  "The Candlestick Courier",
  "Bulls & Bears Bulletin",
  "Ticker Tape Tattler",
  "The Daily Dip",
  "Moneyfold Weekly",
  "The Paper Trader",
  "Green Candle Gazette",
  "The Spreadsheet Sentinel",
];

// {name} {symbol} {pct} {sector}
const BIG_UP = [
  "{name} soars {pct} as traders discover the “buy” button still works",
  "{name} jumps {pct}; analysts who said “sell” are now “reviewing their models”",
  "{name} rockets {pct}. Nobody knows why, everybody has a theory",
  "{name} up {pct} after investor call ends 12 minutes early, shareholders delighted",
  "{symbol} climbs {pct}; office coffee machine reportedly fixed the same morning",
  "{name} surges {pct}, briefly becoming the main topic at every family dinner",
];
const UP = [
  "{name} edges up {pct} in a session best described as “fine”",
  "{name} gains {pct}; intern's spreadsheet colour-coded green for once",
  "{name} rises {pct} as traders agree it's “a nice little number”",
  "{symbol} up {pct}. Long-term holders pretend they weren't checking",
  "{name} ticks up {pct} on what one analyst called “good vibes, mostly”",
];
const FLAT = [
  "{name} barely moves; trader checks if the screen is frozen",
  "{name} flat for hours, chart now officially a horizontal line enthusiast",
  "Nothing happens to {name}, analysts write 900 words about it anyway",
  "{symbol} unchanged. “Stability is underrated,” says nobody on a trading desk",
];
const DOWN = [
  "{name} slips {pct} as markets collectively sigh",
  "{name} dips {pct}; long-term holders reportedly “not even looking”",
  "{symbol} down {pct}. Somewhere, a “buy the dip” chat wakes up",
  "{name} eases {pct} after a quiet session of mild disappointment",
  "{name} drifts {pct} lower; analysts blame “it being a Tuesday-ish kind of day”",
];
const BIG_DOWN = [
  "{name} drops {pct}; retail investors rename it “a long-term investment”",
  "{name} tumbles {pct}. “Buy the dip” group chat hits 400 unread messages",
  "{name} sinks {pct} after an analyst sneezes during a live TV segment",
  "{symbol} falls {pct}; portfolio apps quietly deleted from home screens",
  "{name} slides {pct} as traders rediscover the meaning of “volatility”",
];
const CRYPTO = [
  "{name} moves {pct} because it is a day ending in “y”",
  "{name} {dir} {pct}; laser-eyed profile pictures {laser}",
  "{name} {dir} {pct} while its fans explain it's “still early”",
  "{name} {dir} {pct}. Someone's uncle has a very strong opinion about it",
];
const ETF = [
  "{name} {dir} {pct}; index investors continue to not care, as designed",
  "{name} {dir} {pct}. Passive investors remain heroically passive",
  "{name} {dir} {pct}; its holders were reportedly busy living their lives",
];
// ESG, but make it funny. Gentle, about office life, never accusing anyone of greenwashing.
const ESG = [
  "{name} lifts its ESG score by switching the office lights off on Fridays, as suggested by Gerald from facilities",
  "{name} publishes a 400-page sustainability report, praised mostly for the recycled paper",
  "Rating agency trims {name}'s Governance score after a board meeting overruns by three minutes",
  "{name} plants one tree per employee; the trees are reportedly “doing great, thanks for asking”",
  "{name} wins the “Most Sustainable Font” award for its annual report",
  "{name}'s new Social pledge: replying to emails within the same quarter",
  "{name} cuts emissions by banning reply-all, saving an estimated 4 tonnes of passive-aggression",
  "{name} achieves a carbon-neutral coffee break; tea drinkers demand equal treatment",
  "ESG analysts praise {name} for finally fixing the dripping tap in the third-floor kitchen",
  "{name} swaps plastic office plants for real ones; three survive the first week",
  "{name} boosts its “S” score with a second birthday cake per month",
  "{name} adds a QR code to its sustainability policy; nobody scans it, but the score goes up",
];
const ESG_CRYPTO = [
  "{name} pledges to go green by mining only on sunny days",
  "{name} community proposes its own ESG framework: Everyone Stays Gleeful",
  "{name} offsets its footprint by holders promising to “touch grass” once a week",
];
const ESG_ETF = [
  "{name} discovers it holds “a bit of everything”; ESG score lands at “a bit of everything”",
  "{name} ESG review finds the fund is 2% kale, analysts unsure how",
];
const ESG_ANTH = [
  "Anthropic's ESG rating goes up as well, because of course it does",
  "Anthropic publishes ESG report; it is helpful, harmless and honestly quite long",
];

const MARKET_QUIPS = [
  "Markets close mixed, which experts confirm is “one of the outcomes”",
  "Survey: 9 in 10 traders would rather check prices than eat lunch",
  "Local investor refreshes portfolio 47 times before 9am; portfolio unchanged",
  "Economists predict “some movement” in markets this week",
  "Chart that went up, then down, officially classified as “a mountain”",
  "Hedge fund unveils bold new strategy: buying low and selling high",
  "Office printer jams during earnings season, considered a leading indicator",
  "Analysts agree the market will either go up, down, or sideways",
  "Study finds candlestick charts 40% more dramatic when viewed after midnight",
  "Trader replaces morning coffee with checking red and green numbers, reports “same effect”",
  "Area man explains compound interest at party, party continues without him",
  "Central bankers hold surprise meeting; agenda turns out to be the coffee rota",
  "Trader asks AI for a stock tip; AI asks trader about their risk tolerance, trader logs off",
  "Day traders announce four-day week; the market does not notice",
  "“Past performance is no guarantee of future results”, says man about his football team",
  "Investor diversifies portfolio by buying the same ETF in a different app",
  "European markets open; Belgian, Dutch and German traders debate the best lunch for 40 minutes",
  "New study: traders who say “to the moon” have mostly never left their desk",
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const pick = <T,>(list: T[], key: string) => list[hash(key) % list.length];

function fill(template: string, a: Asset | null, move: number) {
  const up = move >= 0;
  return template
    .replaceAll("{name}", a?.name ?? "")
    .replaceAll("{symbol}", a?.symbol ?? "")
    .replaceAll("{sector}", a?.sector ?? "")
    .replaceAll("{pct}", `${Math.abs(move * 100).toFixed(1)}%`)
    .replaceAll("{dir}", up ? "rises" : "falls")
    .replaceAll("{laser}", up ? "make a comeback" : "quietly swapped for cats")
    .replaceAll("{color}", up ? "green" : "red");
}

// ---------------------------------------------------------------------------
// Per-asset stories: roughly one every few hours, about the last 6 hours' move.
// ---------------------------------------------------------------------------

const ASSET_SLOT = 5 * HOUR;
const MOVE_WINDOW = 6 * HOUR;

function assetStories(a: Asset, from: number, to: number): NewsItem[] {
  const offset = hash(a.symbol) % ASSET_SLOT;
  const items: NewsItem[] = [];
  const first = Math.ceil((from - offset) / ASSET_SLOT);
  const last = Math.floor((to - offset) / ASSET_SLOT);
  for (let k = last; k >= first; k--) {
    const key = `${a.symbol}:${k}`;
    if (hash(key) % 3 === 0) continue; // not every slot has a story
    const t = k * ASSET_SLOT + offset;
    const move = market.priceAt(a.symbol, t) / market.priceAt(a.symbol, t - MOVE_WINDOW) - 1;
    const typical = a.volatility * Math.sqrt(MOVE_WINDOW / YEAR);
    const z = move / typical;

    // Which kind of story? Mostly jokes written for this exact instrument.
    const roll = hash(key + "kind") % 100;
    const quips = ASSET_QUIPS[a.symbol];
    const sectorQuips = SECTOR_QUIPS[a.sector];
    const flat = Math.abs(z) <= 0.35;
    let pool: string[];
    let sentiment: Sentiment;

    if (roll < 14) {
      pool = a.alwaysUp ? ESG_ANTH : a.type === "crypto" ? ESG_CRYPTO : a.type === "etf" && hash(key + "e") % 2 ? ESG_ETF : ESG;
      sentiment = "esg";
    } else if (quips && (roll < 66 || a.alwaysUp)) {
      pool = [...(move >= 0 ? quips.up : quips.down), ...(quips.any ?? [])];
      sentiment = move >= 0 ? "up" : "down";
    } else if (sectorQuips && !flat && roll < 80) {
      pool = sectorQuips;
      sentiment = move >= 0 ? "up" : "down";
    } else {
      pool = z > 1.3 ? BIG_UP : z > 0.35 ? UP : z < -1.3 ? BIG_DOWN : z < -0.35 ? DOWN : FLAT;
      if (pool !== FLAT && a.type === "crypto" && hash(key + "c") % 2 === 0) pool = CRYPTO;
      if (pool !== FLAT && a.type === "etf" && hash(key + "e") % 2 === 0) pool = ETF;
      sentiment = pool === FLAT ? "flat" : move >= 0 ? "up" : "down";
    }

    items.push({
      id: `a:${key}`,
      t,
      headline: fill(pick(pool, key + "t"), a, move),
      source: pick(SOURCES, key + "s"),
      symbols: [a.symbol],
      sentiment,
      move,
    });
  }
  return items;
}

// ---------------------------------------------------------------------------
// Market-wide stories: commentary and jokes every few hours.
// ---------------------------------------------------------------------------

const MARKET_SLOT = 3 * HOUR;
const MARKET_OFFSET = 77 * 60_000;

function marketStories(from: number, to: number): NewsItem[] {
  const items: NewsItem[] = [];
  const first = Math.ceil((from - MARKET_OFFSET) / MARKET_SLOT);
  const last = Math.floor((to - MARKET_OFFSET) / MARKET_SLOT);
  for (let k = last; k >= first; k--) {
    const key = `mkt:${k}`;
    const t = k * MARKET_SLOT + MARKET_OFFSET;
    if (hash(key) % 2 === 0) {
      items.push({ id: key, t, headline: pick(MARKET_QUIPS, key), source: pick(SOURCES, key + "s"), symbols: [], sentiment: "fun" });
      continue;
    }
    // Summarise the market: average move and the best/worst performer.
    const moves = ASSETS.map((a) => ({ a, m: market.priceAt(a.symbol, t) / market.priceAt(a.symbol, t - MARKET_SLOT) - 1 }));
    const avg = moves.reduce((s, x) => s + x.m, 0) / moves.length;
    const best = moves.reduce((b, x) => (x.m > b.m ? x : b));
    const worst = moves.reduce((w, x) => (x.m < w.m ? x : w));
    const star = avg >= 0 ? best : worst;
    const headline =
      avg >= 0
        ? `Markets drift higher; ${star.a.name} leads with ${(star.m * 100).toFixed(1)}%, everyone else politely applauds`
        : `Markets drift lower; ${star.a.name} leads the way down (${(star.m * 100).toFixed(1)}%), nobody asked`;
    items.push({ id: key, t, headline, source: pick(SOURCES, key + "s"), symbols: [star.a.symbol], sentiment: avg >= 0 ? "up" : "down", move: star.m });
  }
  return items;
}

// ---------------------------------------------------------------------------
// Breaking news from demo-control scenarios.
// ---------------------------------------------------------------------------

function scenarioStories(events: readonly MarketEvent[], now: number, symbol?: string): NewsItem[] {
  return events
    .filter((e) => e.start <= now && e.headline)
    .filter((e) => {
      if (!symbol) return true;
      const a = market.getAsset(symbol);
      return a ? matchesTarget(e.target, a) : false;
    })
    .map((e) => ({
      id: `e:${e.id}`,
      t: e.start,
      headline: e.target === "*" ? e.headline! : `${e.headline} (${targetLabel(e.target)})`,
      source: "Breaking",
      symbols: market.getAsset(e.target) ? [e.target] : [],
      sentiment: "breaking" as const,
      move: e.kind === "move" ? e.move : undefined,
    }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface FeedOptions {
  /** Only stories about this asset (plus scenarios that hit it). */
  symbol?: string;
  /** How far back to look, in ms. */
  lookback?: number;
  limit?: number;
  events?: readonly MarketEvent[];
}

export function newsFeed(now: number, opts: FeedOptions = {}): NewsItem[] {
  const { symbol, lookback = 2 * 24 * HOUR, limit = 30, events = [] } = opts;
  const from = now - lookback;
  const assets = symbol ? ASSETS.filter((a) => a.symbol === symbol) : ASSETS;
  const items = [
    ...assets.flatMap((a) => assetStories(a, from, now)),
    ...(symbol ? [] : marketStories(from, now)),
    ...scenarioStories(events, now, symbol),
  ];
  return items.sort((a, b) => b.t - a.t).slice(0, limit);
}
