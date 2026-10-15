import { Clock, Ear, Eye, ListChecks, Mic } from "lucide-react";
import { ListenButton } from "@/components/shared/ListenButton";
import { ASSESSMENT } from "@/constants/copy";
import { AssessmentButton, ASSESSMENT_BUTTON_WIDTH } from "./AssessmentButton";

const TILE_ICONS = [Ear, Eye, Mic] as const;

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col items-center gap-8 text-center">
      <ul className="grid w-full grid-cols-3 gap-3">
        {ASSESSMENT.introTiles.map((label, index) => {
          const Icon = TILE_ICONS[index];
          return (
            <li
              key={label}
              className="flex flex-col items-center gap-2 rounded-3xl bg-brand-50 p-4 text-lg font-semibold text-brand-700"
            >
              <Icon aria-hidden className="size-9" strokeWidth={1.75} />
              {label}
            </li>
          );
        })}
      </ul>
      <h1 className="text-3xl font-bold leading-snug text-navy-900">
        {ASSESSMENT.introTitle}
      </h1>
      <ListenButton
        text={ASSESSMENT.introSpeech}
        label={ASSESSMENT.introListen}
        className={ASSESSMENT_BUTTON_WIDTH}
      />
      <ul className="flex flex-wrap justify-center gap-3 text-lg">
        <li className="flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-brand-700">
          <ListChecks aria-hidden className="size-5" />
          {ASSESSMENT.itemCount}
        </li>
        <li className="flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-brand-700">
          <Clock aria-hidden className="size-5" />
          {ASSESSMENT.duration}
        </li>
      </ul>
      <AssessmentButton onClick={onStart}>{ASSESSMENT.start}</AssessmentButton>
    </div>
  );
}
