import { connection } from "next/server";
import { market } from "@/lib/market/provider";

/**
 * GET /api/quotes            → all assets with a live simulated quote
 * GET /api/quotes?symbols=AAPL,BTC
 *
 * Handy for bots, notebooks, a second client, or a team building a backend.
 */
export async function GET(request: Request) {
  await connection(); // always run at request time: prices depend on the clock
  const now = Date.now();
  const wanted = new URL(request.url).searchParams.get("symbols")?.toUpperCase().split(",").filter(Boolean);
  const assets = market.listAssets().filter((a) => !wanted || wanted.includes(a.symbol));
  return Response.json({
    source: market.sourceLabel,
    time: now,
    quotes: assets.map((a) => ({ ...market.quote(a.symbol, now), name: a.name, type: a.type })),
  });
}
