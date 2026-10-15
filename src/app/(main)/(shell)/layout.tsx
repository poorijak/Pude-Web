import { AppShell } from "@/feature/shell/AppShell";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
