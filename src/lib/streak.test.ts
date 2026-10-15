import { describe, expect, it } from "vitest";
import {
  buildWeek,
  getStreakStatus,
  milestoneFor,
  nextMilestone,
  toThaiDateKey,
} from "./streak";

describe("toThaiDateKey", () => {
  it("rolls over at midnight Thailand time (17:00 UTC)", () => {
    expect(toThaiDateKey(new Date("2026-03-10T16:59:00Z"))).toBe("2026-03-10");
    expect(toThaiDateKey(new Date("2026-03-10T17:00:00Z"))).toBe("2026-03-11");
  });
});

describe("getStreakStatus", () => {
  const now = new Date("2026-03-10T05:00:00Z");
  it("keeps streak when practiced today or yesterday", () => {
    expect(getStreakStatus(4, "2026-03-10", now)).toEqual({ state: "practiced-today", streak: 4 });
    expect(getStreakStatus(4, "2026-03-09", now)).toEqual({ state: "pending-today", streak: 4 });
  });
  it("resets after a missed day", () => {
    expect(getStreakStatus(4, "2026-03-08", now)).toEqual({ state: "broken", streak: 0 });
  });
  it("handles never practiced", () => {
    expect(getStreakStatus(0, null, now)).toEqual({ state: "none", streak: 0 });
  });
});

describe("milestones", () => {
  it("detects milestones and the next target", () => {
    expect(milestoneFor(7)).toBe(7);
    expect(milestoneFor(8)).toBeNull();
    expect(nextMilestone(3)).toBe(7);
    expect(nextMilestone(30)).toBeNull();
  });
});

describe("buildWeek", () => {
  it("returns Monday to Sunday with today and practiced flags", () => {
    const now = new Date("2026-03-11T05:00:00Z"); // Wednesday
    const week = buildWeek(["2026-03-09", "2026-03-11"], now);
    expect(week.map((day) => day.dateKey)).toEqual([
      "2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12",
      "2026-03-13", "2026-03-14", "2026-03-15",
    ]);
    expect(week[0].practiced).toBe(true);
    expect(week[1].practiced).toBe(false);
    expect(week[2]).toMatchObject({ practiced: true, isToday: true });
  });
});
