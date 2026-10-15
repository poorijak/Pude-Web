import {
  STREAK_MILESTONES,
  THAILAND_UTC_OFFSET_HOURS,
} from "@/constants/config";

const DAY_MS = 24 * 60 * 60 * 1000;

/** `YYYY-MM-DD` of the given instant on the Thailand calendar (UTC+7). */
export function toThaiDateKey(date: Date): string {
  const shifted = new Date(date.getTime() + THAILAND_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

function dayNumber(dateKey: string): number {
  return Math.floor(Date.parse(`${dateKey}T00:00:00Z`) / DAY_MS);
}

export function daysBetween(fromKey: string, toKey: string): number {
  return dayNumber(toKey) - dayNumber(fromKey);
}

export type StreakState = "practiced-today" | "pending-today" | "broken" | "none";

export interface StreakStatus {
  state: StreakState;
  /** Streak to show; resets to 0 once a whole day was missed. */
  streak: number;
}

export function getStreakStatus(
  currentStreak: number,
  lastPracticeDate: string | null,
  now: Date,
): StreakStatus {
  if (lastPracticeDate === null) return { state: "none", streak: 0 };
  const gap = daysBetween(lastPracticeDate, toThaiDateKey(now));
  if (gap <= 0) return { state: "practiced-today", streak: currentStreak };
  if (gap === 1) return { state: "pending-today", streak: currentStreak };
  return { state: "broken", streak: 0 };
}

/** Milestone reached exactly at this streak length, if any. */
export function milestoneFor(streak: number): number | null {
  return STREAK_MILESTONES.find((milestone) => milestone === streak) ?? null;
}

export function nextMilestone(streak: number): number | null {
  return STREAK_MILESTONES.find((milestone) => milestone > streak) ?? null;
}

export interface WeekDay {
  dateKey: string;
  practiced: boolean;
  isToday: boolean;
}

/** Monday to Sunday of the Thailand week containing `now`. */
export function buildWeek(practicedDates: string[], now: Date): WeekDay[] {
  const todayKey = toThaiDateKey(now);
  const weekday = new Date(`${todayKey}T00:00:00Z`).getUTCDay();
  const sinceMonday = (weekday + 6) % 7;
  const practiced = new Set(practicedDates);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(dayNumber(todayKey) * DAY_MS + (index - sinceMonday) * DAY_MS);
    const dateKey = date.toISOString().slice(0, 10);
    return { dateKey, practiced: practiced.has(dateKey), isToday: dateKey === todayKey };
  });
}
