"use client";

import { BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/constants/copy";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: NAV.home, icon: Home },
  { href: "/practice", label: NAV.practice, icon: BookOpen },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-slate-200 bg-card px-4 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="flex h-16 flex-1 items-center justify-center outline-none"
          >
            <span
              className={cn(
                "flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[15px] font-medium focus-visible:ring-3",
                active
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-slate-500",
              )}
            >
              <Icon aria-hidden className="size-6" strokeWidth={1.75} />
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
