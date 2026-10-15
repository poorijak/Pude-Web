import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** One shared width for every assessment action: 320px, full column on mobile. */
export const ASSESSMENT_BUTTON_WIDTH = "w-full max-w-full sm:w-80";

export function AssessmentButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="xl"
      className={cn(ASSESSMENT_BUTTON_WIDTH, className)}
      {...props}
    />
  );
}
