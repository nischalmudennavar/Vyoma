"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaneItemContainerProps {
  /** The text displayed in the header */
  title: string;
  /** An icon component to render next to the title */
  icon?: ReactNode;
  /** The content to render inside the section body */
  children: ReactNode;
  /** Optional theme color class for the icon (e.g., 'text-primary', 'text-orange-400') */
  iconThemeClass?: string;
  /** Optional theme color class for the left border (e.g., 'border-primary/30', 'border-orange-400/30') */
  borderThemeClass?: string;
  /** Additional classes for the outer wrapper */
  className?: string;
}

/**
 * A standardized container for individual sections within layout panels.
 * Enforces the "Technical Brutalism" aesthetic with consistent borders, spacing, and typography.
 */
export function PaneItemContainer({
  title,
  icon,
  children,
  iconThemeClass = "text-primary",
  borderThemeClass = "border-primary/30",
  className,
}: PaneItemContainerProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-2">
        {icon && <div className={iconThemeClass}>{icon}</div>}
        <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90">
          {title}
        </h2>
      </div>
      <div
        className={cn(
          "grid gap-4 text-xs bg-muted/20 p-4 border-l-2",
          borderThemeClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}
