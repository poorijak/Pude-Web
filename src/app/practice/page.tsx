"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, Eye, Home, ImageIcon, Lightbulb,
  MessageCircle, RotateCcw, Volume2,
} from "lucide-react";
import { PracticePicture } from "./practice-picture";
import { RecordingPanel, type RecordingStatus } from "./recording-panel";
import styles from "./practice.module.css";

type Phase = "naming" | "copy" | "recall";
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type Attempt = {
  question: string;
  phase: Phase;
  hintLevel: number;
  correct: boolean;
  source: "voice" | "text";
  answer: string;
  at: string;
};
const questions = [
  { answer: "นาฬิกา", accepted: ["นาฬิกา", "นาฬิกาปลุก"], hints: ["ของใช้ สำหรับดูเวลา", "ขึ้นต้นว่า นา", "นาฬิกา"] },
  { answer: "แอปเปิล", accepted: ["แอปเปิล", "แอปเปิ้ล"], hints: ["ผลไม้ชนิดหนึ่ง", "ขึ้นต้นว่า แอป", "แอปเปิล"] },
  { answer: "แมว", accepted: ["แมว"], hints: ["สัตว์เลี้ยง ร้องเหมียว", "เริ่มด้วยเสียง ม", "แมว"] },
];
const hintTitles = ["หมวดหมู่", "เสียงแรก", "ฟังคำเต็ม"];

function saveAttempt(attempt: Attempt) {
  // Prototype history stays on this device; no backend or clinical scoring.
  try {
    const key = "pude:picture-naming:attempts";
    const previous: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    const history = Array.isArray(previous) ? previous : [];
    localStorage.setItem(key, JSON.stringify([...history, attempt].slice(-100)));
  } catch {
    // Practice remains available when browser storage is disabled.
  }
}

