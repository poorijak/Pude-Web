"use server";

import { postPlacementResult } from "@/lib/api/placement";
import type { AssessmentResult } from "@/types/assessment";

/** Sends scores only (no transcripts or audio); the API sets level and stage. */
export async function submitPlacementResult(
  result: AssessmentResult,
): Promise<void> {
  await postPlacementResult(result);
}
