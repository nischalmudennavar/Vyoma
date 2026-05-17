"use client";

import { ListTree } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  getGalacticCoreTrajectory,
  getMoonTrajectory,
  getSunTrajectory,
  getTwilightPhases,
} from "@/lib/astrometry";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { EphemerisTimeline } from "./ephemeris-timeline";
// import { Joystick } from "@/components/ui/joystick";

export function EphemerisOverlay() {
  const { viewDate, location, updateTime, updateDate } = useVyomaStore();

  // const [spatialData, setSpatialData] = useState({ x: 0, y: 0 });
  // const [temporalData, setTemporalData] = useState({ x: 0, y: 0 });

  const activeKeys = useRef<Set<string>>(new window.Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Ignore if modifiers are pressed to prevent conflicting with discrete hotkeys
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      activeKeys.current.add(key);

      // Prevent default scrolling/panning for arrow keys
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault();
      }

      // 'r' key to reset map view
      if (key === "r") {
        const store = useVyomaStore.getState();
        store.updateLocation(34.1526, 77.5771, "Ladakh, India");
        store.updateZoom(4);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      const store = useVyomaStore.getState();

      let spatialX = 0;
      let spatialY = 0;
      let zoomDelta = 0;
      let temporalDayDelta = 0;
      let temporalHourDelta = 0;

      if (activeKeys.current.has("a")) spatialX -= 1;
      if (activeKeys.current.has("d")) spatialX += 1;
      if (activeKeys.current.has("w")) spatialY += 1;
      if (activeKeys.current.has("s")) spatialY -= 1;
      if (activeKeys.current.has("q")) zoomDelta -= 1;
      if (activeKeys.current.has("e")) zoomDelta += 1;
      if (activeKeys.current.has("arrowdown")) temporalDayDelta -= 1;
      if (activeKeys.current.has("arrowup")) temporalDayDelta += 1;
      if (activeKeys.current.has("arrowleft")) temporalHourDelta -= 1;
      if (activeKeys.current.has("arrowright")) temporalHourDelta += 1;

      // Update Spatial via WASD
      if (spatialX !== 0 || spatialY !== 0) {
        const currentZoom = store.zoom;
        const speedMultiplier = 0.2 / 1.5 ** currentZoom;

        const deltaLat = spatialY * speedMultiplier * (deltaTime / 16.6);
        const deltaLng = spatialX * speedMultiplier * (deltaTime / 16.6);

        let newLat = store.location.lat + deltaLat;
        let newLng = store.location.lng + deltaLng;

        newLat = Math.max(-90, Math.min(90, newLat));
        while (newLng > 180) newLng -= 360;
        while (newLng < -180) newLng += 360;

        store.updateLocation(newLat, newLng, store.location.label);
      }

      // Update Zoom via QE
      if (zoomDelta !== 0) {
        const zoomSpeed = 0.05 * (deltaTime / 16.6); // Adjust zoom speed
        let newZoom = store.zoom + zoomDelta * zoomSpeed;

        // Clamp for zoom (MapLibre typical bounds: 0 to 22)
        newZoom = Math.max(0, Math.min(22, newZoom));
        store.updateZoom(newZoom);
      }

      // Update Temporal via ZX and CV
      if (temporalDayDelta !== 0 || temporalHourDelta !== 0) {
        const currentDate = new Date(store.viewDate);

        if (temporalDayDelta !== 0) {
          const daysToAdd = temporalDayDelta * 0.005 * (deltaTime / 16.6);
          currentDate.setTime(
            currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000,
          );
        }

        if (temporalHourDelta !== 0) {
          const hoursToAdd = temporalHourDelta * 0.01 * (deltaTime / 16.6);
          currentDate.setTime(
            currentDate.getTime() + hoursToAdd * 60 * 60 * 1000,
          );
        }

        store.updateDate(currentDate);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-[94%] md:w-[80%] md:min-w-150 max-w-250 h-20 rounded-none shadow-2xl bg-background/50 backdrop-blur-xl border border-border group overflow-hidden flex items-stretch"
    >
      {/* 
      <div className="flex items-center justify-center px-4 md:px-8 border-r border-border/40 bg-background/20 z-10 shrink-0 pointer-events-auto">
        <Joystick
          size={56}
          knobSize={24}
          title=""
          labels={{ top: "N", bottom: "S", left: "W", right: "E" }}
          onDrag={setSpatialData}
        />
      </div>
      */}

      <div className="flex-1 relative pointer-events-auto">
        <EphemerisTimeline
          activeDate={viewDate}
          currentTime={viewDate}
          trajectories={trajectories}
          twilightPhases={twilightPhases}
          onTimeChange={handleTimeChange}
        />
      </div>

      {/*
      <div className="flex items-center justify-center px-4 md:px-8 border-l border-border/40 bg-background/20 z-10 shrink-0 pointer-events-auto">
        <Joystick
          size={56}
          knobSize={24}
          title=""
          labels={{ top: "+h", bottom: "-h", left: "-d", right: "+d" }}
          onDrag={setTemporalData}
        />
      </div>
      */}

      <Link
        href="/timeline"
        className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
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
