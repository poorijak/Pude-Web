import { describe, expect, it } from "vitest";
import type {
  AnswerMap,
  PlacementItem,
  PlacementTest,
} from "@/types/assessment";
import { normalizeThai } from "./normalize";
import { computeResult, levelForScore, scoreItem } from "./score";

const ranges = [
  { level: 1, min: 0, max: 11 },
  { level: 2, min: 12, max: 20 },
  { level: 3, min: 21, max: 30 },
] as const;

const naming: PlacementItem = {
  id: "n",
  order: 1,
  category: "naming",
  instruction: "",
  target_word: "แมว",
  accepted_answers: ["แมว"],
  image_prompt: "",
};

const repeat: PlacementItem = {
  id: "r",
  order: 1,
  category: "repeat",
  instruction: "",
  phrase: "ฉันกินข้าวกับปลา",
  key_words: ["กิน", "ข้าว", "ปลา", "ฉัน"],
};

const conversation: PlacementItem = {
  id: "c",
  order: 1,
  category: "conversation",
  instruction: "",
  question: "",
  expected_topic: "food",
  example_answers: ["ข้าว"],
};

const comprehension: PlacementItem = {
  id: "k",
  order: 1,
  category: "comprehension",
  instruction: "",
  audio_text: "แมว",
  options: ["a", "b", "c", "d"],
  answer: "a",
};

const spoken = (transcript: string) => ({
  kind: "spoken" as const,
  transcript,
});

describe("normalizeThai", () => {
  it("removes spaces and polite particles", () => {
    expect(normalizeThai("  แมว ค่ะ นะคะ ")).toBe("แมว");
  });
});

describe("scoreItem", () => {
  it("comprehension: correct 2, wrong or empty 0", () => {
    expect(scoreItem(comprehension, { kind: "choice", selectedId: "a" })).toBe(
      2,
    );
    expect(scoreItem(comprehension, { kind: "choice", selectedId: "b" })).toBe(
      0,
    );
    expect(scoreItem(comprehension, undefined)).toBe(0);
  });

  it("naming: accepted 2, close meaning 1, else 0", () => {
    expect(scoreItem(naming, spoken("แมวค่ะ"))).toBe(2);
    expect(
      scoreItem(naming, spoken("เหมียว"), {
        closeMeaning: true,
        onTopic: false,
        isSentence: false,
      }),
    ).toBe(1);
    expect(scoreItem(naming, spoken("หมา"))).toBe(0);
    expect(scoreItem(naming, spoken(""))).toBe(0);
  });

  it("repeat: all keywords 2, at least half 1, fewer 0", () => {
    expect(scoreItem(repeat, spoken("ฉันกินข้าวกับปลา"))).toBe(2);
    expect(scoreItem(repeat, spoken("กินข้าว"))).toBe(1);
    expect(scoreItem(repeat, spoken("ปลา"))).toBe(0);
  });

  it("conversation: sentence 2, short word 1, chip 1, off topic 0", () => {
    const sentence = { closeMeaning: false, onTopic: true, isSentence: true };
    const word = { closeMeaning: false, onTopic: true, isSentence: false };
    const off = { closeMeaning: false, onTopic: false, isSentence: true };
    expect(scoreItem(conversation, spoken("ฉันชอบกินข้าวผัด"), sentence)).toBe(
      2,
    );
    expect(scoreItem(conversation, spoken("ข้าว"), word)).toBe(1);
    expect(scoreItem(conversation, { kind: "chip", text: "ข้าว" })).toBe(1);
    expect(scoreItem(conversation, spoken("ไม่รู้"), off)).toBe(0);
  });
});

describe("levelForScore", () => {
  const list = ranges.map((range) => ({ ...range }));
  it("maps boundaries 11/12 and 20/21", () => {
    expect(levelForScore(0, list)).toBe(1);
    expect(levelForScore(11, list)).toBe(1);
    expect(levelForScore(12, list)).toBe(2);
    expect(levelForScore(20, list)).toBe(2);
    expect(levelForScore(21, list)).toBe(3);
    expect(levelForScore(30, list)).toBe(3);
  });
});

describe("computeResult", () => {
  const comprehensionItems: PlacementItem[] = [1, 2, 3].map((n) => ({
    ...comprehension,
    id: `k${n}`,
  }));
  const test: PlacementTest = {
    id: "t",
    title: "",
    note: "",
    max_score: 30,
    level_ranges: ranges.map((range) => ({ ...range })),
    items: [...comprehensionItems, naming, repeat, conversation],
  };

  it("forces level 1 when comprehension is 2 or less", () => {
    const answers: AnswerMap = {
      k1: { kind: "choice", selectedId: "a" },
      n: spoken("แมว"),
      r: spoken("ฉันกินข้าวกับปลา"),
      c: { kind: "chip", text: "ข้าว" },
    };
    const result = computeResult(test, answers);
    expect(result.category_scores.comprehension).toBe(2);
    expect(result.low_comprehension).toBe(true);
    expect(result.result_level).toBe(1);
  });

  it("uses level ranges when comprehension is fine", () => {
    const answers: AnswerMap = {
      k1: { kind: "choice", selectedId: "a" },
      k2: { kind: "choice", selectedId: "a" },
      k3: { kind: "choice", selectedId: "a" },
    };
    const result = computeResult(test, answers);
    expect(result.low_comprehension).toBe(false);
    expect(result.total_score).toBe(6);
    expect(result.result_level).toBe(1);
  });
});
