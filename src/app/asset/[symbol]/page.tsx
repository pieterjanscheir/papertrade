import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AssetScreen } from "@/components/screens/asset-screen";
import { ASSETS, getAsset } from "@/lib/market/assets";

export function generateStaticParams() {
  return ASSETS.map((a) => ({ symbol: a.symbol }));
}

export default function Page({ params }: PageProps<"/asset/[symbol]">) {
  return (
    <Suspense>
      <Asset params={params} />
    </Suspense>
  );
}

async function Asset({ params }: { params: PageProps<"/asset/[symbol]">["params"] }) {
  const { symbol } = await params;
  const asset = getAsset(symbol);
  if (!asset) notFound();
  return (
    <>
      <title>{`${asset.name} (${asset.symbol}) · Papertrade`}</title>
      <AssetScreen symbol={asset.symbol} />
    </>
  );
}
