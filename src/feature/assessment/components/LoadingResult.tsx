import { Loader2 } from "lucide-react";
import { ASSESSMENT } from "@/constants/copy";

export function LoadingResult() {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-5 py-24 text-center"
    >
      <Loader2 aria-hidden className="size-14 animate-spin text-primary" />
      <p className="text-2xl font-bold">{ASSESSMENT.loadingResult}</p>
    </div>
  );
}
