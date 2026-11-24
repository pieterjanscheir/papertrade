"use client";

import { useSyncExternalStore } from "react";

/** `true` when the media query matches (false during server render). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsWide = () => useMediaQuery("(min-width: 1024px)");
