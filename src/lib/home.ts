import { DAILY_GOAL, MAX_LEVEL, STAGES_PER_LEVEL } from "@/constants/config";
import type { Level, Stage } from "@/types/user";

export type SegmentFill = "done" | "current" | "upcoming";

export function stageSegments(stage: Stage): SegmentFill[] {
  return Array.from({ length: STAGES_PER_LEVEL }, (_, index) => {
    const position = index + 1;
    if (position < stage) return "done";
    return position === stage ? "current" : "upcoming";
  });
}

export function stagesToNextLevel(level: Level, stage: Stage): number | null {
  if (level >= MAX_LEVEL) return null;
  return STAGES_PER_LEVEL - stage + 1;
}

export function goalProgress(done: number): { done: number; ratio: number; reached: boolean } {
  return {
    done,
    ratio: Math.min(done / DAILY_GOAL, 1),
    reached: done >= DAILY_GOAL,
  };
}
