import { Sprout } from "lucide-react";
import { HOME } from "@/constants/copy";

export function WelcomeBackBanner() {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-brand-200 bg-brand-50 p-5">
      <Sprout
        aria-hidden
        className="size-8 shrink-0 text-brand-600"
        strokeWidth={1.75}
      />
      <div>
        <p className="text-lg font-bold text-navy-900">{HOME.backTitle}</p>
        <p className="text-base text-slate-500">{HOME.backBody}</p>
      </div>
    </div>
  );
}
