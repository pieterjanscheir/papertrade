"use client";

import { createLocalStore } from "@/lib/local-store";

interface Progress {
  done: string[];
  quiz: Record<string, number>;
  markDone: (id: string) => void;
  answer: (id: string, choice: number) => void;
  reset: () => void;
}

export const useLearnProgress = createLocalStore<Progress>("feature-learn", (set, get) => ({
  done: [],
  quiz: {},
  markDone: (id) => !get().done.includes(id) && set({ done: [...get().done, id] }),
  answer: (id, choice) => set({ quiz: { ...get().quiz, [id]: choice } }),
  reset: () => set({ done: [], quiz: {} }),
}));
