"use server";

import type { AssessmentResult } from "@/types/assessment";

/**
 * TODO: connect the database. In one transaction: insert the `initial`
 * assessment, set users.current_level = result_level and current_stage = 1,
 * and create stage_progress (result_level, stage 1) as `in_progress`.
 * Store transcripts only, never raw audio.
 */
export async function submitPlacementResult(
  result: AssessmentResult,
): Promise<void> {
  await Promise.resolve(result);
}
