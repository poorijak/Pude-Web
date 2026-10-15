import { ImageOff } from "lucide-react";
import { ASSESSMENT } from "@/constants/copy";
import { cn } from "@/lib/utils";

interface ImageTileProps {
  url: string | null;
  className?: string;
}

/** Decorative on purpose: `alt=""` so screen readers never reveal answers. */
export function ImageTile({ url, className }: ImageTileProps) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className={cn("size-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-1.5 bg-muted text-slate-500",
        className,
      )}
    >
      <ImageOff
        aria-hidden
        className="size-6 text-slate-500/50"
        strokeWidth={1.5}
      />
      <span className="text-sm">{ASSESSMENT.imageMissing}</span>
    </div>
  );
}
