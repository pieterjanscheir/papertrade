import { connection } from "next/server";
import { market } from "@/lib/market/provider";
import { RANGES, type Range } from "@/lib/market/simulator";

/** GET /api/history/AAPL?range=1M  (range: 1D | 1W | 1M | 1Y | 5Y) */
export async function GET(request: Request, ctx: RouteContext<"/api/history/[symbol]">) {
  await connection();
  const { symbol } = await ctx.params;
  const asset = market.getAsset(symbol);
  if (!asset) return Response.json({ error: `Unknown symbol ${symbol}` }, { status: 404 });

  const range = (new URL(request.url).searchParams.get("range")?.toUpperCase() ?? "1D") as Range;
  if (!RANGES.includes(range)) return Response.json({ error: `range must be one of ${RANGES.join(", ")}` }, { status: 400 });

  return Response.json({ symbol: asset.symbol, range, points: market.history(asset.symbol, range, Date.now()) });
}
