import { cookies } from "next/headers";
import { z } from "zod";
import type { AssessmentResult } from "@/types/assessment";
import {
  mapPlacementResponse,
  PLACEMENT_VERSION,
  type MappedPlacement,
} from "./placement.mapper";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const meSchema = z.object({
  name: z.string(),
  placementCompletedAt: z.string().nullable(),
});

export interface PlacementStatus {
  name: string;
  completed: boolean;
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.INTERNAL_API_URL;
  if (!baseUrl) throw new Error("INTERNAL_API_URL is not set");
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new ApiError(401, "Not signed in");

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) throw new ApiError(res.status, `API ${path} -> ${res.status}`);
  return res;
}

export async function fetchPlacementStatus(): Promise<PlacementStatus> {
  const me = meSchema.parse(await (await apiFetch("/auth/me")).json());
  return { name: me.name, completed: me.placementCompletedAt !== null };
}

export async function fetchPlacementTest(): Promise<MappedPlacement> {
  const res = await apiFetch("/placement-test");
  return mapPlacementResponse(await res.json());
}

/** A 409 means the result is already stored, which is the desired end state. */
export async function postPlacementResult(
  result: AssessmentResult,
): Promise<void> {
  try {
    await apiFetch("/placement-test/result", {
      method: "POST",
      body: JSON.stringify({
        total_score: result.total_score,
        category_scores: result.category_scores,
        result_level: result.result_level,
        version: PLACEMENT_VERSION,
      }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) return;
    throw error;
  }
}
