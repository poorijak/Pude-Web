import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  photoUrl: string | null;
  className?: string;
}

export function UserAvatar({ name, photoUrl, className }: UserAvatarProps) {
  const base = "size-14 shrink-0 rounded-full";
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt=""
        className={cn(base, "object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        base,
        "flex items-center justify-center bg-brand-100 text-xl font-bold text-brand-700",
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
