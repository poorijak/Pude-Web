import { Check } from "lucide-react";
import { ASSESSMENT, CATEGORY_LABEL } from "@/constants/copy";
import { groupByCategory } from "@/lib/assessment/steps";
import { cn } from "@/lib/utils";
import type { PlacementItem } from "@/types/assessment";

interface StepperProps {
  items: PlacementItem[];
  current: number;
}

function Connector({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-0.5 min-w-1.5 flex-1 rounded-full transition-colors duration-500",
        filled ? "bg-brand-500" : "bg-slate-200",
        className,
      )}
    />
  );
}

function Node({
  index,
  current,
  total,
}: {
  index: number;
  current: number;
  total: number;
}) {
  const label = ASSESSMENT.progress(index + 1, total);
  if (index < current) {
    return (
      <span
        title={label}
        className="flex size-4 shrink-0 animate-in zoom-in-50 items-center justify-center rounded-full bg-brand-500 text-white duration-300"
      >
        <Check aria-hidden className="size-2.5" strokeWidth={3.5} />
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  if (index === current) {
    return (
      <span
        aria-current="step"
        title={label}
        className="size-4 shrink-0 rounded-full border-[3px] border-brand-600 bg-card"
      >
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  return (
    <span
      title={label}
      className="flex size-4 shrink-0 items-center justify-center"
    >
      <span className="size-2 rounded-full bg-slate-300" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function pillClass(state: "done" | "active" | "upcoming") {
  return cn(
    "flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[15px] font-medium",
    state === "active" &&
      "border-brand-200 bg-brand-50 font-semibold text-brand-700",
    state === "done" && "border-brand-200 bg-card text-brand-700",
    state === "upcoming" && "border-slate-200 bg-card text-slate-500",
  );
}

/**
 * Three layouts picked by the stepper's own width (container query), so it
 * never overflows regardless of viewport: small = one line, medium = pills,
 * wide = pills with per-item nodes.
 */
export function Stepper({ items, current }: StepperProps) {
  const groups = groupByCategory(items);
  const total = items.length;
  const currentGroup = groups.find((group) => group.indexes.includes(current));
  const stateOf = (indexes: number[]) =>
    indexes.every((index) => index < current)
      ? "done"
      : indexes.includes(current)
        ? "active"
        : "upcoming";

  return (
    <nav aria-label={ASSESSMENT.stepperLabel} className="@container shrink-0">
      <div className="@min-[700px]:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-lg font-semibold text-navy-900">
            {currentGroup ? CATEGORY_LABEL[currentGroup.category] : null}
          </p>
          <p className="shrink-0 text-[15px] text-slate-500">
            {ASSESSMENT.progress(current + 1, total)}
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current + 1}
          className="mt-3 flex gap-1"
        >
          {items.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors duration-500",
                index < current && "bg-brand-500",
                index === current && "bg-brand-600",
                index > current && "bg-slate-200",
              )}
            />
          ))}
        </div>
      </div>

      <ol className="hidden items-center gap-1.5 @min-[700px]:flex @min-[960px]:hidden">
        {groups.map((group, groupIndex) => {
          const state = stateOf(group.indexes);
          const position = group.indexes.indexOf(current) + 1;
          return (
            <li key={group.category} className="contents">
              {groupIndex > 0 ? (
                <Connector filled={state !== "upcoming"} />
              ) : null}
              <span className={pillClass(state)}>
                {state === "done" ? (
                  <Check aria-hidden className="size-4" strokeWidth={2.5} />
                ) : null}
                {CATEGORY_LABEL[group.category]}
                {state === "active" ? (
                  <span>
                    {ASSESSMENT.categoryProgress(
                      position,
                      group.indexes.length,
                    )}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>

      <ol className="hidden items-center @min-[960px]:flex">
        {groups.map((group, groupIndex) => {
          const state = stateOf(group.indexes);
          return (
            <li key={group.category} className="contents">
              {groupIndex > 0 ? (
                <Connector filled={group.indexes[0] <= current} />
              ) : null}
              <span className={pillClass(state)}>
                {state === "done" ? (
                  <Check aria-hidden className="size-4" strokeWidth={2.5} />
                ) : null}
                {CATEGORY_LABEL[group.category]}
              </span>
              {group.indexes.map((index) => (
                <span key={index} className="contents">
                  <Connector filled={index <= current} />
                  <Node index={index} current={current} total={total} />
                </span>
              ))}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
