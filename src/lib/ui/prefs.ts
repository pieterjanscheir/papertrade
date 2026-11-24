"use client";

/**
 * UI preferences saved in localStorage: chart type, ranges, filters, sort orders,
 * table/card views… Use `usePref` like `useState`, with a unique key.
 *
 *   const [view, setView] = usePref<"table" | "cards">("markets.view", "table");
 */

import { createLocalStore } from "../local-store";

interface Prefs {
  values: Record<string, unknown>;
  set: (key: string, value: unknown) => void;
  reset: () => void;
}

export const usePrefsStore = createLocalStore<Prefs>("ui-prefs", (set, get) => ({
  values: {},
  set: (key, value) => set({ values: { ...get().values, [key]: value } }),
  reset: () => set({ values: {} }),
}));

export function usePref<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const stored = usePrefsStore((s) => s.values[key]) as T | undefined;
  const value = stored === undefined ? initial : stored;
  const setValue = (v: T | ((prev: T) => T)) => {
    const prev = (usePrefsStore.getState().values[key] as T | undefined) ?? initial;
    usePrefsStore.getState().set(key, typeof v === "function" ? (v as (p: T) => T)(prev) : v);
  };
  return [value, setValue];
}
