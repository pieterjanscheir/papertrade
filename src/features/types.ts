import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * A hackathon feature plugs into the app through these slots, so teams rarely
 * need to edit the existing screens. Register it in `src/features/index.ts`.
 */
export interface Feature {
  id: string;
  name: string;
  /** One line, shown on the /design page's feature list. */
  description: string;
  /** Set to false to hide the feature without deleting it (handy for demos). */
  enabled: boolean;

  /** Card in the side column of the Home dashboard. */
  HomeWidget?: ComponentType<{ now: number }>;
  /** Card on every asset page (right column on desktop, below the chart on mobile). */
  AssetPanel?: ComponentType<{ symbol: string; now: number }>;
  /** Extra main-navigation entry. Add the page itself under src/app/. */
  nav?: { href: string; label: string; icon: LucideIcon };
  /** Rendered once, invisibly, for background work on every clock tick. */
  Runner?: ComponentType<{ now: number }>;
}
