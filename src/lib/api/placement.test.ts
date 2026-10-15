import { describe, expect, it } from "vitest";
import { placementTestSchema } from "@/schemas/placement.schema";
import { mapPlacementResponse } from "./placement.mapper";

const blank = {
  promptText: null,
  targetText: null,
  acceptedAnswers: [],
  keyWords: [],
  exampleAnswers: [],
  expectedTopic: null,
  imagePrompt: null,
  imageUrl: null,
  correctOption: null,
  options: [],
};

const payload = {
  items: [
    {
      ...blank,
      id: "pt-04",
      order: 4,
      mode: "PICTURE_NAMING",
      targetText: "ส้ม",
      acceptedAnswers: ["ส้ม"],
      imagePrompt: "orange",
      imageUrl: "https://img/orange.png",
    },
    {
      ...blank,
      id: "pt-01",
      order: 1,
      mode: "COMPREHENSION",
      promptText: "แมว",
      correctOption: "a",
      options: [
        { code: "a", imageUrl: "https://img/a.png" },
        { code: "b", imageUrl: null },
        { code: "c", imageUrl: null },
        { code: "d", imageUrl: null },
      ],
    },
    {
      ...blank,
      id: "pt-08",
      order: 8,
      mode: "WORD_CLUE",
      promptText: "ผลไม้มีหนาม",
      targetText: "ทุเรียน",
      acceptedAnswers: ["ทุเรียน"],
    },
    {
      ...blank,
      id: "pt-12",
      order: 12,
      mode: "PHRASE",
      promptText: "ช่วยเปิดหน้าต่าง",
      keyWords: ["เปิด", "หน้าต่าง"],
    },
    {
      ...blank,
      id: "pt-14",
      order: 14,
      mode: "CONVERSATION",
      promptText: "ชอบข้าวเหนียวไหม",
      expectedTopic: "ข้าว",
      exampleAnswers: ["ชอบ"],
    },
  ],
};

describe("mapPlacementResponse", () => {
  const { test, imageUrls } = mapPlacementResponse(payload);

  it("orders items and satisfies the frontend schema", () => {
    expect(test.items.map((item) => item.id)).toEqual([
      "pt-01",
      "pt-04",
      "pt-08",
      "pt-12",
      "pt-14",
    ]);
    expect(placementTestSchema.safeParse(test).success).toBe(true);
  });

  it("maps backend fields per category", () => {
    const byId = Object.fromEntries(test.items.map((item) => [item.id, item]));
    expect(byId["pt-01"]).toMatchObject({
      category: "comprehension",
      audio_text: "แมว",
      options: ["a", "b", "c", "d"],
      answer: "a",
    });
    expect(byId["pt-04"]).toMatchObject({
      category: "naming",
      target_word: "ส้ม",
      image_prompt: "orange",
    });
    expect(byId["pt-12"]).toMatchObject({
      category: "repeat",
      key_words: ["เปิด", "หน้าต่าง"],
    });
    expect(byId["pt-14"]).toMatchObject({
      category: "conversation",
      expected_topic: "ข้าว",
    });
  });

  it("builds image URLs with null for missing images", () => {
    expect(imageUrls["a"]).toBe("https://img/a.png");
    expect(imageUrls["b"]).toBeNull();
    expect(imageUrls["pt-04"]).toBe("https://img/orange.png");
  });

  it("rejects a comprehension item without a correct option", () => {
    const bad = {
      items: [{ ...payload.items[1], correctOption: null }],
    };
    expect(() => mapPlacementResponse(bad)).toThrow();
  });
});
