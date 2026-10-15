import { Sprout } from "lucide-react";
import Link from "next/link";
import { ASSESSMENT_BUTTON_WIDTH } from "./AssessmentButton";
import { ListenButton } from "@/components/shared/ListenButton";
import { buttonVariants } from "@/components/ui/button";
import { ASSESSMENT, CATEGORY_LABEL } from "@/constants/copy";
import { categoryMaxScores } from "@/lib/assessment/score";
import { cn } from "@/lib/utils";
import type {
  AssessmentResult,
  PlacementCategory,
  PlacementTest,
} from "@/types/assessment";

interface ResultScreenProps {
  test: PlacementTest;
  result: AssessmentResult;
  userName: string;
}

const ORDER: PlacementCategory[] = [
  "comprehension",
  "naming",
  "word_clue",
  "repeat",
  "conversation",
];

export function ResultScreen({ test, result, userName }: ResultScreenProps) {
  const maxScores = categoryMaxScores(test);
  const title = ASSESSMENT.resultTitle(userName);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-success text-success-strong">
          <Sprout aria-hidden className="size-12" />
        </span>
        <h1 className="text-3xl font-bold leading-relaxed">{title}</h1>
        <ListenButton
          text={ASSESSMENT.resultSpeech(userName, result.result_level)}
          className={ASSESSMENT_BUTTON_WIDTH}
        />
      </div>

      <p className="rounded-3xl bg-primary p-6 text-center text-2xl font-bold text-primary-foreground">
        {ASSESSMENT.resultLevel(result.result_level)}
      </p>

      <ul className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-card p-5 shadow-card">
        {ORDER.map((category) => (
          <li
            key={category}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-lg">{CATEGORY_LABEL[category]}</span>
            <span
              role="img"
              aria-label={`${result.category_scores[category]} จาก ${maxScores[category]}`}
              className="flex gap-1.5"
            >
              {Array.from({ length: maxScores[category] }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "size-3.5 rounded-full",
                    index < result.category_scores[category]
                      ? "bg-brand-500"
                      : "bg-brand-100",
                  )}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>

      {result.low_comprehension ? (
        <p className="rounded-3xl border border-brand-200 bg-brand-50 p-5 text-lg text-navy-900">
          {ASSESSMENT.lowComprehension}
        </p>
      ) : null}
      <p className="text-base text-muted-foreground">
        {ASSESSMENT.resultDisclaimer}
      </p>

      <Link
        href="/"
        className={cn(
          buttonVariants({ size: "xl" }),
          ASSESSMENT_BUTTON_WIDTH,
          "mx-auto",
        )}
      >
        {ASSESSMENT.goHome}
      </Link>
    </div>
  );
}
