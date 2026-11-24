"use client";

import { market } from "@/lib/market/provider";
import type { Side } from "@/lib/trading/engine";
import { OrderForm } from "./order-form";
import { Sheet } from "./sheet";
import { AssetAvatar } from "./ui";

/** Order form in a bottom sheet (mobile). On wide screens the asset page shows it inline. */
export function TradeSheet({
  symbol,
  open,
  side,
  onClose,
}: {
  symbol: string;
  open: boolean;
  side: Side;
  onClose: () => void;
}) {
  const asset = market.getAsset(symbol)!;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={
        <span className="flex items-center gap-3">
          <AssetAvatar asset={asset} size={32} />
          {asset.name}
        </span>
      }
    >
      {open && <OrderForm key={`${symbol}-${side}`} symbol={symbol} initialSide={side} onClose={onClose} />}
    </Sheet>
  );
}
