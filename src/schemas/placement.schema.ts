import { z } from "zod";
import type { PlacementTest } from "@/types/assessment";

const base = { id: z.string(), order: z.number(), instruction: z.string() };

const itemSchema = z.discriminatedUnion("category", [
  z.object({
    ...base,
    category: z.literal("comprehension"),
    audio_text: z.string(),
    options: z.array(z.string()).length(4),
    answer: z.string(),
  }),
  z.object({
    ...base,
    category: z.literal("naming"),
    target_word: z.string(),
    accepted_answers: z.array(z.string()).min(1),
    image_prompt: z.string(),
  }),
  z.object({
    ...base,
    category: z.literal("word_clue"),
    clue: z.string(),
    target_word: z.string(),
    accepted_answers: z.array(z.string()).min(1),
  }),
  z.object({
    ...base,
    category: z.literal("repeat"),
    phrase: z.string(),
    key_words: z.array(z.string()).min(1),
  }),
  z.object({
    ...base,
    category: z.literal("conversation"),
    question: z.string(),
    expected_topic: z.string(),
    example_answers: z.array(z.string()),
  }),
]);

export const placementTestSchema: z.ZodType<PlacementTest> = z.object({
  id: z.string(),
  title: z.string(),
  note: z.string(),
  max_score: z.number(),
  level_ranges: z.array(
    z.object({
      level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      min: z.number(),
      max: z.number(),
    }),
  ),
  items: z.array(itemSchema),
});
