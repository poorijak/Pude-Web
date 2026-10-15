import { AudioLines } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/constants/copy";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Extra classes for the wordmark, e.g. to hide it when a sidebar collapses. */
  wordmarkClassName?: string;
}

export function BrandMark({ wordmarkClassName }: BrandMarkProps) {
  return (
    <Link
      href="/"
      aria-label={APP_NAME}
      className="flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
        <AudioLines aria-hidden className="size-6" strokeWidth={1.75} />
      </span>
      <span
        className={cn("text-2xl font-bold text-navy-900", wordmarkClassName)}
      >
        {APP_NAME}
      </span>
    </Link>
  );
}
