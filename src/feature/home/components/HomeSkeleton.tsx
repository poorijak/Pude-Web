import { Skeleton } from "@/components/ui/skeleton";
import { COMMON } from "@/constants/copy";

export function HomeSkeleton() {
  return (
    <main
      aria-busy="true"
      className="mx-auto flex w-full max-w-260 flex-col gap-4 px-4 py-6 md:gap-6 md:px-8"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-12 w-24 rounded-full" />
        <Skeleton className="h-12 w-20 rounded-full" />
      </div>
      <Skeleton className="h-48 rounded-[28px] md:h-36" />
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <Skeleton className="h-44 rounded-3xl" />
        <Skeleton className="h-44 rounded-3xl" />
      </div>
      <p role="status" className="text-center text-label text-muted-foreground">
        {COMMON.loading}
      </p>
    </main>
  );
}
