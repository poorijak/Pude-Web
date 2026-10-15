"use client";

import { Flame } from "lucide-react";
import { ListenButton } from "@/components/shared/ListenButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { HOME } from "@/constants/copy";

interface MilestoneDialogProps {
  open: boolean;
  days: number;
  onClose: () => void;
}

export function MilestoneDialog({ open, days, onClose }: MilestoneDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="items-center rounded-3xl p-8 text-center sm:max-w-md"
      >
        <span className="mx-auto flex size-28 animate-in zoom-in-75 items-center justify-center rounded-full bg-flame-soft duration-700">
          <Flame aria-hidden className="size-16 fill-flame text-flame" />
        </span>
        <DialogTitle className="text-title">
          {HOME.milestoneTitle(days)}
        </DialogTitle>
        <DialogDescription className="text-lg">
          {HOME.milestoneBody}
        </DialogDescription>
        <ListenButton
          text={`${HOME.milestoneTitle(days)} ${HOME.milestoneBody}`}
          className="mx-auto"
        />
        <Button size="xl" onClick={onClose} className="w-full">
          {HOME.milestoneContinue}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
