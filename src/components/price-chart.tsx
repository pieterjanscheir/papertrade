"use client";

import { useId, useMemo, useRef, useState } from "react";

export interface ChartPoint {
  t: number;
  v: number;
}

/** A labelled horizontal line, e.g. your average cost or an open order's price. */
export interface ChartMarker {
  value: number;
  label: string;
  tone: "accent" | "muted" | "gain" | "loss";
}

const TONE_COLOR: Record<ChartMarker["tone"], string> = {
  accent: "var(--color-accent)",
  muted: "var(--color-muted)",
  gain: "var(--color-gain)",
  loss: "var(--color-loss)",
};

const W = 1000;

/**
 * Lightweight SVG area chart with a scrub-to-inspect crosshair.
 * `onHover` gets the hovered index (or null) so the parent can show that value
 * in its header, the way banking apps do.
 */
export function PriceChart({
  points,
  height = 220,
  onHover,
  markers = [],
}: {
  points: ChartPoint[];
  height?: number;
  onHover?: (index: number | null) => void;
  markers?: ChartMarker[];
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { line, area, ys, up, markerYs } = useMemo(() => {
    if (points.length < 2) return { line: "", area: "", ys: [] as number[], up: true, markerYs: [] };
    const vs = points.map((p) => p.v);
    const dataMin = Math.min(...vs);
    const dataMax = Math.max(...vs);
    // Stretch the scale to include markers that are reasonably close to the data.
    const reach = (dataMax - dataMin) * 0.6 || dataMax * 0.05;
    const nearby = markers.filter((m) => m.value > dataMin - reach && m.value < dataMax + reach).map((m) => m.value);
    const min = Math.min(dataMin, ...nearby);
    const max = Math.max(dataMax, ...nearby);
    const pad = (max - min) * 0.12 || max * 0.01 || 1;
    const lo = min - pad;
    const hi = max + pad;
    const ys = vs.map((v) => height - ((v - lo) / (hi - lo)) * height);
    const step = W / (points.length - 1);
    const line = ys.map((y, i) => `${i ? "L" : "M"}${(i * step).toFixed(2)},${y.toFixed(2)}`).join("");
    const markerYs = markers
      .filter((m) => nearby.includes(m.value))
      .map((m) => ({ ...m, y: height - ((m.value - lo) / (hi - lo)) * height }));
    return { line, area: `${line}L${W},${height}L0,${height}Z`, ys, up: vs[vs.length - 1] >= vs[0], markerYs };
  }, [points, height, markers]);

  const color = up ? "var(--color-gain)" : "var(--color-loss)";

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || points.length < 2) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const i = Math.round((x / rect.width) * (points.length - 1));
    setHover(i);
    onHover?.(i);
  }

  function handleLeave() {
    setHover(null);
    onHover?.(null);
  }

  const hx = hover !== null ? (hover / (points.length - 1)) * 100 : 0;
  const hy = hover !== null ? ys[hover] : 0;

  return (
    <div
      ref={ref}
      className="relative w-full touch-none select-none"
      style={{ height }}
      onPointerMove={handleMove}
      onPointerDown={handleMove}
      onPointerLeave={handleLeave}
      onPointerUp={(e) => e.pointerType !== "mouse" && handleLeave()}
    >
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      {markerYs.map((m) => (
        <div key={m.label + m.value} className="pointer-events-none absolute inset-x-0" style={{ top: m.y }}>
          <div className="border-t border-dashed opacity-60" style={{ borderColor: TONE_COLOR[m.tone] }} />
          <span
            className="tabular absolute right-0 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-black"
            style={{ background: TONE_COLOR[m.tone] }}
          >
            {m.label}
          </span>
        </div>
      ))}
      {hover !== null && (
        <>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-fg/25" style={{ left: `${hx}%` }} />
          <div
            className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg"
            style={{ left: `${hx}%`, top: hy, background: color }}
          />
        </>
      )}
    </div>
  );
}

export function Sparkline({ values, width = 72, height = 28 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 2 - ((v - min) / span) * (height - 4);
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join("");
  const up = values[values.length - 1] >= values[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={d} fill="none" stroke={up ? "var(--color-gain)" : "var(--color-loss)"} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
