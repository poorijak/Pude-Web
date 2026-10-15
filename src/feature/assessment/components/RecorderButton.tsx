"use client";

import { Check, Mic, Square } from "lucide-react";
import { useState } from "react";
import { ASSESSMENT } from "@/constants/copy";
import type { Transcriber } from "@/lib/speech/transcribe";
import { useRecorder } from "../hooks/useRecorder";

interface RecorderButtonProps {
  transcriber: Transcriber;
  onTranscript: (transcript: string) => void;
}

type Phase = "ready" | "recording" | "processing" | "done";

const MIC_BUTTON =
  "flex size-20 items-center justify-center rounded-full bg-brand-600 text-white shadow-card outline-none transition-transform hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-ring/50 active:scale-[0.98] [@media(max-height:760px)]:size-18";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function RecorderButton({
  transcriber,
  onTranscript,
}: RecorderButtonProps) {
  const recorder = useRecorder();
  const [phase, setPhase] = useState<Phase>("ready");
  const [heard, setHeard] = useState("");

  const begin = async () => {
    if (await recorder.start()) setPhase("recording");
  };

  const finish = async () => {
    setPhase("processing");
    const audio = await recorder.stop();
    const transcript = await transcriber.transcribe(audio);
    setHeard(transcript);
    onTranscript(transcript);
    setPhase("done");
  };

  if (phase === "recording") {
    return (
      <div className="flex flex-col items-center gap-3" aria-live="polite">
        <p className="flex items-baseline gap-3 text-lg font-semibold text-navy-900">
          {ASSESSMENT.recording}
          <span className="text-2xl font-bold tabular-nums">
            {formatTime(recorder.elapsed)}
          </span>
        </p>
        <div aria-hidden className="flex h-10 items-center gap-1">
          {recorder.levels.map((level, index) => (
            <span
              key={index}
              className="w-1.5 rounded-full bg-brand-500 transition-[height] duration-100"
              style={{ height: `${Math.max(8, level * 40)}px` }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={finish}
          aria-label={ASSESSMENT.tapToStop}
          className={MIC_BUTTON}
        >
          <Square aria-hidden className="size-7 fill-current" />
        </button>
        <p className="text-base text-slate-500">{ASSESSMENT.tapToStop}</p>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <p
        role="status"
        className="py-6 text-center text-xl font-semibold text-navy-900"
      >
        {ASSESSMENT.processing}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={begin}
        aria-label={
          phase === "done" ? ASSESSMENT.speakAgain : ASSESSMENT.tapToSpeak
        }
        className={MIC_BUTTON}
      >
        <Mic aria-hidden className="size-9" strokeWidth={1.75} />
      </button>
      {phase === "done" ? (
        <>
          <p
            role="status"
            className="flex items-center gap-2 text-lg font-semibold text-success-foreground"
          >
            <Check aria-hidden className="size-5" />
            {ASSESSMENT.heard(heard)}
          </p>
          <p className="text-base text-slate-500">{ASSESSMENT.speakAgain}</p>
        </>
      ) : (
        <p className="text-base text-slate-500">{ASSESSMENT.tapToSpeak}</p>
      )}
    </div>
  );
}
