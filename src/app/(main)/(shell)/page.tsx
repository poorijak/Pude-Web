import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { HomeError } from "@/feature/home/components/HomeError";
import { HomeSkeleton } from "@/feature/home/components/HomeSkeleton";
import { HomeView } from "@/feature/home/components/HomeView";
import { getEntryPath } from "@/lib/routing";
import { toThaiDateKey } from "@/lib/streak";
import type { HomeData } from "@/types/home";
import type { User } from "@/types/user";

// MOCK DATA: delete when connecting the database
type MockState =
  | "default"
  | "missed"
  | "goal-done"
  | "milestone-7"
  | "new-user"
  | "loading"
  | "error";
const MOCK_STATE = "default" as MockState;

const daysAgo = (days: number, now: Date): string =>
  toThaiDateKey(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));

const mockUser = (now: Date): User => ({
  id: "mock-user",
  name: "สมชาย",
  surname: "ใจดี",
  profile_photo_url: null,
  current_level: 2,
  current_stage: 3,
  current_streak: 4,
  longest_streak: 9,
  last_practice_date: daysAgo(1, now),
});

const mockHome = (
  now: Date,
): Record<"default" | "missed" | "goal-done" | "milestone-7", HomeData> => {
  const ago = (days: number) => daysAgo(days, now);
  const user = mockUser(now);
  return {
    default: {
      user,
      today_done: 2,
      practiced_dates: [ago(3), ago(2), ago(1), ago(0)],
    },
    missed: {
      user: { ...user, current_streak: 5, last_practice_date: ago(3) },
      today_done: 0,
      practiced_dates: [ago(6), ago(5), ago(4), ago(3)],
    },
    "goal-done": {
      user: { ...user, last_practice_date: ago(0) },
      today_done: 5,
      practiced_dates: [ago(3), ago(2), ago(1), ago(0)],
    },
    "milestone-7": {
      user: { ...user, current_streak: 7, last_practice_date: ago(0) },
      today_done: 3,
      practiced_dates: [ago(6), ago(5), ago(4), ago(3), ago(2), ago(1), ago(0)],
    },
  };
};
// END MOCK DATA

async function HomeContent() {
  await connection();
  const now = new Date();
  if (MOCK_STATE === "loading") {
    return <HomeSkeleton />;
  }
  if (MOCK_STATE === "error") {
    return <HomeError />;
  }
  if (MOCK_STATE === "new-user") {
    redirect(getEntryPath(false));
  }

  return (
    <HomeView data={mockHome(now)[MOCK_STATE]} nowIso={now.toISOString()} />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
