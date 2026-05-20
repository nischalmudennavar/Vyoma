"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "@/lib/docs-config";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsSidebarProps {
  /**
   * Optional callback when an item is clicked.
   * Useful for closing mobile menus.
   */
  onItemClick?: () => void;
  /**
   * Additional classes for the sidebar container.
   */
  className?: string;
}

/**
 * Sidebar component for the documentation pages.
 * Adheres to the Swiss Aesthetic: zero radii, high contrast, and rigorous alignment.
 */
export function DocsSidebar({ onItemClick, className }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r border-border/40",
        className,
      )}
    >
      <ScrollArea className="flex-1">
        <div className="py-8 px-6 space-y-10">
          {sidebarNavItems.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-3 select-none">
                {group.title}
              </h4>
              <nav className="flex flex-col space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center h-10 px-4 text-[11px] font-bold transition-all duration-200 relative",
                        "rounded-none uppercase tracking-tight",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-primary/10 border-l-2 border-transparent hover:border-primary/40",
                      )}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground z-20" />
                      )}

                      <span className="relative z-10">{item.title}</span>

                      {/* Hover Indicator Dot */}
                      {!isActive && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="size-1.5 bg-primary" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer / Version Info */}
      <div className="p-6 border-t border-border/40">
        <div className="flex items-center gap-2 grayscale opacity-50 hover:opacity-100 transition-opacity cursor-default">
          <div className="size-3 bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            v1.0.0-alpha
          </span>
        </div>
      </div>
    </div>
  );
}
