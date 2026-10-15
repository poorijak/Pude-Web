"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONVERSATION_CHIP_DELAY_MS } from "@/constants/config";
import { ASSESSMENT } from "@/constants/copy";
import { createMockTranscriber } from "@/lib/speech/transcribe";
import { cn } from "@/lib/utils";
import type {
  ComprehensionItem,
  ConversationItem,
  ItemAnswer,
  NamingItem,
  RepeatItem,
  WordClueItem,
} from "@/types/assessment";
import { ImageTile } from "./ImageTile";
import { RecorderButton } from "./RecorderButton";

interface ScreenProps<T> {
  item: T;
  imageUrls: Record<string, string | null>;
  onAnswer: (answer: ItemAnswer) => void;
}

type TextScreenProps<T> = Omit<ScreenProps<T>, "imageUrls">;

const CARD =
  "w-full max-w-2xl rounded-3xl border border-slate-200 bg-brand-50 px-6 py-8 text-center";

function Recorder({
  expected,
  onAnswer,
}: {
  expected: string;
  onAnswer: (answer: ItemAnswer) => void;
}) {
  const transcriber = useMemo(
    () => createMockTranscriber(expected),
    [expected],
  );
  return (
    <RecorderButton
      transcriber={transcriber}
      onTranscript={(transcript) => onAnswer({ kind: "spoken", transcript })}
    />
  );
}

export function ComprehensionScreen({
  item,
  imageUrls,
  onAnswer,
}: ScreenProps<ComprehensionItem>) {
  const [selected, setSelected] = useState<string | null>(null);

  const choose = (id: string) => {
    setSelected(id);
    onAnswer({ kind: "choice", selectedId: id });
  };

  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 [@media(max-height:760px)]:gap-3">
      {item.options.map((optionId) => {
        const isSelected = selected === optionId;
        return (
          <button
            key={optionId}
            type="button"
            aria-pressed={isSelected}
            aria-label={ASSESSMENT.pickOne}
            onClick={() => choose(optionId)}
            className={cn(
              "relative mx-auto aspect-square w-full max-w-[clamp(120px,22vh,180px)] overflow-hidden rounded-3xl border-2 bg-card outline-none transition-colors focus-visible:ring-4 focus-visible:ring-ring/50 motion-safe:active:scale-[0.98]",
              isSelected
                ? "border-brand-600 bg-brand-50"
                : "border-slate-200 hover:border-brand-200",
            )}
          >
            <ImageTile
              url={imageUrls[optionId] ?? null}
              className={isSelected ? "bg-brand-50" : ""}
            />
            {isSelected ? (
              <span className="absolute right-2 top-2 flex size-8 animate-in zoom-in-50 items-center justify-center rounded-full bg-brand-600 text-white duration-200">
                <Check aria-hidden className="size-5" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function NamingScreen({
  item,
  imageUrls,
  onAnswer,
}: ScreenProps<NamingItem>) {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:gap-6 [@media(max-height:760px)]:gap-3">
      <div className="size-[clamp(120px,min(34vh,calc(100cqh-335px)),320px)] overflow-hidden rounded-3xl border border-slate-200 bg-card">
        <ImageTile url={imageUrls[item.id] ?? null} />
      </div>
      <Recorder expected={item.accepted_answers[0] ?? ""} onAnswer={onAnswer} />
    </div>
  );
}

export function WordClueScreen({
  item,
  onAnswer,
}: TextScreenProps<WordClueItem>) {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:gap-6 [@media(max-height:760px)]:gap-3">
      <p
        className={cn(
          CARD,
          "text-2xl font-semibold leading-snug text-navy-900",
        )}
      >
        {item.clue}
      </p>
      <Recorder expected={item.accepted_answers[0] ?? ""} onAnswer={onAnswer} />
    </div>
  );
}

export function RepeatScreen({ item, onAnswer }: TextScreenProps<RepeatItem>) {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:gap-6 [@media(max-height:760px)]:gap-3">
      <p
        className={cn(CARD, "text-[28px] font-bold leading-snug text-navy-900")}
      >
        {item.phrase}
      </p>
      <Recorder expected={item.phrase} onAnswer={onAnswer} />
    </div>
  );
}

export function ConversationScreen({
  item,
  onAnswer,
}: TextScreenProps<ConversationItem>) {
  const [chipsVisible, setChipsVisible] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setChipsVisible(true),
      CONVERSATION_CHIP_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const pickChip = (text: string) => {
    setChosen(text);
    onAnswer({ kind: "chip", text });
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 md:gap-6 [@media(max-height:760px)]:gap-3">
      <p
        className={cn(
          CARD,
          "text-2xl font-semibold leading-snug text-navy-900",
        )}
      >
        {item.question}
      </p>
      <Recorder expected={item.example_answers[0] ?? ""} onAnswer={onAnswer} />
      {chipsVisible ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg font-semibold text-navy-900">
            {ASSESSMENT.chipsTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {item.example_answers.map((text) => (
              <button
                key={text}
                type="button"
                aria-pressed={chosen === text}
                onClick={() => pickChip(text)}
                className={cn(
                  "min-h-14 rounded-full border-2 bg-card px-6 text-lg font-medium text-navy-900 outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
                  chosen === text
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200",
                )}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="xl"
          onClick={() => setChipsVisible(true)}
          className="text-brand-700"
        >
          {ASSESSMENT.notSure}
        </Button>
      )}
    </div>
  );
}
