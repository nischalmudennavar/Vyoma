"use client";

import { ListTree } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  getGalacticCoreTrajectory,
  getMoonTrajectory,
  getSunTrajectory,
  getTwilightPhases,
} from "@/lib/astrometry";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Container } from "@/components/container";
import { EphemerisTimeline } from "./ephemeris-timeline";

export function EphemerisOverlay() {
  const { viewDate, location, updateTime, updateDate } = useVyomaStore();

  const { trajectories, twilightPhases } = useMemo(() => {
    // Create a buffer starting 24 hours before the current viewDate
    const bufferStartDate = new Date(viewDate);
    bufferStartDate.setHours(0, 0, 0, 0);
    bufferStartDate.setDate(bufferStartDate.getDate() - 1);

    return {
      trajectories: [
        {
          id: "sun" as const,
          color: "var(--chart-4)",
          points: getSunTrajectory(
            bufferStartDate,
            location.lat,
            location.lng,
            72,
          ),
        },
        {
          id: "moon" as const,
          color: "var(--muted-foreground)",
          points: getMoonTrajectory(
            bufferStartDate,
            location.lat,
            location.lng,
            72,
          ),
        },
        {
          id: "core" as const,
          color: "var(--primary)",
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
    <Container
      applyUiOpacity
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[80%] min-w-[600px] max-w-[1000px] h-20 rounded-none shadow-2xl bg-background/50 backdrop-blur-xl border border-border group"
    >
      <EphemerisTimeline
        activeDate={viewDate}
        currentTime={viewDate}
        trajectories={trajectories}
        twilightPhases={twilightPhases}
        onTimeChange={handleTimeChange}
      />

      <Link
        href="/timeline"
        className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Button
          variant="secondary"
          size="sm"
          className="h-8 text-[10px] uppercase tracking-widest font-bold"
        >
          <ListTree className="w-3 h-3 mr-2" />
          Detailed Timeline
        </Button>
      </Link>
    </Container>
  );
}
