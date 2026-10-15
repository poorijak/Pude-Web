"use client";

import { Volume2 } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { COMMON } from "@/constants/copy";
import { cn } from "@/lib/utils";

interface ListenButtonProps {
  text: string;
  label?: string;
  iconOnly?: boolean;
  /** Short pill used in headers. */
  compact?: boolean;
  variant?: "secondary" | "outline" | "default";
  className?: string;
}

export function ListenButton({
  text,
  label = COMMON.listen,
  iconOnly = false,
  compact = false,
  variant = "secondary",
  className,
}: ListenButtonProps) {
  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }, [text]);

  const size = iconOnly ? "icon-xl" : compact ? "pill" : "xl";

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={speak}
      aria-label={iconOnly ? label : undefined}
      className={cn(className)}
    >
      <Volume2
        aria-hidden
        className={compact ? "size-5" : "size-6"}
        strokeWidth={1.75}
      />
      {iconOnly ? null : label}
    </Button>
  );
}
