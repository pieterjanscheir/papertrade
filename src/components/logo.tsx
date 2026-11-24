export function Logo({ size = 32, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="grid place-items-center rounded-[30%] bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/25"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" aria-hidden>
          <path d="M3 17l5-5 4 4 8-9" stroke="#1a1406" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="7" r="1.9" fill="#1a1406" />
        </svg>
      </span>
      {withText && <span className="text-lg font-semibold tracking-tight">papertrade</span>}
    </span>
  );
}
