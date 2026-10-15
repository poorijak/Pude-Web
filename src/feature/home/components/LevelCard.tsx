import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { HOME } from "@/constants/copy";
import { stageSegments, stagesToNextLevel } from "@/lib/home";
import { cn } from "@/lib/utils";
import type { Level, Stage } from "@/types/user";

interface LevelCardProps {
  level: Level;
  stage: Stage;
}

function StepIllustration() {
  return (
    <svg aria-hidden viewBox="0 0 64 56" className="h-14 w-16 shrink-0">
      <rect
        x="2"
        y="32"
        width="16"
        height="22"
        rx="5"
        className="fill-brand-200"
      />
      <rect
        x="24"
        y="18"
        width="16"
        height="36"
        rx="5"
        className="fill-brand-500"
      />
      <rect
        x="46"
        y="3"
        width="16"
        height="51"
        rx="5"
        fill="none"
        strokeWidth="2.5"
        strokeDasharray="5 4"
        className="stroke-brand-500"
      />
    </svg>
  );
}

export function LevelCard({ level, stage }: LevelCardProps) {
  const remaining = stagesToNextLevel(level, stage);
  return (
    <SurfaceCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] text-slate-500">{HOME.levelTitle}</p>
          <p className="mt-1 text-[28px] font-bold leading-snug tabular-nums text-navy-900">
            {HOME.levelStage(level, stage)}
          </p>
        </div>
        <StepIllustration />
      </div>
      <ol aria-hidden className="flex gap-1.5">
        {stageSegments(stage).map((fill, index) => (
          <li
            key={index}
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-100"
          >
            <span
              className={cn(
                "block h-full origin-left animate-grow-x rounded-full bg-brand-500",
                fill === "done" && "w-full",
                fill === "current" && "w-1/2",
                fill === "upcoming" && "w-0",
              )}
            />
          </li>
        ))}
      </ol>
      <p className="text-[15px] text-slate-500">
        {remaining === null ? HOME.topLevel : HOME.toNext(remaining, level + 1)}
      </p>
    </SurfaceCard>
  );
}
