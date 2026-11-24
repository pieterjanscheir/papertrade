"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Compass, Home, Palette, UserRound, Zap } from "lucide-react";
import { enabledFeatures } from "@/features";
import { useDemoStore } from "@/lib/demo/store";
import { market } from "@/lib/market/provider";
import { portfolioSummary } from "@/lib/trading/portfolio";
import { openOrders } from "@/lib/trading/orders";
import { useAccount } from "@/lib/trading/store";
import { useNow } from "@/lib/ui/clock";
import { money } from "@/lib/ui/format";
import { DemoBanner } from "./demo-controls";
import { Logo } from "./logo";

const NAV: { href: string; label: string; icon: typeof Home }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/markets", label: "Invest", icon: Compass },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/account", label: "Account", icon: UserRound },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/markets") return pathname.startsWith("/markets") || pathname.startsWith("/asset");
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Core navigation plus entries contributed by features (src/features).
  const featureNav = enabledFeatures().flatMap((f) => (f.nav ? [f.nav] : []));
  const nav = [...NAV.slice(0, -1), ...featureNav, NAV[NAV.length - 1]]; // Account stays last

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1600px]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 xl:w-64 flex-col gap-8 border-r border-line px-5 py-7 md:flex">
        <Link href="/" className="px-2">
          <Logo withText />
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface hover:text-fg"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>
        <SidebarSummary />
        <BuilderLinks />
        <div className="mt-auto rounded-2xl border border-line bg-surface p-4 text-xs leading-relaxed text-muted">
          <span className="mb-1 flex items-center gap-1.5 font-medium text-fg">
            <span className="size-1.5 animate-pulse rounded-full bg-gain" />
            {market.sourceLabel}
          </span>
          Play money only. Nothing here is real market data or investment advice.
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-28 md:px-8 md:pb-12 xl:px-12">
        <DemoBanner />
        <div className="pt-5 md:pt-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${nav.length}, 1fr)` }}>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-fg" : "text-muted"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function SidebarSummary() {
  const now = useNow();
  const account = useAccount();
  const total = portfolioSummary(account, now).total;
  const open = openOrders(account).length;
  return (
    <div className="rounded-2xl border border-line p-4">
      <p className="text-xs font-medium text-muted">Portfolio</p>
      <p className="tabular mt-0.5 text-lg font-semibold">{money(total)}</p>
      {open > 0 && (
        <Link href="/activity?tab=orders" className="mt-1 flex items-center gap-1.5 text-xs font-medium text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          {open} open order{open === 1 ? "" : "s"}
        </Link>
      )}
    </div>
  );
}

/** Tools for hackathon teams: hidden from end users in a real product. */
function BuilderLinks() {
  const setPanelOpen = useDemoStore((s) => s.setPanelOpen);
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 text-[11px] font-semibold tracking-wide text-muted/70 uppercase">For builders</p>
      <button
        onClick={() => setPanelOpen(!useDemoStore.getState().panelOpen)}
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-fg"
      >
        <Zap size={16} /> Demo controls
        <kbd className="ml-auto rounded bg-surface-2 px-1.5 text-[10px]">⇧D</kbd>
      </button>
      <Link href="/design" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-fg">
        <Palette size={16} /> Design system
      </Link>
    </div>
  );
}
