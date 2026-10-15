import { Check, Play } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HOME } from "@/constants/copy";
import { cn } from "@/lib/utils";
import type { Level, Stage } from "@/types/user";

interface HeroCardProps {
  level: Level;
  stage: Stage;
  goalReached: boolean;
}

export function HeroCard({ level, stage, goalReached }: HeroCardProps) {
  const href = `/practice?level=${level}&stage=${stage}`;

  if (goalReached) {
    return (
      <section className="flex flex-col gap-6 rounded-[28px] border border-success-strong/20 bg-success p-5 text-success-foreground md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-success-strong text-white">
            <Check aria-hidden className="size-7" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-title">
              {HOME.goalHeroTitle}
            </h2>
            <p className="text-label">{HOME.goalRest}</p>
          </div>
        </div>
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: "outline", size: "hero" }),
            "w-full md:w-auto",
          )}
        >
          {HOME.startMore}
        </Link>
      </section>
    );
  }

  return (
    <section className="relative isolate flex flex-col gap-6 overflow-hidden rounded-[28px] bg-brand-600 p-5 text-white md:flex-row md:items-center md:justify-between md:p-6">
      <span
        aria-hidden
        className="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-brand-500/60"
      />
      <span
        aria-hidden
        className="absolute -bottom-28 right-40 -z-10 size-56 rounded-full bg-brand-500/40"
      />
      <div>
        <p className="text-label text-white/90">{HOME.readyLabel}</p>
        <h2 className="mt-1 text-title">
          {HOME.ready}
        </h2>
        <p className="mt-1 text-label text-white/90">
          {HOME.readyDetail(level, stage)}
        </p>
      </div>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "on-brand", size: "hero" }),
          "w-full md:w-auto",
        )}
      >
        <Play aria-hidden className="size-6 fill-current" strokeWidth={1.75} />
        {HOME.start}
      </Link>
    </section>
  );
}
