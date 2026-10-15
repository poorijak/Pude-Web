import { expect, it } from "vitest";
import type { PlacementItem } from "@/types/assessment";
import { getListenText } from "./listen";

it("reads the right field per category", () => {
  const base = { id: "x", order: 1, instruction: "ใบ้" };
  const items: PlacementItem[] = [
    {
      ...base,
      category: "comprehension",
      audio_text: "แมว",
      options: ["a", "b", "c", "d"],
      answer: "a",
    },
    {
      ...base,
      category: "naming",
      target_word: "",
      accepted_answers: [],
      image_prompt: "",
    },
    {
      ...base,
      category: "word_clue",
      clue: "คำใบ้",
      target_word: "",
      accepted_answers: [],
    },
    { ...base, category: "repeat", phrase: "วลี", key_words: [] },
    {
      ...base,
      category: "conversation",
      question: "คำถาม",
      expected_topic: "",
      example_answers: [],
    },
  ];
  expect(items.map(getListenText)).toEqual([
    "แมว",
    "ใบ้",
    "คำใบ้",
    "วลี",
    "คำถาม",
  ]);
});