export default function PracticePage() {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<RecordingStatus>("ready");
  const [phase, setPhase] = useState<Phase>("naming");
  const [hintLevel, setHintLevel] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answerSource, setAnswerSource] = useState<"voice" | "text">("voice");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [notice, setNotice] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const microphone = useRef<MediaStream | null>(null);
  const captureRequest = useRef(0);
  const recognition = useRef<Recognition | null>(null);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitting = useRef(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const responseColumn = useRef<HTMLDivElement>(null);
  const hintCard = useRef<HTMLElement>(null);
  const question = questions[index];
  const busy = status === "starting" || status === "recording" || status === "processing";
  const title = phase === "copy" ? "พูดตามคำนี้" : phase === "recall" ? "จำได้ไหม?" : "รูปนี้คืออะไร?";
  const instruction = phase === "copy"
    ? `พูดตามคำนี้ ${question.answer} หรือพิมพ์ตามได้ค่ะ`
    : phase === "recall" ? "ลองพูดชื่อภาพเมื่อกี้ หรือพิมพ์จากความจำได้ค่ะ" : "รูปนี้คืออะไร แตะไมค์ แล้วพูดชื่อรูป";
  const completedCount = finished ? questions.length : index + (status === "correct" && phase !== "copy" ? 1 : 0);

  function releaseMicrophone() {
    microphone.current?.getTracks().forEach((track) => track.stop());
    microphone.current = null;
    setMediaStream(null);
  }

  function closeRecognition() {
    captureRequest.current += 1;
    releaseMicrophone();
    const current = recognition.current;
    recognition.current = null;
    if (current) {
      current.onstart = null;
      current.onresult = null;
      current.onerror = null;
      current.onend = null;
      current.abort();
    }
    if (stopTimer.current) clearTimeout(stopTimer.current);
  }

  useEffect(() => () => {
    closeRecognition();
    if (processingTimer.current) clearTimeout(processingTimer.current);
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (status !== "recording") return;
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    questionHeading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [index, phase, finished]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 699px)").matches && (status !== "ready" || notice)) {
      responseColumn.current?.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [status, notice]);

  useEffect(() => {
    if (hintLevel > 0 && window.matchMedia("(max-width: 699px)").matches) {
      hintCard.current?.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [hintLevel]);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setNotice("เครื่องนี้ยังอ่านเสียงไม่ได้ค่ะ");
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "th-TH";
    speech.rate = 0.8;
    const thaiVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith("th"));
    if (thaiVoice) speech.voice = thaiVoice;
    speech.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") setNotice("ยังเปิดเสียงไม่ได้ค่ะ");
    };
    window.speechSynthesis.speak(speech);
  }

  function resetAnswer() {
    closeRecognition();
    if (processingTimer.current) clearTimeout(processingTimer.current);
    window.speechSynthesis?.cancel();
    submitting.current = false;
    setStatus("ready");
    setAnswer("");
    setDraft("");
    setNotice("");
    setSeconds(0);
  }

  function beginCopy() {
    resetAnswer();
    setTyping(false);
    setPhase("copy");
  }

  function checkAnswer(value: string, source: "voice" | "text") {
    if (!value.trim() || submitting.current) return;
    submitting.current = true;
    closeRecognition();
    setAnswer(value.trim());
    setAnswerSource(source);
    setStatus("processing");
    setNotice("");
    processingTimer.current = setTimeout(() => {
      const normalized = value.normalize("NFC").replace(/[\s.!?。]/g, "");
      const correct = question.accepted.includes(normalized);
      saveAttempt({ question: question.answer, phase, hintLevel, correct, source, answer: value.trim(), at: new Date().toISOString() });
      submitting.current = false;
      if (!correct && phase === "naming" && hintLevel === 3) {
        beginCopy();
        return;
      }
      setStatus(correct ? "correct" : "retry");
      if (correct) setTyping(false);
    }, 650);
  }

  async function startRecording() {
    if (busy) return;
    const browser = window as typeof window & {
      SpeechRecognition?: new () => Recognition;
      webkitSpeechRecognition?: new () => Recognition;
    };
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Constructor) {
      setNotice("ใช้พิมพ์แทนได้ค่ะ");
      setTyping(true);
      return;
    }
    window.speechSynthesis?.cancel();
    closeRecognition();
    const request = captureRequest.current;
    setNotice("");
    setSeconds(0);
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      // Permission may resolve after the user has left this screen.
      if (request !== captureRequest.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      microphone.current = stream;
      setMediaStream(stream);
    } catch {
      if (request !== captureRequest.current) return;
      setStatus("ready");
      setNotice("เปิดไมค์ไม่ได้ พิมพ์แทนได้ค่ะ");
      setTyping(true);
      return;
    }
    let current: Recognition;
    try { current = new Constructor(); }
    catch {
      closeRecognition();
      setStatus("ready");
      setTyping(true);
      setNotice("ใช้พิมพ์แทนได้ค่ะ");
      return;
    }
    recognition.current = current;
    current.lang = "th-TH";
    current.interimResults = false;
    current.continuous = false;
    current.onstart = () => setStatus("recording");
    current.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text?.trim()) checkAnswer(text, "voice");
    };
    current.onerror = (event) => {
      closeRecognition();
      setStatus("ready");
      setNotice(event.error === "not-allowed" ? "เปิดไมค์ หรือพิมพ์แทนได้ค่ะ" : "ได้ยินไม่ชัด ลองใหม่นะคะ");
      if (event.error === "not-allowed") setTyping(true);
    };
    current.onend = () => {
      closeRecognition();
      if (!submitting.current) {
        setStatus("ready");
        setNotice("ได้ยินไม่ชัด ลองใหม่นะคะ");
      }
    };
    setNotice("");
    setSeconds(0);
    setStatus("starting");
    try { current.start(); }
    catch {
      closeRecognition();
      setStatus("ready");
      setNotice("ใช้พิมพ์แทนได้ค่ะ");
      setTyping(true);
    }
  }

  function stopRecording() {
    releaseMicrophone();
    setStatus("processing");
    // Recover if a browser does not deliver an end/result event after stopping.
    stopTimer.current = setTimeout(() => {
      closeRecognition();
      if (!submitting.current) {
        setStatus("ready");
        setNotice("ได้ยินไม่ชัด ลองใหม่นะคะ");
      }
    }, 8000);
    recognition.current?.stop();
  }

  function next() {
    resetAnswer();
    setTyping(false);
    if (phase === "copy" && status === "correct") {
      setPhase("recall");
      return;
    }
    setHintLevel(0);
    setPhase("naming");
    if (index === questions.length - 1) setFinished(true);
    else setIndex(index + 1);
  }

  function showNextHint() {
    resetAnswer();
    setHintLevel((level) => Math.min(level + 1, 3));
  }

  return (
    <div className={styles.page} lang="th" data-finished={finished}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={28} /> กลับ</Link>
        <span className={styles.featureTitle}><ImageIcon size={30} /> พูดชื่อภาพ</span>
        <span className={styles.headerCount}>{finished ? questions.length : index + 1} / {questions.length}</span>
      </header>

      <main className={styles.main}>
        <div className={styles.progressRow}>
          <span>{finished ? "ฝึกครบแล้ว" : `ภาพที่ ${index + 1} จาก ${questions.length}`}</span>
          <div className={styles.progress} role="progressbar" aria-label="ภาพที่ฝึกแล้ว" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={completedCount}>
            <span style={{ width: `${completedCount / questions.length * 100}%` }} />
          </div>
        </div>

        {finished ? (
          <section className={styles.complete}>
            <div className={styles.celebration} aria-hidden="true"><Check size={64} />{[0, 1, 2, 3, 4, 5].map((item) => <i key={item} />)}</div>
            <h1 ref={questionHeading} tabIndex={-1}>วันนี้เก่งมากค่ะ!</h1>
            <p>ฝึกแล้ว {questions.length} ภาพ</p>
            <button className={styles.listen} onClick={() => speak(`วันนี้เก่งมากค่ะ ฝึกแล้ว ${questions.length} ภาพ`)}><Volume2 size={28} /> ฟังผล</button>
            <Link href="/" className={styles.primary}><Home size={28} /> กลับหน้าหลัก</Link>
            <button className={styles.textButton} onClick={() => { resetAnswer(); setIndex(0); setHintLevel(0); setPhase("naming"); setTyping(false); setFinished(false); }}><RotateCcw size={26} /> ฝึกอีกครั้ง</button>
          </section>
        ) : (
          <>
            {phase !== "naming" && (
              <ol className={styles.steps} aria-label="ขั้นตอนช่วยฝึก">
                <li aria-current={phase === "copy" ? "step" : undefined}><span>{phase === "recall" ? <Check size={22} /> : "1"}</span> พูดตาม</li>
                <li aria-current={phase === "recall" ? "step" : undefined}><span>2</span> พูดจากความจำ</li>
              </ol>
            )}
            <div className={styles.questionHeading}>
              <h1 ref={questionHeading} tabIndex={-1}>{title}</h1>
              <button className={styles.questionAudio} type="button" aria-label="ฟังคำสั่ง" title="ฟังคำสั่ง" disabled={busy} onClick={() => speak(instruction)}><Volume2 size={28} aria-hidden="true" /></button>
            </div>
            <div className={styles.exerciseGrid}>
              <div className={styles.pictureColumn}>
                <div className={`${styles.pictureCard} ${phase === "recall" ? styles.recallCard : ""} ${status === "correct" ? styles.pictureCorrect : ""}`}>
                  {phase === "recall" ? (
                    <div className={styles.recallPrompt}><MessageCircle size={84} strokeWidth={1.4} /><p>ลองนึกชื่อภาพเมื่อกี้</p></div>
                  ) : (
                    <>
                      <PracticePicture index={index} className={styles.illustration} />
                      {(phase === "copy" || status === "correct") && <strong className={styles.pictureWord}>{question.answer}</strong>}
                    </>
                  )}
                </div>

                {phase === "naming" && status !== "correct" && (
                  <div className={styles.hintArea}>
                    {hintLevel > 0 && (
                      <section ref={hintCard} className={styles.hintCard} aria-label="คำใบ้" aria-live="polite">
                        <span className={styles.hintStep}>คำใบ้ {hintLevel} / 3 · {hintTitles[hintLevel - 1]}</span>
                        <p>{question.hints[hintLevel - 1]}</p>
                        <button className={styles.listen} disabled={busy} onClick={() => speak(question.hints[hintLevel - 1])}><Volume2 size={28} /> ฟังคำใบ้</button>
                      </section>
                    )}
                    <button className={styles.hintButton} disabled={busy} onClick={hintLevel < 3 ? showNextHint : beginCopy}>
                      {hintLevel < 3 ? <Lightbulb size={28} /> : <MessageCircle size={28} />}
                      {hintLevel === 0 ? "ขอคำใบ้" : hintLevel < 3 ? "คำใบ้ถัดไป" : "ฝึกพูดตาม"}
                      <ArrowRight size={26} />
                    </button>
                  </div>
                )}
                {phase === "copy" && <button className={styles.listenWord} disabled={busy} onClick={() => speak(question.answer)}><Volume2 size={30} /> ฟังคำนี้</button>}
                {phase === "recall" && status !== "correct" && <button className={styles.hintButton} disabled={busy} onClick={beginCopy}><Eye size={28} /> ดูคำอีกครั้ง</button>}
              </div>

              <div ref={responseColumn} className={styles.responseColumn}>
                {notice && <div className={styles.notice} role="status"><p>{notice}</p><button className={styles.listen} disabled={busy} onClick={() => speak(notice)}><Volume2 size={28} /> ฟัง</button></div>}
                <RecordingPanel
                  status={status} typing={typing} draft={draft} answer={answer}
                  answerSource={answerSource} seconds={seconds} mediaStream={mediaStream}
                  nextLabel={phase === "copy" ? "ลองจำ" : index === questions.length - 1 ? "เสร็จสิ้น" : "ข้อต่อไป"}
                  allowSkip={phase === "naming"}
                  onDraft={setDraft} onTyping={setTyping}
                  onSubmit={() => checkAnswer(draft, "text")}
                  onStart={startRecording} onStop={stopRecording}
                  onRetry={resetAnswer} onNext={next} onListen={speak}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
