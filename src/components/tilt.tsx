"use client";

import { useRef } from "react";

/**
 * 3D tilt on hover: the card leans towards the pointer with a soft glare.
 * Pure CSS transforms, no library. Respects "reduce motion".
 */
export function Tilt({
  children,
  className = "",
  max = 10,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.dataset.active = "true";
  }

  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.dataset.active = "false";
  }

  return (
    <div className={`[perspective:900px] ${className}`}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className="tilt relative h-full rounded-[var(--radius-card)] transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] data-[active=true]:duration-75 motion-reduce:![transform:none]"
      >
        {children}
        {glare && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.12),transparent_55%)] [.tilt[data-active=true]_&]:opacity-100"
          />
        )}
      </div>
    </div>
  );
}

/** A spinning 3D gold coin made of stacked discs. Decorative. */
export function Coin3D({ size = 72, label = "€" }: { size?: number; label?: string }) {
  const layers = 10;
  return (
    <div className="[perspective:600px]" style={{ width: size, height: size }} aria-hidden>
      <div className="coin-spin relative h-full w-full [transform-style:preserve-3d]">
        {Array.from({ length: layers }, (_, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              transform: `translateZ(${(i - layers / 2) * (size / 60)}px)`,
              background: i === 0 || i === layers - 1 ? "radial-gradient(circle at 35% 30%, #fbe3a1, #f5c04a 45%, #b07a12)" : "#a8740f",
            }}
          />
        ))}
        {[1, -1].map((side) => (
          <span
            key={side}
            className="absolute inset-0 grid place-items-center rounded-full font-bold text-[#5a3d05] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
            style={{
              transform: `translateZ(${side * (layers / 2) * (size / 60) + side * 0.5}px) ${side === -1 ? "rotateY(180deg)" : ""}`,
              fontSize: size * 0.42,
              boxShadow: "inset 0 0 0 3px rgb(90 61 5 / 0.35)",
              background: "radial-gradient(circle at 35% 30%, #fde9b0, #f5c04a 50%, #c48d1d)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
