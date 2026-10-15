"use client";

import { useMemo, useState } from "react";
import { DAILY_GOAL } from "@/constants/config";
import { HOME } from "@/constants/copy";
import { goalProgress } from "@/lib/home";
import { useMilestoneSeen } from "../hooks/useMilestoneSeen";
import { buildWeek, getStreakStatus, milestoneFor } from "@/lib/streak";
import type { HomeData } from "@/types/home";
import { HeroCard } from "./HeroCard";
import { HomeHeader } from "./HomeHeader";
import { LevelCard } from "./LevelCard";
import { MilestoneDialog } from "./MilestoneDialog";
import { StreakDialog } from "./StreakDialog";
import { TodayCard } from "./TodayCard";
import { WelcomeBackBanner } from "./WelcomeBackBanner";

interface HomeViewProps {
  data: HomeData;
  /** ISO instant the server rendered at; keeps the date logic deterministic. */
  nowIso: string;
}

export function HomeView({ data, nowIso }: HomeViewProps) {
  const { user, today_done, practiced_dates } = data;
  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const status = getStreakStatus(
    user.current_streak,
    user.last_practice_date,
    now,
  );
  const week = useMemo(
    () => buildWeek(practiced_dates, now),
    [practiced_dates, now],
  );
  const goal = goalProgress(today_done);
  const streakActive =
    status.state === "practiced-today" || status.state === "pending-today";
  const milestone =
    status.state === "practiced-today" ? milestoneFor(status.streak) : null;

  const [streakOpen, setStreakOpen] = useState(false);
  const [seen, markSeen] = useMilestoneSeen(milestone);

  const showBanner = today_done === 0 && !streakActive;
  const speech = HOME.greetingSpeech(
    user.name,
    status.streak,
    today_done,
    DAILY_GOAL,
  );

  return (
    <main className="mx-auto flex w-full max-w-260 flex-col gap-4 px-4 md:gap-6 py-6 md:px-8">
      <HomeHeader
        user={user}
        streak={status.streak}
        streakActive={streakActive}
        speech={speech}
        onOpenStreak={() => setStreakOpen(true)}
      />
      {showBanner ? <WelcomeBackBanner /> : null}
      <HeroCard
        level={user.current_level}
        stage={user.current_stage}
        goalReached={goal.reached}
      />
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <LevelCard level={user.current_level} stage={user.current_stage} />
        <TodayCard done={today_done} />
      </div>
      <StreakDialog
        open={streakOpen}
        onOpenChange={setStreakOpen}
        streak={status.streak}
        week={week}
      />
      {milestone !== null ? (
        <MilestoneDialog open={!seen} days={milestone} onClose={markSeen} />
      ) : null}
    </main>
  );
}
