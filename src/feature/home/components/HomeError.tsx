"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { COMMON, HOME } from "@/constants/copy";

export function HomeError() {
  const router = useRouter();
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <h1 className="text-display">{HOME.errorTitle}</h1>
      <p className="text-lg text-muted-foreground">{HOME.errorBody}</p>
      <Button size="xl" onClick={() => router.refresh()} className="w-full">
        {COMMON.retry}
      </Button>
    </main>
  );
}
