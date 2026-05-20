"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sidebarNavItems } from "@/lib/docs-config";
import { cn } from "@/lib/utils";

export function DocsPager() {
  const pathname = usePathname();

  const allItems = sidebarNavItems.flatMap((group) => group.items);
  const activeIndex = allItems.findIndex((item) => item.href === pathname);

  const prev = activeIndex > 0 ? allItems[activeIndex - 1] : null;
  const next = activeIndex < allItems.length - 1 ? allItems[activeIndex + 1] : null;

  if (activeIndex === -1) return null;

  return (
    <div className="flex items-center justify-between mt-16 pt-8 border-t border-border/40">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 transition-colors"
        >
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
            <ChevronLeft className="size-3" />
            Previous
          </div>
          <span className="text-sm font-bold uppercase tracking-tighter">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 transition-colors text-right"
        >
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
            Next
            <ChevronRight className="size-3" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tighter">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
