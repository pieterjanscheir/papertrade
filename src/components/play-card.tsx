"use client";

import { useState } from "react";
import { money } from "@/lib/ui/format";
import { Logo } from "./logo";
import { Tilt } from "./tilt";

/** A 3D, flippable "play money" card. Purely decorative, and proudly fake. */
export function PlayCard({ balance }: { balance: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Tilt max={14} className="w-full max-w-sm">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="block aspect-[1.586] w-full [perspective:1200px]"
        aria-label={flipped ? "Show the front of the card" : "Flip the card"}
      >
        <div className="flip-card relative h-full w-full" data-flipped={flipped}>
          {/* Front */}
          <div
            className="flip-face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[22px] p-5 text-left shadow-2xl shadow-black/60"
            style={{
              background:
                "linear-gradient(135deg, #2b2416 0%, #4a3a17 35%, #c9952a 60%, #f5c04a 75%, #6b521c 100%), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 50%)",
              backgroundBlendMode: "overlay",
            }}
          >
            <span className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center justify-between">
              <Logo size={28} withText />
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#fde9b0]">PLAY MONEY</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="mb-3 h-8 w-11 rounded-md bg-gradient-to-br from-[#fde9b0] to-[#b07a12] shadow-inner" aria-hidden />
                <p className="tabular font-mono text-xs whitespace-nowrap tracking-[0.15em] text-white/85 sm:text-sm">•••• •••• •••• 0000</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-white/70 uppercase">Paper Trader</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60 uppercase">Balance</p>
                <p className="tabular text-lg font-semibold text-white">{money(balance)}</p>
              </div>
            </div>
          </div>
          {/* Back */}
          <div className="flip-face flip-back absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-[#3a2f15] to-[#16120a] py-5 text-left shadow-2xl shadow-black/60">
            <div className="h-10 w-full bg-black/80" aria-hidden />
            <div className="px-5">
              <div className="flex items-center gap-3">
                <div className="h-8 flex-1 rounded bg-[repeating-linear-gradient(45deg,#e8dcc0,#e8dcc0_6px,#d8c9a4_6px,#d8c9a4_12px)]" />
                <span className="tabular rounded bg-white px-2 py-1 font-mono text-xs text-black">CVV 000</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#fde9b0]/80">
                Not a real card. Please don&apos;t try it at the supermarket; the cashier will laugh, and they&apos;ll be right to.
              </p>
            </div>
          </div>
        </div>
      </button>
    </Tilt>
  );
}
