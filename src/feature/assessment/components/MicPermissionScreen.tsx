"use client";

import { Mic } from "lucide-react";
import { ThaiLines } from "@/components/shared/ThaiLines";
import { ASSESSMENT, COMMON } from "@/constants/copy";
import type { MicPermission } from "../hooks/useRecorder";
import { AssessmentButton } from "./AssessmentButton";

interface MicPermissionScreenProps {
  permission: MicPermission;
  onRequest: () => void;
}

export function MicPermissionScreen({
  permission,
  onRequest,
}: MicPermissionScreenProps) {
  const blocked = permission === "denied" || permission === "unsupported";
  const title = blocked ? ASSESSMENT.micDeniedTitle : ASSESSMENT.micTitle;
  const bodyLines =
    permission === "unsupported"
      ? ASSESSMENT.micUnsupportedLines
      : blocked
        ? ASSESSMENT.micDeniedBodyLines
        : ASSESSMENT.micBodyLines;

  return (
    <div className="mx-auto flex w-full max-w-120 flex-col items-center gap-8 text-center">
      <span className="flex size-28 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Mic aria-hidden className="size-12" strokeWidth={1.75} />
      </span>
      <h1 className="text-3xl font-bold leading-snug text-navy-900">{title}</h1>
      <ThaiLines
        lines={bodyLines}
        className="text-xl leading-relaxed text-slate-500"
      />
      {permission === "unsupported" ? null : (
        <AssessmentButton onClick={onRequest}>
          {blocked ? COMMON.retry : ASSESSMENT.micAllow}
        </AssessmentButton>
      )}
    </div>
  );
}
