import { z } from "zod";
import type { PlacementItem, PlacementTest } from "@/types/assessment";

/**
 * Test-level metadata is not served by GET /placement-test; it mirrors
 * Pude-Api/prisma/data/placement_test.json. Items are the only dynamic part.
 */
export const PLACEMENT_VERSION = "placement-test";
const TEST_TITLE = "แบบประเมินเบื้องต้น";
const TEST_NOTE =
  "ผลเป็นการประเมินเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์ นักแก้ไขการพูดปรับระดับได้";
const MAX_SCORE = 30;
const LEVEL_RANGES: PlacementTest["level_ranges"] = [
  { level: 1, min: 0, max: 11 },
  { level: 2, min: 12, max: 20 },
  { level: 3, min: 21, max: 30 },
];

/** The backend stores no instruction text; one line per category. */
const INSTRUCTIONS = {
  comprehension: "ฟังแล้วแตะรูปที่ได้ยิน",
  naming: "รูปนี้คืออะไร",
  word_clue: "ฟังแล้วบอกว่าคืออะไร",
  repeat: "ฟังแล้วพูดตาม",
  conversation: "ฟังคำถามแล้วตอบ",
} as const;

const apiItemSchema = z.object({
  id: z.string(),
  order: z.number(),
  mode: z.enum([
    "COMPREHENSION",
    "PICTURE_NAMING",
    "WORD_CLUE",
    "PHRASE",
    "CONVERSATION",
  ]),
  promptText: z.string().nullable(),
  targetText: z.string().nullable(),
  acceptedAnswers: z.array(z.string()),
  keyWords: z.array(z.string()),
  exampleAnswers: z.array(z.string()),
  expectedTopic: z.string().nullable(),
  imagePrompt: z.string().nullable(),
  imageUrl: z.string().nullable(),
  correctOption: z.string().nullable(),
  options: z.array(
    z.object({ code: z.string(), imageUrl: z.string().nullable() }),
  ),
});

export const apiPlacementSchema = z.object({
  items: z.array(apiItemSchema).min(1),
});

type ApiItem = z.infer<typeof apiItemSchema>;

function required<T>(value: T | null, field: string, id: string): T {
  if (value === null) throw new Error(`Placement item ${id} is missing ${field}`);
  return value;
}

function mapItem(item: ApiItem): PlacementItem {
  const base = { id: item.id, order: item.order };
  switch (item.mode) {
    case "COMPREHENSION":
      return {
        ...base,
        category: "comprehension",
        instruction: INSTRUCTIONS.comprehension,
        audio_text: required(item.promptText, "promptText", item.id),
        options: item.options.map((option) => option.code),
        answer: required(item.correctOption, "correctOption", item.id),
      };
    case "PICTURE_NAMING":
      return {
        ...base,
        category: "naming",
        instruction: INSTRUCTIONS.naming,
        target_word: required(item.targetText, "targetText", item.id),
        accepted_answers: item.acceptedAnswers,
        image_prompt: item.imagePrompt ?? "",
      };
    case "WORD_CLUE":
      return {
        ...base,
        category: "word_clue",
        instruction: INSTRUCTIONS.word_clue,
        clue: required(item.promptText, "promptText", item.id),
        target_word: required(item.targetText, "targetText", item.id),
        accepted_answers: item.acceptedAnswers,
      };
    case "PHRASE":
      return {
        ...base,
        category: "repeat",
        instruction: INSTRUCTIONS.repeat,
        phrase: required(item.promptText, "promptText", item.id),
        key_words: item.keyWords,
      };
    case "CONVERSATION":
      return {
        ...base,
        category: "conversation",
        instruction: INSTRUCTIONS.conversation,
        question: required(item.promptText, "promptText", item.id),
        expected_topic: item.expectedTopic ?? "",
        example_answers: item.exampleAnswers,
      };
  }
}

export interface MappedPlacement {
  test: PlacementTest;
  /** Image id (option code or item id) to URL; null renders the placeholder. */
  imageUrls: Record<string, string | null>;
}

export function mapPlacementResponse(payload: unknown): MappedPlacement {
  const parsed = apiPlacementSchema.parse(payload);
  const items = [...parsed.items]
    .sort((a, b) => a.order - b.order)
    .map(mapItem);

  const imageUrls: Record<string, string | null> = {};
  for (const item of parsed.items) {
    imageUrls[item.id] = item.imageUrl;
    for (const option of item.options) imageUrls[option.code] = option.imageUrl;
  }

  return {
    test: {
      id: PLACEMENT_VERSION,
      title: TEST_TITLE,
      note: TEST_NOTE,
      max_score: MAX_SCORE,
      level_ranges: LEVEL_RANGES,
      items,
    },
    imageUrls,
  };
}
