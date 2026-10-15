"use client";

import { useState } from "react";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";

export function AIVoiceInputDemo() {
  const [recordings, setRecordings] = useState<{ duration: number; timestamp: Date }[]>([]);

  function handleStop(duration: number) {
    setRecordings((previous) => [...previous.slice(-4), { duration, timestamp: new Date() }]);
  }

  return (
    <section className="mx-auto w-full max-w-xl space-y-6 p-6 text-xl" lang="th" aria-label="ตัวอย่างปุ่มรับเสียง">
      <AIVoiceInput onStop={handleStop} showButtonLabel />
      {recordings.length > 0 && (
        <ol className="space-y-3" aria-label="ระยะเวลาที่ทดลอง">
          {recordings.map((recording, index) => (
            <li key={`${recording.timestamp.getTime()}-${index}`}>
              ครั้งที่ {index + 1} · {recording.duration} วินาที
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
