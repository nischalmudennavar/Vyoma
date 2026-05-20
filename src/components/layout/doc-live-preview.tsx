"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface DocLivePreviewProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * A wrapper for documentation pages that shows a live preview of a component.
 * Connects the "Tool" part with the "Docs" part visually.
 */
export function DocLivePreview({
  children,
  title = "Live Status",
  description = "This data is currently synced with your active location and time.",
  className,
}: DocLivePreviewProps) {
  return (
    <div className={cn("my-12 space-y-4", className)}>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="relative flex size-2 items-center justify-center">
            <div className="absolute size-full animate-ping rounded-full bg-primary/40 opacity-75" />
            <div className="relative size-1.5 rounded-full bg-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <Activity className="size-3" />
          Connected to Store
        </div>
      </div>

      <div className="relative group">
        {/* Background glow for the live component */}
        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
        
        <div className="relative bg-background/40 border border-border/40 p-1 md:p-8 backdrop-blur-xs overflow-hidden flex justify-center items-center">
             <div className="w-full max-w-[320px]">
                 {children}
             </div>
        </div>
      </div>

      {description && (
        <p className="px-2 text-[10px] text-muted-foreground italic leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
