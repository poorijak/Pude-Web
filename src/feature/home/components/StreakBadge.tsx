import { Flame } from "lucide-react";
import { HOME } from "@/constants/copy";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  active: boolean;
  onClick: () => void;
}

export function StreakBadge({ streak, active, onClick }: StreakBadgeProps) {
  const label = active ? HOME.streakDays(streak) : HOME.streakBadgeStart;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-12 min-w-12 items-center justify-center gap-1.5 rounded-full px-4 text-lg font-bold outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]",
        active
          ? "bg-flame-soft text-flame-foreground"
          : "bg-brand-50 text-slate-500",
      )}
    >
      <Flame
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          "size-6",
          active ? "fill-flame text-flame" : "text-slate-500",
        )}
      />
      <span
        key={streak}
        className="animate-in zoom-in-125 tabular-nums duration-300"
      >
        {active ? streak : HOME.streakBadgeStart}
      </span>
    </button>
  );
}
