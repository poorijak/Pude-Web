import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { DAILY_GOAL } from "@/constants/config";
import { HOME } from "@/constants/copy";
import { goalProgress } from "@/lib/home";

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TodayCard({ done }: { done: number }) {
  const { ratio, reached } = goalProgress(done);
  const remaining = Math.max(DAILY_GOAL - done, 0);

  return (
    <SurfaceCard className="flex items-center gap-6">
      <div className="relative size-28 shrink-0">
        <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden>
          <circle
            cx="56"
            cy="56"
            r={RADIUS}
            fill="none"
            strokeWidth="12"
            className="stroke-brand-100"
          />
          <circle
            cx="56"
            cy="56"
            r={RADIUS}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
            style={{ "--ring-length": CIRCUMFERENCE } as React.CSSProperties}
            className="animate-ring-fill stroke-brand-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-stat tabular-nums text-foreground">
          {done}/{DAILY_GOAL}
        </span>
      </div>
      <div>
        {done === 0 ? (
          <>
            <p className="text-stat text-foreground">
              {HOME.todayEmpty}
            </p>
            <p className="text-label text-muted-foreground">{HOME.todayEmptyHint}</p>
          </>
        ) : (
          <>
            <p className="text-label text-muted-foreground">{HOME.todayLabel}</p>
            <p className="text-stat tabular-nums text-foreground">
              {HOME.todayCount(done, DAILY_GOAL)}
            </p>
            <p className="text-label text-brand-700">
              {reached ? HOME.todayGoalReached : HOME.todayRemaining(remaining)}
            </p>
          </>
        )}
      </div>
    </SurfaceCard>
  );
}
