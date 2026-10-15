import { cn } from "@/lib/utils";

export function SurfaceCard({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-card p-5 shadow-card transition-shadow md:hover:-translate-y-0.5 md:hover:shadow-card-hover motion-safe:transition-[transform,box-shadow] motion-safe:duration-200",
        className,
      )}
      {...props}
    />
  );
}
