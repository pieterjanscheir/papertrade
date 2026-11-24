"use client";

import { createLocalStore } from "@/lib/local-store";

/**
 * EXAMPLE FEATURE: price alerts. Copy this folder as a starting point for your own
 * feature. It shows: its own persisted state, reading prices, a home widget, an
 * asset panel, a background runner with notifications, and its own page.
 */

export interface PriceAlert {
  id: string;
  symbol: string;
  direction: "above" | "below";
  price: number;
  createdAt: number;
  triggeredAt?: number;
}

interface AlertStore {
  alerts: PriceAlert[];
  add: (a: Omit<PriceAlert, "id">) => void;
  remove: (id: string) => void;
  markTriggered: (id: string, t: number) => void;
}

export const useAlerts = createLocalStore<AlertStore>("feature-price-alerts", (set, get) => ({
  alerts: [],
  add: (a) => set({ alerts: [...get().alerts, { ...a, id: Math.random().toString(36).slice(2, 9) }] }),
  remove: (id) => set({ alerts: get().alerts.filter((a) => a.id !== id) }),
  markTriggered: (id, t) => set({ alerts: get().alerts.map((a) => (a.id === id ? { ...a, triggeredAt: t } : a)) }),
}));

export function isCrossed(a: PriceAlert, price: number) {
  return a.direction === "above" ? price >= a.price : price <= a.price;
}
