"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MicPermission = "unknown" | "granted" | "denied" | "unsupported";
export type RecorderStatus = "idle" | "recording";

const BAR_COUNT = 24;

function isSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

export function useRecorder() {
  const [permission, setPermission] = useState<MicPermission>("unknown");
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() =>
    Array(BAR_COUNT).fill(0),
  );

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const cleanup = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    frameRef.current = null;
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setLevels(Array(BAR_COUNT).fill(0));
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const requestPermission = useCallback(async (): Promise<MicPermission> => {
    if (!isSupported()) {
      setPermission("unsupported");
      return "unsupported";
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermission("granted");
      return "granted";
    } catch {
      setPermission("denied");
      return "denied";
    }
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (!isSupported()) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.start();
      recorderRef.current = recorder;

      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      context.createMediaStreamSource(stream).connect(analyser);
      audioContextRef.current = context;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const draw = () => {
        analyser.getByteFrequencyData(data);
        setLevels(
          Array.from(
            { length: BAR_COUNT },
            (_, i) => data[i % data.length] / 255,
          ),
        );
        frameRef.current = requestAnimationFrame(draw);
      };
      draw();

      setElapsed(0);
      timerRef.current = window.setInterval(
        () => setElapsed((value) => value + 1),
        1000,
      );
      setStatus("recording");
      return true;
    } catch {
      cleanup();
      setPermission("denied");
      return false;
    }
  }, [cleanup]);

  const stop = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      const finish = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder?.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        cleanup();
        setStatus("idle");
        resolve(blob);
      };
      if (!recorder || recorder.state === "inactive") {
        finish();
        return;
      }
      recorder.onstop = finish;
      recorder.stop();
    });
  }, [cleanup]);

  return {
    permission,
    status,
    elapsed,
    levels,
    requestPermission,
    start,
    stop,
  };
}
