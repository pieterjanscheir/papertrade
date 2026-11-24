"use client";

/**
 * Demo controls state: a "market clock" that can run faster than real time or be
 * moved forward, plus scripted scenario events (crash, rally, volatility).
 *
 * Use `marketNow()` instead of `Date.now()` anywhere you need the current time in
 * the app. In normal use it IS `Date.now()`.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setMarketEvents, type MarketEvent } from "../market/simulator";

interface DemoState {
  /** Market time at the moment `anchorReal` was taken. */
  anchorMarket: number;
  anchorReal: number;
  /** 0 = paused, 1 = real time, 60 = one market minute per real second … */
  speed: number;
  events: MarketEvent[];
  panelOpen: boolean;

  setSpeed: (speed: number) => void;
  jump: (ms: number) => void;
  goLive: () => void;
  addEvent: (e: Omit<MarketEvent, "id" | "start">) => void;
  clearEvents: () => void;
  setPanelOpen: (open: boolean) => void;
}

function timeFrom(s: Pick<DemoState, "anchorMarket" | "anchorReal" | "speed">, real = Date.now()) {
  if (!s.anchorReal) return real;
  return s.anchorMarket + (real - s.anchorReal) * s.speed;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      anchorMarket: 0,
      anchorReal: 0,
      speed: 1,
      events: [],
      panelOpen: false,

      setSpeed(speed) {
        const real = Date.now();
        set({ anchorMarket: timeFrom(get(), real), anchorReal: real, speed });
      },
      jump(ms) {
        const real = Date.now();
        set({ anchorMarket: timeFrom(get(), real) + ms, anchorReal: real });
      },
      goLive() {
        set({ anchorMarket: 0, anchorReal: 0, speed: 1, events: [] });
      },
      addEvent(e) {
        const event: MarketEvent = { ...e, id: Math.random().toString(36).slice(2, 9), start: marketNow() };
        set({ events: [...get().events, event] });
      },
      clearEvents() {
        set({ events: [] });
      },
      setPanelOpen(panelOpen) {
        set({ panelOpen });
      },
    }),
    {
      name: "papertrade-demo-v1",
      skipHydration: true,
      partialize: ({ anchorMarket, anchorReal, speed, events }) => ({ anchorMarket, anchorReal, speed, events }),
    },
  ),
);

// Keep the simulator's scenario events in sync with the store.
useDemoStore.subscribe((s, prev) => {
  if (s.events !== prev.events) setMarketEvents(s.events);
});

/** The app's notion of "now". Equals Date.now() unless demo controls changed it. */
export function marketNow(): number {
  if (typeof window === "undefined") return Date.now();
  return timeFrom(useDemoStore.getState());
}

/** True when the market clock is plain real time and no scenario is active. */
export function isLive(s: Pick<DemoState, "anchorReal" | "speed" | "events"> = useDemoStore.getState()) {
  return !s.anchorReal && s.speed === 1 && s.events.length === 0;
}
