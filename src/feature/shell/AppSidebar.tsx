"use client";

import { BookOpen, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BrandMark } from "@/components/shared/BrandMark";
import { NAV } from "@/constants/copy";

const ITEMS = [
  { href: "/", label: NAV.home, icon: Home },
  { href: "/practice", label: NAV.practice, icon: BookOpen },
] as const;

const LABEL = "group-data-[collapsible=icon]:hidden";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4 group-data-[collapsible=icon]:px-2.5">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-3">
          <BrandMark wordmarkClassName={LABEL} />
          <SidebarTrigger size="icon-md" className="text-slate-500" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 py-2 group-data-[collapsible=icon]:px-2.5">
          <SidebarMenu className="gap-1">
            {ITEMS.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  size="xl"
                  tooltip={label}
                  isActive={
                    href === "/" ? pathname === "/" : pathname.startsWith(href)
                  }
                  render={<Link href={href} />}
                >
                  <Icon aria-hidden strokeWidth={1.75} />
                  <span className={LABEL}>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4 group-data-[collapsible=icon]:px-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* TODO: wire to real sign-out when auth is connected. */}
            <SidebarMenuButton
              size="xl"
              variant="outline"
              tooltip={NAV.logout}
              render={<Link href="/auth" />}
            >
              <LogOut aria-hidden strokeWidth={1.75} />
              <span className={LABEL}>{NAV.logout}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
