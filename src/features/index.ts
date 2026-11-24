/**
 * FEATURE REGISTRY — add your team's feature here.
 *
 * 1. Copy src/features/price-alerts to src/features/<your-feature>
 * 2. Export a `Feature` object from its index.ts (see ./types.ts for the slots)
 * 3. Add it to the list below
 *
 * The Home dashboard, asset pages, navigation and background runner all read this
 * list, so your feature shows up without editing those screens.
 */

import { esg } from "./esg";
import { news } from "./news";
import { priceAlerts } from "./price-alerts";
import type { Feature } from "./types";

export const FEATURES: Feature[] = [
  news,
  esg,
  priceAlerts,
  // yourFeature,
];

export const enabledFeatures = () => FEATURES.filter((f) => f.enabled);
export type { Feature };
