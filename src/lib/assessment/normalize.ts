import { PARTICLES_TO_STRIP } from "@/constants/config";

/** Trim, drop whitespace/punctuation and polite particles from Thai text. */
export function normalizeThai(text: string): string {
  let result = text.replace(/[\s.,!?'"“”‘’()\-–—…]+/g, "");
  for (const particle of PARTICLES_TO_STRIP) {
    result = result.split(particle).join("");
  }
  return result;
}
