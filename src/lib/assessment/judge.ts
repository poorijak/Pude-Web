import type { AnswerMap, JudgmentMap, PlacementTest } from "@/types/assessment";

const MIN_SENTENCE_LENGTH = 8;

/**
 * TODO: replace with the LLM judging service. This stand-in only checks that
 * something was said, so "close meaning" is never granted and conversation
 * answers are treated as on topic when non-empty.
 */
export async function judgeAnswers(
  test: PlacementTest,
  answers: AnswerMap,
): Promise<JudgmentMap> {
  const judgments: JudgmentMap = {};
  for (const item of test.items) {
    const answer = answers[item.id];
    if (answer?.kind !== "spoken") continue;
    const said = answer.transcript.trim();
    judgments[item.id] = {
      closeMeaning: false,
      onTopic: said.length > 0,
      isSentence: said.length >= MIN_SENTENCE_LENGTH,
    };
  }
  return judgments;
}
