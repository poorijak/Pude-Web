"use client";

import { useCallback, useSyncExternalStore } from "react";

const keyFor = (days: number) => `milestone-seen-${days}`;
const listeners = new Set<() => void>();

function read(days: number): boolean {
  try {
    return window.localStorage.getItem(keyFor(days)) === "1";
  } catch {
    return false;
  }
}

/** Whether a streak milestone celebration was already shown on this device. */
export function useMilestoneSeen(days: number | null): [boolean, () => void] {
  const subscribe = useCallback((notify: () => void) => {
    listeners.add(notify);
    return () => listeners.delete(notify);
  }, []);

  // Server snapshot is "seen" so nothing flashes before hydration.
  const seen = useSyncExternalStore(
    subscribe,
    () => (days === null ? true : read(days)),
    () => true,
  );

  const markSeen = useCallback(() => {
    if (days === null) return;
    try {
      window.localStorage.setItem(keyFor(days), "1");
    } catch {
      // Storage unavailable: celebration may show again, which is harmless.
    }
    listeners.forEach((notify) => notify());
  }, [days]);

  return [seen, markSeen];
}
