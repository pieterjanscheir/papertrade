"use client";

/**
 * `createLocalStore`: a zustand store saved in localStorage. Use this for any state
 * your feature should remember across reloads.
 *
 *   export const useNotes = createLocalStore("notes", (set) => ({
 *     notes: [] as string[],
 *     add: (n: string) => set((s) => ({ notes: [...s.notes, n] })),
 *   }));
 *
 * Stores load after the page renders (in <AppProviders>), which avoids
 * server/client mismatch warnings. The app is hidden behind a splash until then.
 */

import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type Rehydratable = { persist: { rehydrate: () => Promise<void> | void } };
const stores: Rehydratable[] = [];

export function createLocalStore<T>(name: string, init: StateCreator<T, [["zustand/persist", unknown]], []>) {
  const store = create<T>()(persist(init, { name: `papertrade-${name}`, skipHydration: true }));
  stores.push(store);
  return store;
}

/** Called once by <AppProviders>. */
export function rehydrateLocalStores() {
  return Promise.all(stores.map((s) => s.persist.rehydrate()));
}
