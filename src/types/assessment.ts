import type { Level } from "./user";

export type PlacementCategory =
  | "comprehension"
  | "naming"
  | "word_clue"
  | "repeat"
  | "conversation";

interface ItemBase {
  id: string;
  order: number;
  instruction: string;
}

export interface ComprehensionItem extends ItemBase {
  category: "comprehension";
  audio_text: string;
  options: string[];
  answer: string;
}

export interface NamingItem extends ItemBase {
  category: "naming";
  target_word: string;
  accepted_answers: string[];
  image_prompt: string;
}

export interface WordClueItem extends ItemBase {
  category: "word_clue";
  clue: string;
  target_word: string;
  accepted_answers: string[];
}

export interface RepeatItem extends ItemBase {
  category: "repeat";
  phrase: string;
  key_words: string[];
}

export interface ConversationItem extends ItemBase {
  category: "conversation";
  question: string;
  expected_topic: string;
  example_answers: string[];
}

export type PlacementItem =
  | ComprehensionItem
  | NamingItem
  | WordClueItem
  | RepeatItem
  | ConversationItem;

export interface LevelRange {
  level: Level;
  min: number;
  max: number;
}

export interface PlacementTest {
  id: string;
  title: string;
  note: string;
  max_score: number;
  level_ranges: LevelRange[];
  items: PlacementItem[];
}

export type ItemAnswer =
  | { kind: "choice"; selectedId: string | null }
  | { kind: "spoken"; transcript: string }
  | { kind: "chip"; text: string };

export type AnswerMap = Record<string, ItemAnswer>;

/** Verdict from the judge service for answers that need meaning checks. */
export interface SpokenJudgment {
  closeMeaning: boolean;
  onTopic: boolean;
  isSentence: boolean;
}

export type JudgmentMap = Record<string, SpokenJudgment>;

export type CategoryScores = Record<PlacementCategory, number>;

export interface AssessmentResult {
  total_score: number;
  category_scores: CategoryScores;
  result_level: Level;
  low_comprehension: boolean;
}
