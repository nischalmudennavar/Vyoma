"use client";

import { useMemo } from "react";
import {
  getGalacticCoreTrajectory,
  getMoonTrajectory,
  getSunTrajectory,
  getTwilightPhases,
} from "@/lib/astrometry";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { EphemerisTimeline } from "./ephemeris-timeline";

export function EphemerisOverlay() {
  const { viewDate, location, updateTime, updateDate } = useVyomaStore();

  const { trajectories, twilightPhases, bufferStart } = useMemo(() => {
    // Create a buffer starting 24 hours before the current viewDate
    const bufferStartDate = new Date(viewDate);
    bufferStartDate.setHours(0, 0, 0, 0);
    bufferStartDate.setDate(bufferStartDate.getDate() - 1);

    return {
      bufferStart: bufferStartDate,
      trajectories: [
        {
          id: "sun" as const,
          // Since SVG lines don't process CSS vars in the same way standard CSS does inside the 'stroke' attribute
          // without strict `var(--...)` syntax, we'll use currentColor/primary or literal CSS vars.
          color: "var(--color-chart-4)",
          points: getSunTrajectory(
            bufferStartDate,
            location.lat,
            location.lng,
            72,
          ),
        },
        {
          id: "moon" as const,
          color: "var(--color-muted-foreground)",
          points: getMoonTrajectory(
            bufferStartDate,
            location.lat,
            location.lng,
            72,
          ),
        },
        {
          id: "core" as const,
          color: "var(--color-primary)",
          points: getGalacticCoreTrajectory(
            bufferStartDate,
            location.lat,
            location.lng,
            72,
          ),
        },
      ],
      twilightPhases: getTwilightPhases(viewDate, location.lat, location.lng),
    };
  }, [viewDate, location.lat, location.lng]);

  const handleTimeChange = (newTime: Date) => {
    // If dragging crosses a date boundary, update the date as well
    if (
      newTime.getDate() !== viewDate.getDate() ||
      newTime.getMonth() !== viewDate.getMonth() ||
      newTime.getFullYear() !== viewDate.getFullYear()
    ) {
      updateDate(newTime);
    }
    updateTime(newTime.getHours(), newTime.getMinutes());
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[80%] min-w-[600px] max-w-[1000px] h-[120px] rounded-none shadow-2xl bg-background/50 backdrop-blur-xl border border-border">
      <EphemerisTimeline
        activeDate={viewDate}
        currentTime={viewDate}
        trajectories={trajectories}
        twilightPhases={twilightPhases}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
}
