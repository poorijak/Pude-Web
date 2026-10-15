"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Sidebar from md up (expanded from lg), bottom nav below md. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [override, setOverride] = useState<boolean | null>(null);

  return (
    <SidebarProvider open={override ?? isDesktop} onOpenChange={setOverride}>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-background pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-8">
        {children}
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}
