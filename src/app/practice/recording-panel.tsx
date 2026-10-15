"use client";

import {
  ArrowRight, Check, Heart, Keyboard, LoaderCircle, Mic,
  RotateCcw, Send, Volume2,
} from "lucide-react";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import styles from "./practice.module.css";

export type RecordingStatus = "ready" | "starting" | "recording" | "processing" | "correct" | "retry";

type RecordingPanelProps = {
  status: RecordingStatus;
  typing: boolean;
  draft: string;
  answer: string;
  answerSource: "voice" | "text";
  seconds: number;
  mediaStream?: MediaStream | null;
  nextLabel: string;
  allowSkip: boolean;
  onDraft: (value: string) => void;
  onTyping: (value: boolean) => void;
  onSubmit: () => void;
  onStart: () => void;
  onStop: () => void;
  onRetry: () => void;
  onNext: () => void;
  onListen: (text: string) => void;
};

// Shared speaking controls: ready → recording → processing → feedback.
export function RecordingPanel({
  status, typing, draft, answer, answerSource, seconds, mediaStream, nextLabel, allowSkip,
  onDraft, onTyping, onSubmit, onStart, onStop, onRetry, onNext, onListen,
}: RecordingPanelProps) {
  const feedback = status === "correct" || status === "retry";
  const feedbackText = status === "correct" ? "ดีมากค่ะ!" : "ลองอีกครั้งได้นะ";
  const stateText = {
    ready: "พร้อมแล้ว พูดได้เลย",
    starting: "กำลังเปิดไมค์",
    recording: "กำลังฟังคุณ",
    processing: "รอสักครู่นะ",
    correct: "ดีมากค่ะ!",
    retry: "ลองอีกครั้งได้นะ",
  }[status];

  return (
    <section className={styles.recordingPanel} aria-label="พูดคำตอบ" data-typing={typing}>
      <div className={styles.srOnly} role="status" aria-live="polite">{stateText}</div>
      {feedback ? (
        <div className={styles.feedback}>
          <div className={`${styles.feedbackHeading} ${status === "correct" ? styles.success : ""}`}>
            {status === "correct" ? <Check size={32} /> : <Heart size={32} />}
            <h2>{feedbackText}</h2>
          </div>
          <div className={styles.transcript}>
            <span>{answerSource === "voice" ? "ได้ยินว่า" : "คุณตอบว่า"}</span>
            <strong>“{answer}”</strong>
          </div>
          <button className={styles.listen} onClick={() => onListen(`${feedbackText} ${answerSource === "voice" ? "ได้ยินว่า" : "คุณตอบว่า"} ${answer}`)}>
            <Volume2 size={28} /> ฟังผล
          </button>
          <div className={`${styles.actionDock} ${styles.feedbackActions}`}>
            <button className={status === "correct" ? styles.secondary : styles.primary} onClick={onRetry}>
              <RotateCcw size={26} /> ลองอีกครั้ง
            </button>
            {(status === "correct" || allowSkip) && (
              <button className={status === "correct" ? styles.primary : styles.secondary} onClick={onNext}>
                {nextLabel}<ArrowRight size={26} />
              </button>
            )}
          </div>
        </div>
      ) : status === "starting" || status === "processing" ? (
        <div className={styles.waiting}>
          <LoaderCircle size={52} className={styles.spinner} aria-hidden="true" />
          <h2>{stateText}</h2>
          <div className={styles.actionDock}><button className={styles.primary} disabled><LoaderCircle size={26} className={styles.spinner} />{stateText}</button></div>
        </div>
      ) : typing && status !== "recording" ? (
        <form className={styles.typedForm} onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <label htmlFor="practice-answer"><Keyboard size={28} /> พิมพ์ชื่อรูป</label>
          <input id="practice-answer" value={draft} onChange={(event) => onDraft(event.target.value)} placeholder="พิมพ์ที่นี่" autoComplete="off" />
          <button className={styles.listen} type="button" onClick={() => onListen("พิมพ์ชื่อรูป แล้วกดส่งคำตอบ")}><Volume2 size={28} /> ฟังวิธีตอบ</button>
          <div className={styles.actionDock}>
            <button className={styles.primary} disabled={!draft.trim()} type="submit"><Send size={26} /> ส่งคำตอบ</button>
          </div>
          <button className={styles.textButton} type="button" onClick={() => onTyping(false)}><Mic size={26} /> ใช้เสียงแทน</button>
        </form>
      ) : (
        <AIVoiceInput
          recording={status === "recording"}
          duration={seconds}
          mediaStream={mediaStream}
          onStart={onStart}
          onStop={() => onStop()}
          className={styles.voiceInput}
          controlsClassName={`${styles.actionDock} ${styles.voiceControls}`}
          buttonClassName={styles.voiceButton}
          showButtonLabel
        />
      )}
    </section>
  );
}
