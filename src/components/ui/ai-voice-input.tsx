"use client";

import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./ai-voice-input.module.css";
import { BarVisualizer } from "./bar-visualizer";

export interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
  /** Let the speech-recognition owner control the real recording state. */
  recording?: boolean;
  duration?: number;
  disabled?: boolean;
  controlsClassName?: string;
  buttonClassName?: string;
  showButtonLabel?: boolean;
  mediaStream?: MediaStream | null;
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 15,
  demoMode = false,
  demoInterval = 3000,
  className,
  recording,
  duration,
  disabled = false,
  controlsClassName,
  buttonClassName,
  showButtonLabel = false,
  mediaStream,
}: AIVoiceInputProps) {
  const [internalRecording, setInternalRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [demoDismissed, setDemoDismissed] = useState(false);
  const startedAt = useRef<number | null>(null);
  const controlled = recording !== undefined;
  const active = recording ?? internalRecording;
  const isDemo = demoMode && !controlled && !demoDismissed;
  const time = active ? (duration ?? elapsed) : 0;
  const label = active ? "พูดเสร็จแล้ว" : "เริ่มพูด";
  const barCount = Math.min(96, Math.max(1, Math.floor(visualizerBars) || 48));

  useEffect(() => {
    if (!active || duration !== undefined) return;
    const start = performance.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((performance.now() - start) / 1000));
    }, 250);
    return () => clearInterval(interval);
  }, [active, duration]);

  useEffect(() => {
    if (!isDemo || disabled) return;
    let timeout: ReturnType<typeof setTimeout>;
    function runAnimation() {
      setElapsed(0);
      setInternalRecording(true);
      timeout = setTimeout(() => {
        setInternalRecording(false);
        timeout = setTimeout(runAnimation, 1000);
      }, Math.max(500, demoInterval));
    }
    timeout = setTimeout(runAnimation, 100);
    return () => clearTimeout(timeout);
  }, [isDemo, demoInterval, disabled]);

  function handleClick() {
    if (disabled) return;
    if (isDemo) {
      setDemoDismissed(true);
      setInternalRecording(false);
      setElapsed(0);
      return;
    }
    if (active) {
      const stoppedAfter = duration ?? (startedAt.current === null ? elapsed : Math.floor((performance.now() - startedAt.current) / 1000));
      if (!controlled) setInternalRecording(false);
      startedAt.current = null;
      onStop?.(stoppedAfter);
    } else {
      startedAt.current = performance.now();
      setElapsed(0);
      if (!controlled) setInternalRecording(true);
      onStart?.();
    }
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-xl flex-col items-center gap-4 py-4 text-[#1E3A5F] dark:text-white", className)} data-recording={active}>
      <div className={cn("flex flex-col items-center justify-center gap-4", controlsClassName)}>
        <button
          className={cn(
            "flex size-20 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white transition-colors hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A5F] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-white/10 dark:hover:bg-white/20",
            buttonClassName,
          )}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={isDemo ? "หยุดตัวอย่าง" : label}
          aria-pressed={active}
        >
          {active ? <Square className="size-8" fill="currentColor" aria-hidden="true" /> : <Mic className="size-8" aria-hidden="true" />}
        </button>
        {showButtonLabel && <span className="text-2xl font-semibold">{label}</span>}
      </div>

      <time className="text-xl tabular-nums" aria-label="ระยะเวลาพูด">{formatTime(time)}</time>

      <BarVisualizer
        className={styles.visualizer}
        state={active ? "listening" : undefined}
        mediaStream={active ? mediaStream : null}
        barCount={barCount}
        minHeight={6}
        maxHeight={100}
        demo={isDemo}
        centerAlign
        aria-hidden="true"
      />

      <p className="text-center text-xl" role="status">{active ? "กำลังฟังคุณ" : "แตะเพื่อพูด"}</p>
    </div>
  );
}
