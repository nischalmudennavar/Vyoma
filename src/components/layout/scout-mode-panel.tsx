"use client";

import { useEffect, useState } from "react";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { getNextGCObservationWindow, type ObservationWindow } from "@/lib/astrometry";
import { Button } from "@/components/ui/button";
import { FastForward, Info, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScoutModePanel() {
  const { viewDate, location, updateDate } = useVyomaStore();
  const [window, setWindow] = useState<ObservationWindow | null>(null);

  useEffect(() => {
    // Calculate the next window whenever date or location changes
    const result = getNextGCObservationWindow(viewDate, location.lat, location.lng);
    setWindow(result);
  }, [viewDate, location.lat, location.lng]);

  if (!window || !window.start || !window.end) {
    return (
      <div className="bg-muted/10 border border-border/40 p-4 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Scout Analysis
          </span>
        </div>
        <p className="text-xs text-muted-foreground/60 italic">
          No optimal GC window found in the next 48 hours for this location.
        </p>
      </div>
    );
  }

  const isCurrentlyInWindow = viewDate >= window.start && viewDate <= window.end;
  const timeUntilStart = window.start.getTime() - viewDate.getTime();
  const hoursUntil = Math.floor(timeUntilStart / (1000 * 60 * 60));
  const minutesUntil = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const handleJump = () => {
    if (window.start) {
      // Update global store to the start of the window
      // Note: use-vyoma-store has updateDate but it preserves hours/mins? 
      // Actually updateDate in store sets Year/Month/Day but preserves time.
      // We might need a full setViewDate or use updateDate + updateTime.
      
      // Let's use updateDate then updateTime (hacky but works with current store)
      updateDate(window.start);
      useVyomaStore.getState().updateTime(window.start.getHours(), window.start.getMinutes());
    }
  };

  return (
    <div className={cn(
      "border p-4 space-y-4 transition-colors",
      isCurrentlyInWindow 
        ? "bg-primary/10 border-primary/50" 
        : "bg-background border-border/60"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className={cn("w-4 h-4", isCurrentlyInWindow ? "text-primary" : "text-muted-foreground")} />
          <h3 className="text-[10px] font-black uppercase tracking-widest">
            {isCurrentlyInWindow ? "Optimal Window Active" : "Next Observation Window"}
          </h3>
        </div>
        {!isCurrentlyInWindow && (
          <span className="font-mono text-[10px] text-muted-foreground font-bold">
            IN {hoursUntil > 0 ? `${hoursUntil}H ` : ""}{minutesUntil}M
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black tabular-nums">
            {formatTime(window.start)}
          </span>
          <span className="text-muted-foreground text-xs">—</span>
          <span className="text-xl font-bold tabular-nums text-muted-foreground">
            {formatTime(window.end)}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
          {window.start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>

      {!isCurrentlyInWindow && (
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full h-8 text-[10px] font-black uppercase tracking-widest gap-2"
          onClick={handleJump}
        >
          <FastForward className="w-3.5 h-3.5" />
          Jump to Window
        </Button>
      )}
    </div>
  );
}
