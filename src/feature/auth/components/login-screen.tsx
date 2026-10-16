"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  CircleAlert,
  HeartHandshake,
  Loader2,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stories = [
  {
    title: "ทุกคำที่พูด\nคือก้าวที่สำคัญ",
    description: "ค่อย ๆ ฝึกไปด้วยกัน ในจังหวะของคุณอย่างมั่นใจ",
  },
  {
    title: "ไม่ต้องรีบ\nเราฝึกไปด้วยกัน",
    description: "เริ่มจากคำใกล้ตัวในชีวิตประจำวัน ทีละคำ ทีละวัน",
  },
  {
    title: "มีคนข้าง ๆ\nในทุกก้าวของคุณ",
    description: "ชวนผู้ดูแลมาร่วมฝึกและเป็นกำลังใจด้วยกันได้เสมอ",
  },
];

function getErrorMessage(error: string | null) {
  switch (error) {
    case "missing_code":
      return "ยังยืนยันบัญชี Google ไม่สำเร็จ กดเข้าสู่ระบบเพื่อลองอีกครั้งได้เลย";
    case "exchange_failed":
      return "การเข้าสู่ระบบหมดเวลาแล้ว กดเข้าสู่ระบบเพื่อลองอีกครั้งได้เลย";
    case "server_error":
      return "ระบบยังไม่พร้อม ลองเข้าสู่ระบบอีกครั้งในอีกสักครู่";
    default:
      return error
        ? "ยังเข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง หรือให้ผู้ดูแลช่วยได้"
        : null;
  }
}

function LoginWithSearchParams() {
  const searchParams = useSearchParams();
  const returnTo =
    searchParams.get("return_to") || searchParams.get("callBackUrl") || "/";
  return <LoginContent error={searchParams.get("error")} returnTo={returnTo} />;
}

function LoginContent({
  error = null,
  returnTo = "/",
}: {
  error?: string | null;
  returnTo?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [speechNotice, setSpeechNotice] = useState("");
  const errorMessage = getErrorMessage(error);
  const story = stories[storyIndex];

  useEffect(() => {
    const resetLoading = () => setIsLoading(false);
    window.addEventListener("pageshow", resetLoading);
    return () => {
      window.removeEventListener("pageshow", resetLoading);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const targetUrl = apiUrl.startsWith("http")
      ? new URL("/auth/google", apiUrl)
      : new URL("/api/auth/google", window.location.origin);
    targetUrl.searchParams.set("callBackUrl", returnTo);
    window.location.href = targetUrl.toString();
  };

  const listenToInstructions = () => {
    if (!("speechSynthesis" in window)) {
      setSpeechNotice("กดปุ่มเข้าสู่ระบบด้วย Google ให้ผู้ดูแลช่วยได้เลย");
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      "ยินดีต้อนรับกลับมา กดปุ่ม เข้าสู่ระบบด้วย Google เพื่อเริ่มฝึกพูด หากต้องการความช่วยเหลือ ให้ผู้ดูแลช่วยได้เลย",
    );
    speech.lang = "th-TH";
    speech.rate = 0.85;
    speech.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setSpeechNotice(
          "ยังเล่นเสียงไม่ได้ กดเข้าสู่ระบบด้วย Google หรือให้ผู้ดูแลช่วยได้เลย",
        );
      }
    };
    window.speechSynthesis.speak(speech);
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-2">
      {/* Left Column: Login Form */}
      <section
        className="flex min-h-screen flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16"
        aria-labelledby="login-heading"
      >
        {/* Brand Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-85"
            aria-label="Pude หน้าหลัก"
          >
            <AudioLines
              className="h-7 w-7 text-primary"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <span>
              Pude<span className="text-primary">.</span>
            </span>
          </Link>
          <span className="text-xs text-muted-foreground sm:text-sm">
            พื้นที่ฝึกพูดของคุณ
          </span>
        </header>

        {/* Form Body */}
        <div className="mx-auto my-auto w-full max-w-sm space-y-6 py-8">
          <div className="space-y-2">
            <h1
              id="login-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              ยินดีต้อนรับกลับมา
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              วันนี้มาฝึกพูดไปด้วยกันนะ ค่อย ๆ ไปทีละก้าว
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
            onClick={listenToInstructions}
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>กดฟังคำแนะนำด้วยเสียง</span>
          </button>

          {speechNotice && (
            <p
              role="status"
              className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground"
            >
              {speechNotice}
            </p>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
            >
              <CircleAlert
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <Button
            id="google-login-button"
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full gap-3 rounded-lg border-border bg-background text-sm font-medium shadow-xs transition-colors hover:bg-muted"
            disabled={isLoading}
            aria-busy={isLoading}
            onClick={handleGoogleLogin}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                <span>กำลังไปที่ Google...</span>
              </>
            ) : (
              <>
                <Icon
                  icon="devicon:google"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                <span>เข้าสู่ระบบด้วย Google</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            ใช้บัญชี Google ของคุณได้ทันที
            <br />
            เข้าใช้ครั้งแรก ระบบจะสร้างบัญชีให้อัตโนมัติ
          </p>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                การดูแลและสนับสนุน
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground sm:text-sm">
            <HeartHandshake
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-foreground">ให้ผู้ดูแลช่วยได้นะ</p>
              <p className="text-xs text-muted-foreground">
                มีคนข้าง ๆ ร่วมฝึกและเป็นกำลังใจได้ทุกขั้นตอน
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <span>ค่อย ๆ ฝึก ทีละก้าว</span>
        </footer>
      </section>

      {/* Right Column: Hero Visual with Testimonial (Untitled UI style) */}
      <section
        className="relative hidden h-full min-h-screen w-full overflow-hidden bg-muted lg:block"
        aria-label="กำลังใจในการฝึกพูด"
      >
        <Image
          src="/images/auth/speech-practice.jpg"
          alt="ผู้ใหญ่ชาวไทยกำลังฝึกพูดจากบัตรภาพกับผู้ดูแลที่บ้าน"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />

        {/* Dark gradient shade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        {/* Floating Story & Quote Content */}
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14 text-white">
          <div className="space-y-4" aria-live="polite" aria-atomic="true">
            <h2 className="whitespace-pre-line text-3xl font-semibold leading-snug tracking-tight xl:text-4xl">
              {story.title}
            </h2>
            <p className="text-lg text-white/85 xl:text-xl font-normal">
              {story.description}
            </p>
          </div>

          {/* Carousel footer with dots and nav arrows */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/15">
            {/* Pagination Marks */}
            <div
              className="flex items-center gap-2"
              aria-label={`ข้อความที่ ${storyIndex + 1} จาก ${stories.length}`}
            >
              {stories.map((_, index) => (
                <span
                  key={index}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    index === storyIndex ? "w-7 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Carousel Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="ข้อความก่อนหน้า"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-xs transition-colors hover:bg-white/20 active:scale-95"
                onClick={() =>
                  setStoryIndex(
                    (storyIndex + stories.length - 1) % stories.length,
                  )
                }
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="ข้อความถัดไป"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-xs transition-colors hover:bg-white/20 active:scale-95"
                onClick={() => setStoryIndex((storyIndex + 1) % stories.length)}
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function LoginScreen({
  readSearchParams = false,
}: {
  readSearchParams?: boolean;
}) {
  return readSearchParams ? <LoginWithSearchParams /> : <LoginContent />;
}
