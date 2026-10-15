import { LOW_COMPREHENSION_MAX } from "@/constants/config";
import type {
  AnswerMap,
  AssessmentResult,
  CategoryScores,
  ItemAnswer,
  JudgmentMap,
  LevelRange,
  PlacementCategory,
  PlacementItem,
  PlacementTest,
  SpokenJudgment,
} from "@/types/assessment";
import type { Level } from "@/types/user";
import { normalizeThai } from "./normalize";

export type ItemScore = 0 | 1 | 2;

const CATEGORIES: PlacementCategory[] = [
  "comprehension",
  "naming",
  "word_clue",
  "repeat",
  "conversation",
];

function transcriptOf(answer: ItemAnswer | undefined): string {
  return answer?.kind === "spoken" ? normalizeThai(answer.transcript) : "";
}

function matchesAccepted(transcript: string, accepted: string[]): boolean {
  if (transcript === "") return false;
  return accepted.some((candidate) => {
    const target = normalizeThai(candidate);
    return target !== "" && transcript.includes(target);
  });
}

function scoreNaming(
  accepted: string[],
  answer: ItemAnswer | undefined,
  judgment: SpokenJudgment | undefined,
): ItemScore {
  const transcript = transcriptOf(answer);
  if (matchesAccepted(transcript, accepted)) return 2;
  if (transcript !== "" && judgment?.closeMeaning) return 1;
  return 0;
}

function scoreRepeat(
  keyWords: string[],
  answer: ItemAnswer | undefined,
): ItemScore {
  const transcript = transcriptOf(answer);
  if (transcript === "" || keyWords.length === 0) return 0;
  const hits = keyWords.filter((word) =>
    transcript.includes(normalizeThai(word)),
  ).length;
  if (hits === keyWords.length) return 2;
  if (hits >= Math.ceil(keyWords.length / 2)) return 1;
  return 0;
}

function scoreConversation(
  answer: ItemAnswer | undefined,
  judgment: SpokenJudgment | undefined,
): ItemScore {
  if (answer?.kind === "chip") return 1;
  if (transcriptOf(answer) === "" || !judgment?.onTopic) return 0;
  return judgment.isSentence ? 2 : 1;
}

export function scoreItem(
  item: PlacementItem,
  answer: ItemAnswer | undefined,
  judgment?: SpokenJudgment,
): ItemScore {
  switch (item.category) {
    case "comprehension":
      return answer?.kind === "choice" && answer.selectedId === item.answer
        ? 2
        : 0;
    case "naming":
    case "word_clue":
      return scoreNaming(item.accepted_answers, answer, judgment);
    case "repeat":
      return scoreRepeat(item.key_words, answer);
    case "conversation":
      return scoreConversation(answer, judgment);
  }
}

export function levelForScore(total: number, ranges: LevelRange[]): Level {
  const match = ranges.find(
    (range) => total >= range.min && total <= range.max,
  );
  if (match) return match.level;
  const sorted = [...ranges].sort((a, b) => a.min - b.min);
  return (total < sorted[0].min ? sorted[0] : sorted[sorted.length - 1]).level;
}

export function categoryMaxScores(test: PlacementTest): CategoryScores {
  const max = emptyScores();
  for (const item of test.items) max[item.category] += 2;
  return max;
}

function emptyScores(): CategoryScores {
  return Object.fromEntries(
    CATEGORIES.map((category) => [category, 0]),
  ) as CategoryScores;
}

export function computeResult(
  test: PlacementTest,
  answers: AnswerMap,
  judgments: JudgmentMap = {},
): AssessmentResult {
  const categoryScores = emptyScores();
  for (const item of test.items) {
    categoryScores[item.category] += scoreItem(
      item,
      answers[item.id],
      judgments[item.id],
    );
  }
  const total = CATEGORIES.reduce(
    (sum, category) => sum + categoryScores[category],
    0,
  );
  const lowComprehension =
    categoryScores.comprehension <= LOW_COMPREHENSION_MAX;
  const resultLevel: Level = lowComprehension
    ? 1
    : levelForScore(total, test.level_ranges);

  return {
    total_score: total,
    category_scores: categoryScores,
    result_level: resultLevel,
    low_comprehension: lowComprehension,
  };
}
