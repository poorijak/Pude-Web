"use client";

import { useCallback } from "react";
import type { AnswerMap } from "@/types/assessment";

interface SavedProgress {
  index: number;
  answers: AnswerMap;
}

const KEY = "placement-progress";

/** In-progress answers survive a refresh. TODO: move server-side per user. */
export function usePersistedProgress() {
  const load = useCallback((): SavedProgress | null => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as SavedProgress) : null;
    } catch {
      return null;
    }
  }, []);

  const save = useCallback((progress: SavedProgress) => {
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      // Storage unavailable: progress simply is not restored after refresh.
    }
  }, []);

  const clear = useCallback(() => {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      // Nothing to clear.
    }
  }, []);

  return { load, save, clear };
}
