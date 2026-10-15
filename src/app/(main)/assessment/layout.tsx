/** Focus mode: no sidebar, no bottom nav. */
export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-dvh overflow-hidden bg-background">{children}</div>;
}
