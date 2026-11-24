"use client";

import { useMemo, useRef, useState } from "react";
import type { Candle } from "@/lib/market/simulator";
import { compactNumber, price as fmtPrice } from "@/lib/ui/format";
import type { ChartMarker } from "./price-chart";

export interface Indicator {
  label: string;
  color: string;
  /** One value per visible candle; null where undefined. */
  values: (number | null)[];
}

const W = 1000;
const AXIS_W = 64; // px reserved on the right for price labels
const VOLUME_SHARE = 0.2;

const MARKER_COLOR: Record<ChartMarker["tone"], string> = {
  accent: "var(--color-accent)",
  muted: "var(--color-muted)",
  gain: "var(--color-gain)",
  loss: "var(--color-loss)",
};

/** Round "nice" tick values for an axis between lo and hi. */
function niceTicks(lo: number, hi: number, count = 5): number[] {
  const raw = (hi - lo) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) ticks.push(v);
  return ticks;
}

/**
 * Candlestick chart with volume bars, indicator lines, a price axis, time labels
 * and a crosshair with an OHLC readout.
 */
export function CandleChart({
  candles,
  height = 380,
  indicators = [],
  showVolume = true,
  markers = [],
  timeFormat,
  onHover,
}: {
  candles: Candle[];
  height?: number;
  indicators?: Indicator[];
  showVolume?: boolean;
  markers?: ChartMarker[];
  timeFormat: (t: number) => string;
  onHover?: (index: number | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const priceH = showVolume ? height * (1 - VOLUME_SHARE) - 8 : height;
  const volTop = height * (1 - VOLUME_SHARE);
  const volH = height * VOLUME_SHARE;

  const geo = useMemo(() => {
    const n = candles.length;
    let lo = Infinity;
    let hi = -Infinity;
    for (const c of candles) {
      lo = Math.min(lo, c.low);
      hi = Math.max(hi, c.high);
    }
    const extend = (v: number) => {
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    };
    for (const ind of indicators) for (const v of ind.values) if (v !== null) extend(v);
    const reach = (hi - lo) * 0.5;
    const [dataLo, dataHi] = [lo, hi];
    for (const m of markers) if (m.value > dataLo - reach && m.value < dataHi + reach) extend(m.value);
    const pad = (hi - lo) * 0.06 || hi * 0.01;
    lo -= pad;
    hi += pad;
    const y = (v: number) => priceH - ((v - lo) / (hi - lo)) * priceH;
    const slot = W / n;
    const maxVol = Math.max(...candles.map((c) => c.volume), 1);
    return { n, lo, hi, y, slot, maxVol };
  }, [candles, indicators, markers, priceH]);

  const { n, lo, hi, y, slot, maxVol } = geo;
  const ticks = niceTicks(lo, hi);
  const timeTicks = [0.12, 0.37, 0.62, 0.87].map((f) => Math.floor(f * (n - 1)));

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const plotW = rect.width - AXIS_W;
    const x = Math.min(Math.max(e.clientX - rect.left, 0), plotW - 1);
    const i = Math.min(n - 1, Math.floor((x / plotW) * n));
    setHover(i);
    onHover?.(i);
  }
  function handleLeave() {
    setHover(null);
    onHover?.(null);
  }

  const shown = candles[hover ?? n - 1];
  const up = (c: Candle) => c.close >= c.open;

  return (
    <div className="select-none">
      {/* Readout */}
      <div className="tabular mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className="text-muted">{timeFormat(shown.t)}</span>
        {(["open", "high", "low", "close"] as const).map((k) => (
          <span key={k}>
            <span className="text-muted">{k[0].toUpperCase()} </span>
            <span className={up(shown) ? "text-gain" : "text-loss"}>{fmtPrice(shown[k])}</span>
          </span>
        ))}
        {showVolume && (
          <span>
            <span className="text-muted">Vol </span>
            {compactNumber(shown.volume)}
          </span>
        )}
        {indicators.map((ind) => {
          const v = ind.values[hover ?? n - 1];
          return (
            <span key={ind.label} style={{ color: ind.color }}>
              {ind.label} {v === null ? "—" : fmtPrice(v)}
            </span>
          );
        })}
      </div>

      <div
        ref={ref}
        className="relative w-full touch-none"
        style={{ height: height + 22 }}
        onPointerMove={handleMove}
        onPointerDown={handleMove}
        onPointerLeave={handleLeave}
        onPointerUp={(e) => e.pointerType !== "mouse" && handleLeave()}
      >
        <div className="absolute top-0 left-0" style={{ right: AXIS_W, height }}>
          <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {/* Grid */}
            {ticks.map((t) => (
              <line key={t} x1={0} x2={W} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            {/* Volume */}
            {showVolume &&
              candles.map((c, i) => {
                const h = (c.volume / maxVol) * volH;
                return (
                  <rect
                    key={`v${c.t}`}
                    x={i * slot + slot * 0.15}
                    width={slot * 0.7}
                    y={volTop + volH - h}
                    height={h}
                    fill={up(c) ? "var(--color-gain)" : "var(--color-loss)"}
                    opacity={hover === i ? 0.6 : 0.28}
                  />
                );
              })}
            {/* Candles */}
            {candles.map((c, i) => {
              const color = up(c) ? "var(--color-gain)" : "var(--color-loss)";
              const cx = i * slot + slot / 2;
              const top = y(Math.max(c.open, c.close));
              const bodyH = Math.max(Math.abs(y(c.open) - y(c.close)), 1);
              return (
                <g key={c.t}>
                  <line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <rect x={i * slot + slot * 0.15} width={slot * 0.7} y={top} height={bodyH} fill={color} />
                </g>
              );
            })}
            {/* Indicators */}
            {indicators.map((ind) => {
              let d = "";
              let penDown = false;
              ind.values.forEach((v, i) => {
                if (v === null) return void (penDown = false);
                d += `${penDown ? "L" : "M"}${(i * slot + slot / 2).toFixed(1)},${y(v).toFixed(1)}`;
                penDown = true;
              });
              return <path key={ind.label} d={d} fill="none" stroke={ind.color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />;
            })}
            {/* Markers */}
            {markers
              .filter((m) => m.value > lo && m.value < hi)
              .map((m) => (
                <line
                  key={m.label}
                  x1={0}
                  x2={W}
                  y1={y(m.value)}
                  y2={y(m.value)}
                  stroke={MARKER_COLOR[m.tone]}
                  strokeDasharray="6 5"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.8"
                />
              ))}
          </svg>

          {/* Crosshair */}
          {hover !== null && (
            <>
              <div className="pointer-events-none absolute inset-y-0 w-px bg-fg/25" style={{ left: `${((hover + 0.5) / n) * 100}%` }} />
              <div className="pointer-events-none absolute inset-x-0 h-px bg-fg/20" style={{ top: y(shown.close) }} />
            </>
          )}
        </div>

        {/* Price axis */}
        <div className="tabular pointer-events-none absolute top-0 right-0 text-[11px] text-muted" style={{ width: AXIS_W, height: priceH }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2 pl-2" style={{ top: y(t) }}>
              {fmtPrice(t)}
            </span>
          ))}
          {markers
            .filter((m) => m.value > lo && m.value < hi)
            .map((m) => (
              <span
                key={m.label}
                className="absolute right-0 -translate-y-1/2 rounded px-1 font-semibold text-black"
                style={{ top: y(m.value), background: MARKER_COLOR[m.tone] }}
                title={m.label}
              >
                {fmtPrice(m.value)}
              </span>
            ))}
          {/* Last / hovered price tag */}
          <span
            className={`absolute right-0 -translate-y-1/2 rounded px-1 font-semibold text-black ${up(shown) ? "bg-gain" : "bg-loss"}`}
            style={{ top: y(shown.close) }}
          >
            {fmtPrice(shown.close)}
          </span>
        </div>

        {/* Time axis */}
        <div className="pointer-events-none absolute left-0 text-[11px] text-muted" style={{ top: height + 4, right: AXIS_W }}>
          {timeTicks.map((i) => (
            <span key={i} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${((i + 0.5) / n) * 100}%` }}>
              {timeFormat(candles[i].t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
