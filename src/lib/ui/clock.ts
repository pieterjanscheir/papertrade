"use client";

import { useSyncExternalStore } from "react";
import { marketNow, useDemoStore } from "../demo/store";

/**
 * One shared clock for the whole app. Prices are a function of time, so re-rendering
 * with a new `now` is all it takes to make prices tick.
 *
 * `now` is market time (see lib/demo/store.ts): normally real time, but demo
 * controls can speed it up, pause it or jump ahead.
 */
export const TICK_MS = 2_000;

let now = 0;
let realAtTick = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function emit() {
  now = marketNow();
  realAtTick = Date.now();
  listeners.forEach((l) => l());
}

// Re-render immediately when the demo clock or scenarios change.
if (typeof window !== "undefined") useDemoStore.subscribe(emit);

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    now = marketNow();
    realAtTick = Date.now();
    timer = setInterval(emit, TICK_MS);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  if (!now) now = marketNow();
  return now;
}

/** How far market time is from real time, as of the last tick (ms). */
export function clockOffset(): number {
  return realAtTick ? now - realAtTick : 0;
}

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
