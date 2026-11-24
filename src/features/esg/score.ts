/**
 * "ESG vibes": a deliberately silly, entirely made-up ESG report.
 *
 * Scores come from a hash of the symbol and the quarter, so they're stable within a
 * quarter and shuffle each new one. They say nothing about the real companies.
 * Metrics are about office life only (plants, cake, meetings), never about real
 * environmental or social conduct.
 */

import type { Asset } from "@/lib/market/assets";

export type PillarKey = "E" | "S" | "G";

export interface Metric {
  label: string;
  value: string;
}

export interface Pillar {
  key: PillarKey;
  name: string;
  /** What the letter "really" stands for here. */
  subtitle: string;
  score: number;
  metrics: Metric[];
}

export interface EsgReport {
  symbol: string;
  quarter: string;
  score: number;
  rating: string;
  verdict: string;
  pillars: Pillar[];
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic pseudo-random helpers for one report. */
function rng(seed: string) {
  let i = 0;
  const next = () => hash(`${seed}:${i++}`) / 0xffffffff;
  return {
    int: (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1)),
    dec: (lo: number, hi: number, digits = 1) => (lo + next() * (hi - lo)).toFixed(digits),
    pick: <T,>(list: T[]) => list[Math.floor(next() * list.length)],
    pickN: <T,>(list: T[], n: number) => {
      const copy = [...list];
      const out: T[] = [];
      while (out.length < n && copy.length) out.push(copy.splice(Math.floor(next() * copy.length), 1)[0]);
      return out;
    },
  };
}

type R = ReturnType<typeof rng>;
type MetricFn = (r: R) => Metric;

const E_METRICS: MetricFn[] = [
  (r) => {
    const total = r.int(12, 40);
    return { label: "Office plants still alive", value: `${r.int(Math.floor(total / 2), total)} of ${total}` };
  },
  (r) => ({ label: "Pages saved by the “think before you print” sticker", value: r.int(200, 9000).toLocaleString("en-IE") }),
  (r) => ({ label: "Floors with lights left on over the weekend", value: String(r.int(0, 6)) }),
  (r) => ({ label: "Reusable coffee cups lost this quarter", value: String(r.int(3, 120)) }),
  (r) => ({ label: "Bike-to-work days (weather permitting)", value: String(r.int(2, 60)) }),
  (r) => ({ label: "Tabs closed to save energy", value: r.int(1000, 50000).toLocaleString("en-IE") }),
];
const E_METRICS_CRYPTO: MetricFn[] = [
  (r) => ({ label: "Coins mined only on sunny days", value: `${r.int(1, 30)}%` }),
  (r) => ({ label: "Holders who touched grass this week", value: `${r.int(2, 41)}%` }),
  (r) => ({ label: "Laptops left mining overnight “by accident”", value: r.int(100, 9000).toLocaleString("en-IE") }),
];
const S_METRICS: MetricFn[] = [
  (r) => ({ label: "Birthday cakes per month", value: r.dec(0.5, 4.5) }),
  (r) => ({ label: "Reply-all incidents", value: String(r.int(0, 40)) }),
  (r) => ({ label: "Office dog morale", value: r.pick(["Very good boy", "Good boy", "Sleepy", "Asking for treats", "Excellent, as always"]) }),
  (r) => ({ label: "Emoji reactions per message", value: r.dec(0.4, 6.8) }),
  (r) => {
    const total = r.int(3, 12);
    return { label: "Escape rooms escaped at team-building", value: `${r.int(0, total)} of ${total}` };
  },
  (r) => ({ label: "Colleagues who know the Wi-Fi password", value: `${r.int(12, 100)}%` }),
];
const G_METRICS: MetricFn[] = [
  (r) => ({ label: "Meetings that could have been an email", value: `${r.int(35, 96)}%` }),
  (r) => {
    const total = r.int(7, 15);
    return { label: "Board members who read the slides", value: `${r.int(1, total)} of ${total}` };
  },
  (r) => ({ label: "Passwords that are “Password1”", value: String(r.int(0, 9)) }),
  (r) => ({ label: "Policies with a QR code", value: String(r.int(2, 48)) }),
  (r) => ({ label: "Decisions made by whoever spoke last", value: `${r.int(5, 70)}%` }),
  (r) => ({ label: "Org charts that are up to date", value: r.pick(["0", "1 (in pencil)", "Under review", "It's complicated"]) }),
];

const RATINGS: [number, string][] = [
  [90, "AAA (allegedly)"],
  [80, "AA-ish"],
  [70, "A, give or take"],
  [60, "BBB (Big Bright Building)"],
  [50, "BB+ on a good day"],
  [0, "C (for Character)"],
];

const VERDICTS: [number, string[]][] = [
  [85, ["Would recycle again", "Greener than the office plants", "Basically a walking tree hug"]],
  [70, ["Sustainably above average", "Doing well, and only slightly smug about it", "Lights mostly off, hearts mostly in the right place"]],
  [55, ["Sustainably average", "Trying their best, which is something", "Recycles when someone is watching"]],
  [0, ["Governance: technically present", "Room for improvement (lots of rooms, lights on)", "Has heard of ESG and would like to know more"]],
];

export function quarterOf(t: number): string {
  const d = new Date(t);
  return `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${d.getUTCFullYear()}`;
}

export function esgReport(asset: Asset, now: number): EsgReport {
  const quarter = quarterOf(now);
  const r = rng(`${asset.symbol}:${quarter}`);
  const crypto = asset.type === "crypto";

  const pillar = (key: PillarKey, name: string, subtitle: string, pool: MetricFn[]): Pillar => {
    // The fictional always-up listing also always scores high. Obviously.
    const score = asset.alwaysUp ? r.int(94, 99) : r.int(crypto && key === "E" ? 18 : 38, 96);
    return { key, name, subtitle, score, metrics: r.pickN(pool, 3).map((m) => m(r)) };
  };

  const pillars = [
    pillar("E", "Environmental", "Plants, paper and light switches", crypto ? [...E_METRICS_CRYPTO, ...E_METRICS.slice(3)] : E_METRICS),
    pillar("S", "Social", "Cake, dogs and reply-all", S_METRICS),
    pillar("G", "Governance", "Meetings, slides and passwords", G_METRICS),
  ];
  const score = Math.round(pillars.reduce((s, p) => s + p.score, 0) / pillars.length);
  const rating = RATINGS.find(([min]) => score >= min)![1];
  const verdict = r.pick(VERDICTS.find(([min]) => score >= min)![1]);
  return { symbol: asset.symbol, quarter, score, rating, verdict, pillars };
}
