const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const eurPrecise = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
const eurCompact = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function money(x: number): string {
  return eur.format(x);
}

/** Prices under €1 get more decimals. */
export function price(x: number): string {
  return x < 1 ? eurPrecise.format(x) : eur.format(x);
}

export function compactMoney(x: number): string {
  return eurCompact.format(x);
}

export function signedMoney(x: number): string {
  const s = eur.format(Math.abs(x));
  return `${x >= 0 ? "+" : "−"}${s}`;
}

export function pct(x: number, signed = true): string {
  const v = (Math.abs(x) * 100).toFixed(2);
  if (!signed) return `${v}%`;
  return `${x >= 0 ? "+" : "−"}${v}%`;
}

export function qty(x: number): string {
  return x.toLocaleString("en-IE", { maximumFractionDigits: 6 });
}

export function dateTime(t: number): string {
  return new Date(t).toLocaleString("en-IE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dayLabel(t: number, now: number): string {
  const d = new Date(t);
  const today = new Date(now);
  const yesterday = new Date(now - 86_400_000);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Today";
  if (same(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: d.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

export function time(t: number): string {
  return new Date(t).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
}

/** Tailwind text colour for a gain/loss. */
export function tone(x: number): string {
  if (x > 0) return "text-gain";
  if (x < 0) return "text-loss";
  return "text-muted";
}

const compactFmt = new Intl.NumberFormat("en-IE", { notation: "compact", maximumFractionDigits: 1 });
export function compactNumber(x: number): string {
  return compactFmt.format(x);
}
