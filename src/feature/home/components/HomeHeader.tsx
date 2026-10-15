import { ListenButton } from "@/components/shared/ListenButton";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { HOME } from "@/constants/copy";
import type { User } from "@/types/user";
import { StreakBadge } from "./StreakBadge";

interface HomeHeaderProps {
  user: User;
  streak: number;
  streakActive: boolean;
  speech: string;
  onOpenStreak: () => void;
}

export function HomeHeader({
  user,
  streak,
  streakActive,
  speech,
  onOpenStreak,
}: HomeHeaderProps) {
  return (
    <header className="flex items-center gap-4">
      <UserAvatar name={user.name} photoUrl={user.profile_photo_url} />
      <div className="min-w-0 flex-1">
        <p className="text-base text-slate-500">{HOME.hello}</p>
        <h1 className="truncate text-[28px] font-bold text-navy-900">
          {HOME.mister(user.name)}
        </h1>
      </div>
      <ListenButton text={speech} label={HOME.listenShort} compact />
      <StreakBadge
        streak={streak}
        active={streakActive}
        onClick={onOpenStreak}
      />
    </header>
  );
}
