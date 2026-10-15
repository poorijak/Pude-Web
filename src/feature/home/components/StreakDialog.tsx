"use client";

import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { COMMON, HOME } from "@/constants/copy";
import { useIsMobile } from "@/hooks/use-mobile";
import { nextMilestone, type WeekDay } from "@/lib/streak";
import { cn } from "@/lib/utils";

interface StreakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streak: number;
  week: WeekDay[];
}

function StreakBody({
  streak,
  week,
  onClose,
}: {
  streak: number;
  week: WeekDay[];
  onClose: () => void;
}) {
  const target = nextMilestone(streak);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex size-14 items-center justify-center rounded-full bg-flame-soft">
          <Flame aria-hidden className="size-8 fill-flame text-flame" />
        </span>
        <div>
          <p className="text-stat">{HOME.streakDays(streak)}</p>
          <p className="text-base text-muted-foreground">
            {target === null
              ? HOME.streakHintTop
              : HOME.streakHint(target - streak, target)}
          </p>
        </div>
      </div>
      <ol className="grid grid-cols-7 gap-1.5">
        {week.map((day, index) => (
          <li key={day.dateKey} className="flex flex-col items-center gap-1.5">
            <span className="text-base text-muted-foreground">
              {HOME.weekDays[index]}
            </span>
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-full",
                day.practiced ? "bg-flame-soft" : "bg-muted",
                day.isToday && "ring-2 ring-primary",
              )}
            >
              {day.practiced ? (
                <Flame
                  aria-label={HOME.streakLegendPracticed}
                  className="size-5 fill-flame text-flame"
                />
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      <p className="flex flex-wrap gap-x-5 text-base text-muted-foreground">
        <span className="flex items-center gap-2">
          <Flame aria-hidden className="size-4 fill-flame text-flame" />
          {HOME.streakLegendPracticed}
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-4 rounded-full ring-2 ring-primary"
          />
          {HOME.streakLegendToday}
        </span>
      </p>
      <Button
        size="xl"
        variant="secondary"
        onClick={onClose}
        className="w-full"
      >
        {COMMON.close}
      </Button>
    </div>
  );
}

export function StreakDialog({
  open,
  onOpenChange,
  streak,
  week,
}: StreakDialogProps) {
  const isMobile = useIsMobile();
  const close = () => onOpenChange(false);
  const title = HOME.streakDays(streak);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>
          <SheetDescription className="sr-only">
            {HOME.streakLegendPracticed}
          </SheetDescription>
          <StreakBody streak={streak} week={week} onClose={close} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-3xl p-8 sm:max-w-md"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {HOME.streakLegendPracticed}
        </DialogDescription>
        <StreakBody streak={streak} week={week} onClose={close} />
      </DialogContent>
    </Dialog>
  );
}
