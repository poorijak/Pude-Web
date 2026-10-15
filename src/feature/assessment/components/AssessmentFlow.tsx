"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ASSESSMENT, COMMON } from "@/constants/copy";
import { getListenText } from "@/lib/assessment/listen";
import { judgeAnswers } from "@/lib/assessment/judge";
import { computeResult } from "@/lib/assessment/score";
import type {
  AnswerMap,
  AssessmentResult,
  ItemAnswer,
  PlacementItem,
  PlacementTest,
} from "@/types/assessment";
import { usePersistedProgress } from "../hooks/usePersistedProgress";
import { useRecorder } from "../hooks/useRecorder";
import { submitPlacementResult } from "../server/submitPlacementResult";
import {
  ComprehensionScreen,
  ConversationScreen,
  NamingScreen,
  RepeatScreen,
  WordClueScreen,
} from "./ItemScreens";
import { AssessmentTopBar } from "./AssessmentTopBar";
import { AssessmentButton } from "./AssessmentButton";
import { IntroScreen } from "./IntroScreen";
import { LoadingResult } from "./LoadingResult";
import { MicPermissionScreen } from "./MicPermissionScreen";
import { QuestionHeader } from "./QuestionHeader";
import { ResultScreen } from "./ResultScreen";
import { Stepper } from "./Stepper";

interface AssessmentFlowProps {
  test: PlacementTest;
  userName: string;
  imageUrls: Record<string, string | null>;
}

type Step = "intro" | "mic" | "items" | "loading" | "result";

const MIN_LOADING_MS = 1500;

function ItemScreen({
  item,
  imageUrls,
  onAnswer,
}: {
  item: PlacementItem;
  imageUrls: Record<string, string | null>;
  onAnswer: (answer: ItemAnswer) => void;
}) {
  switch (item.category) {
    case "comprehension":
      return (
        <ComprehensionScreen
          item={item}
          imageUrls={imageUrls}
          onAnswer={onAnswer}
        />
      );
    case "naming":
      return (
        <NamingScreen item={item} imageUrls={imageUrls} onAnswer={onAnswer} />
      );
    case "word_clue":
      return <WordClueScreen item={item} onAnswer={onAnswer} />;
    case "repeat":
      return <RepeatScreen item={item} onAnswer={onAnswer} />;
    case "conversation":
      return <ConversationScreen item={item} onAnswer={onAnswer} />;
  }
}

export function AssessmentFlow({
  test,
  userName,
  imageUrls,
}: AssessmentFlowProps) {
  const items = [...test.items].sort((a, b) => a.order - b.order);
  const { load, save, clear } = usePersistedProgress();
  const recorder = useRecorder();
  const router = useRouter();

  const [step, setStep] = useState<Step>("intro");
  // Intro and mic screens do not render these, so reading storage at init is hydration-safe.
  const [index, setIndex] = useState(() => load()?.index ?? 0);
  const [answers, setAnswers] = useState<AnswerMap>(
    () => load()?.answers ?? {},
  );
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const item = items[index];
  const answered = item !== undefined && answers[item.id] !== undefined;
  const isLast = index === items.length - 1;

  const requestMic = async () => {
    if ((await recorder.requestPermission()) === "granted") setStep("items");
  };

  const finish = async (finalAnswers: AnswerMap) => {
    setStep("loading");
    setSaveFailed(false);
    try {
      const [judgments] = await Promise.all([
        judgeAnswers(test, finalAnswers),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
      ]);
      const computed = computeResult(test, finalAnswers, judgments);
      await submitPlacementResult(computed);
      clear();
      setResult(computed);
      setStep("result");
    } catch {
      setSaveFailed(true);
      setStep("items");
    }
  };

  const next = () => {
    if (isLast) {
      void finish(answers);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    save({ index: nextIndex, answers });
  };

  const record = (answer: ItemAnswer) => {
    setAnswers((current) => ({ ...current, [item.id]: answer }));
  };

  const exit = () => {
    save({ index, answers });
    router.push("/");
  };

  return (
    <div className="mx-auto grid h-dvh w-full max-w-295 grid-rows-[4rem_minmax(0,1fr)] px-4 pb-4 sm:px-6">
      <AssessmentTopBar
        showClose={step === "intro" || step === "mic" || step === "items"}
        onExit={exit}
      />
      <main className="@container flex min-h-0 flex-col gap-8 rounded-[28px] bg-card p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-card md:p-12 [@media(max-height:760px)]:gap-6">
        {step === "items" && item ? (
          <>
            <Stepper items={items} current={index} />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [container-type:size]">
              <div
                key={item.id}
                className="my-auto flex flex-col items-center gap-4 py-3 animate-in fade-in slide-in-from-right-4 duration-200 md:gap-6 [@media(max-height:760px)]:gap-3"
              >
                <QuestionHeader
                  number={index + 1}
                  total={items.length}
                  title={item.instruction}
                  listenText={getListenText(item)}
                />
                <ItemScreen
                  item={item}
                  imageUrls={imageUrls}
                  onAnswer={record}
                />
              </div>
            </div>
            {saveFailed ? (
              <p
                role="alert"
                className="shrink-0 rounded-2xl border border-brand-200 bg-brand-50 p-3 text-base text-navy-900"
              >
                {ASSESSMENT.saveError}
              </p>
            ) : null}
            <footer className="flex shrink-0 justify-center">
              <AssessmentButton disabled={!answered} onClick={next}>
                {isLast
                  ? saveFailed
                    ? COMMON.retry
                    : COMMON.finish
                  : COMMON.next}
                <ArrowRight aria-hidden className="size-5" />
              </AssessmentButton>
            </footer>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="m-auto w-full max-w-xl py-4">
              {step === "intro" ? (
                <IntroScreen onStart={() => setStep("mic")} />
              ) : null}
              {step === "mic" ? (
                <MicPermissionScreen
                  permission={recorder.permission}
                  onRequest={requestMic}
                />
              ) : null}
              {step === "loading" ? <LoadingResult /> : null}
              {step === "result" && result ? (
                <ResultScreen test={test} result={result} userName={userName} />
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
