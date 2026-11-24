"use client";

import Link from "next/link";
import type { Asset } from "@/lib/market/assets";
import type { Range } from "@/lib/market/simulator";
import { RANGES } from "@/lib/market/simulator";
import { pct, tone } from "@/lib/ui/format";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-[var(--radius-card)] border border-line bg-surface ${className}`}>{children}</section>;
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between px-1">
      <h2 className="text-base font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function AssetAvatar({ asset, size = 40 }: { asset: Asset; size?: number }) {
  const label = asset.symbol.slice(0, asset.symbol.length > 3 ? 2 : asset.symbol.length);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white ring-1 ring-white/10"
      style={{
        width: size,
        height: size,
        fontSize: size * (label.length > 2 ? 0.3 : 0.36),
        background: `linear-gradient(135deg, ${asset.color}, color-mix(in srgb, ${asset.color} 55%, black))`,
      }}
      aria-hidden
    >
      {label}
    </span>
  );
}

export function ChangePill({ value, className = "" }: { value: number; className?: string }) {
  const bg = value > 0 ? "bg-gain/12" : value < 0 ? "bg-loss/12" : "bg-surface-2";
  return (
    <span className={`tabular inline-flex rounded-md px-1.5 py-0.5 text-xs font-semibold ${bg} ${tone(value)} ${className}`}>
      {pct(value)}
    </span>
  );
}

export function RangeTabs({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="flex gap-1">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:flex-none ${
            r === value ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "gain" | "loss" | "ghost" }) {
  const styles = {
    primary: "bg-fg text-bg hover:bg-fg/90",
    secondary: "bg-surface-2 text-fg hover:bg-line",
    gain: "bg-gain text-black hover:bg-gain/90",
    loss: "bg-loss text-white hover:bg-loss/90",
    ghost: "text-muted hover:text-fg",
  }[variant];
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${styles} ${className}`}
      {...props}
    />
  );
}

export function IconAction({
  icon,
  label,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-fg transition group-hover:bg-line">{icon}</span>
      <span className="text-xs font-medium text-muted group-hover:text-fg">{label}</span>
    </>
  );
  const cls = "group flex flex-col items-center gap-2";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="max-w-xs text-sm text-muted">{body}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** Placeholder shown for a moment before the screen has real data (e.g. before hydration). */
export function ScreenSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-busy="true" aria-label="Loading">
      <div className="h-6 w-40 rounded-lg bg-surface" />
      <div className="h-12 w-64 rounded-xl bg-surface" />
      <div className="h-72 rounded-[var(--radius-card)] bg-surface" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-[var(--radius-card)] bg-surface" />
        ))}
      </div>
    </div>
  );
}
