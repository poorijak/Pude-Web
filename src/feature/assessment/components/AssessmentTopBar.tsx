"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/shared/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ASSESSMENT } from "@/constants/copy";

interface AssessmentTopBarProps {
  showClose: boolean;
  onExit: () => void;
}

export function AssessmentTopBar({ showClose, onExit }: AssessmentTopBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <header className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div className="justify-self-start">
        <BrandMark />
      </div>
      <p className="hidden text-base text-slate-500 md:block">
        {ASSESSMENT.caption}
      </p>
      <div className="col-start-3 justify-self-end">
        {showClose ? (
          <Button
            type="button"
            variant="outline"
            size="icon-md"
            aria-label={ASSESSMENT.exitLabel}
            onClick={() => setConfirmOpen(true)}
            className="size-12 text-slate-500"
          >
            <X aria-hidden className="size-6" strokeWidth={1.75} />
          </Button>
        ) : null}
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-5 rounded-3xl p-8 sm:max-w-md"
        >
          <DialogTitle className="text-2xl font-bold text-navy-900">
            {ASSESSMENT.exitTitle}
          </DialogTitle>
          <DialogDescription className="text-lg text-slate-500">
            {ASSESSMENT.exitBody}
          </DialogDescription>
          <div className="flex flex-col gap-3">
            <Button size="xl" onClick={() => setConfirmOpen(false)}>
              {ASSESSMENT.exitContinue}
            </Button>
            <Button size="xl" variant="secondary" onClick={onExit}>
              {ASSESSMENT.exitLeave}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
