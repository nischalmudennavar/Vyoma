"use client";

import { useEffect, useRef, useState } from "react";
import type { TrajectoryPoint, TwilightPhases } from "@/lib/astrometry";

interface EphemerisTimelineProps {
  activeDate: Date;
  currentTime: Date;
  trajectories: {
    id: "sun" | "moon" | "core";
    color: string;
    points: TrajectoryPoint[];
  }[];
  twilightPhases: TwilightPhases;
  onTimeChange: (newTime: Date) => void;
}

export function EphemerisTimeline({
  activeDate,
  currentTime,
  trajectories,
  twilightPhases,
  onTimeChange,
}: EphemerisTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime.getTime());

  // Sync local time when external time changes and we aren't dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalTime(currentTime.getTime());
    }
  }, [currentTime, isDragging]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || e.buttons === 0) return;

    // Pan interaction: e.movementX pixels corresponds to shifting time
    // We keep 24 hours of width on the screen
    const msPerPixel = (24 * 60 * 60 * 1000) / dimensions.width;

    // Dragging right moves the graph right -> moves backwards in time
    const deltaMs = -e.movementX * msPerPixel;

    const newTimeMs = localTime + deltaMs;
    setLocalTime(newTimeMs);
    onTimeChange(new Date(newTimeMs));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  if (dimensions.width === 0) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full min-h-20 rounded-none bg-muted/50"
      />
    );
  }

  const { width, height } = dimensions;

  // Layout Constants
  const minAlt = -45;
  const maxAlt = 90;
  const altRange = maxAlt - minAlt;
  const horizonY = height - ((0 - minAlt) / altRange) * height;

  const timeToX = (timeMs: number) => {
    // Current time is always at the center of the screen
    const centerMs = localTime;
    const msDiff = timeMs - centerMs;

    // 24 hours (86400000 ms) fits exactly in 'width'
    const pixelsPerMs = width / 86400000;

    return width / 2 + msDiff * pixelsPerMs;
  };

  const altToY = (alt: number) => {
    const clampedAlt = Math.max(minAlt, Math.min(maxAlt, alt));
    return height - ((clampedAlt - minAlt) / altRange) * height;
  };

  // Find the Core's altitude at current localTime to snap the thumb
  const coreTrajectory = trajectories.find((t) => t.id === "core");
  let thumbY = height / 2;

  if (coreTrajectory && coreTrajectory.points.length > 0) {
    const pts = coreTrajectory.points;
    for (let i = 0; i < pts.length - 1; i++) {
      const t1 = pts[i].time.getTime();
      const t2 = pts[i + 1].time.getTime();
      if (localTime >= t1 && localTime <= t2) {
        const progress = (localTime - t1) / (t2 - t1);
        const alt = pts[i].alt + (pts[i + 1].alt - pts[i].alt) * progress;
        thumbY = altToY(alt);
        break;
      }
    }
  }

  // Draw twilight rects instead of gradient for proper panning
  // For simplicity since twilightPhases are for one day, we'll draw them relative to localTime's day
  const drawTwilightRects = () => {
    if (!twilightPhases.sunrise || !twilightPhases.sunset) {
      return (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          className="fill-[#0f172a]"
        />
      );
    }

    const phases = [
      { t: twilightPhases.astronomicalDawn, color: "#0B0F19" }, // Deepest Night
      { t: twilightPhases.nauticalDawn, color: "#111827" }, // Deep Blue
      { t: twilightPhases.civilDawn, color: "#1E3A8A" }, // Blue Hour
      { t: twilightPhases.sunrise, color: "#9A3412" }, // Golden Dawn/Orange
      {
        t: new Date(twilightPhases.sunrise.getTime() + 2 * 60 * 1000),
        color: "#D97706",
      }, // Sunrise Peak
      {
        t: new Date(twilightPhases.sunset.getTime() - 2 * 60 * 1000),
        color: "#D97706",
      }, // Sunset Start
      { t: twilightPhases.sunset, color: "#9A3412" }, // Golden Dusk/Orange
      { t: twilightPhases.civilDusk, color: "#1E3A8A" }, // Blue Hour
      { t: twilightPhases.nauticalDusk, color: "#111827" }, // Deep Blue
      { t: twilightPhases.astronomicalDusk, color: "#0B0F19" }, // Deepest Night
    ].filter((p) => p.t !== null) as { t: Date; color: string }[];

    return phases.map((phase, i) => {
      const nextPhase = phases[i + 1];
      const startX = timeToX(phase.t.getTime());

      // If it's the last phase, let it fill to the right edge (or a full day)
      const endX = nextPhase ? timeToX(nextPhase.t.getTime()) : startX + width;

      // Also need to fill the night before astro dawn
      if (i === 0) {
        return (
          <g key="twilight-0">
            <rect
              x={startX - width}
              y={0}
              width={width}
              height={height}
              style={{ fill: "#0B0F19" }}
            />
            <rect
              x={startX}
              y={0}
              width={Math.max(0, endX - startX)}
              height={height}
              style={{ fill: phase.color }}
            />
          </g>
        );
      }

      return (
        <rect
          key={`twilight-${i}`}
          x={startX}
          y={0}
          width={Math.max(0, endX - startX)}
          height={height}
          style={{ fill: phase.color }}
        />
      );
    });
  };

  const currentDisplayDate = new Date(localTime);
  const timeString = currentDisplayDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dayString = currentDisplayDate.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none touch-none rounded-none overflow-hidden cursor-ew-resize bg-transparent"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <svg
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Layer 0: Backdrop */}
        {drawTwilightRects()}

        {/* Layer 1: Grid */}
        <line
          x1={0}
          y1={horizonY}
          x2={width}
          y2={horizonY}
          className="stroke-foreground/30 stroke-2"
        />
        <line
          x1={0}
          y1={altToY(45)}
          x2={width}
          y2={altToY(45)}
          className="stroke-foreground/10 stroke-1 stroke-dasharray-4"
          strokeDasharray="4 4"
        />
        <line
          x1={0}
          y1={altToY(-45)}
          x2={width}
          y2={altToY(-45)}
          className="stroke-foreground/10 stroke-1 stroke-dasharray-4"
          strokeDasharray="4 4"
        />

        {/* Vertical hour lines (panning) */}
        {Array.from({ length: 73 }).map((_, i) => {
          // Hour relative to the start of the 72 hour buffer, or just generate from localTime offset
          const baseHour = new Date(localTime);
          baseHour.setMinutes(0, 0, 0);
          const offsetHours = i - 36; // Range from -36 to +36 hours around current time

          const hourMs = baseHour.getTime() + offsetHours * 3600000;
          const x = timeToX(hourMs);

          // Only draw if visible
          if (x < -50 || x > width + 50) return null;

          const hourLabel = new Date(hourMs).getHours();

          return (
            <g key={hourMs}>
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                className="stroke-foreground/10 stroke-1"
              />
              {hourLabel % 3 === 0 && (
                <text
                  x={x + 4}
                  y={12}
                  className="fill-foreground/50 text-[8px] font-mono"
                >{`${hourLabel}:00`}</text>
              )}
            </g>
          );
        })}

        {/* Layer 2: Curves */}
        {trajectories.map((traj) => {
          const pts = traj.points.map(
            (p) => `${timeToX(p.time.getTime())},${altToY(p.alt)}`,
          );
          if (pts.length === 0) return null;

          return (
            <path
              key={traj.id}
              d={`M ${pts.join(" L ")}`}
              fill="none"
              stroke={traj.color}
              className={`stroke-2 ${traj.id === "core" ? "drop-shadow-[0_0_8px_var(--primary)]" : ""}`}
            />
          );
        })}

        {/* Layer 3: Playhead (Fixed Center) */}
        <line
          x1={width / 2}
          y1={0}
          x2={width / 2}
          y2={height}
          className="stroke-foreground/50 stroke-1"
        />
        <circle
          cx={width / 2}
          cy={thumbY}
          r={4}
          className="fill-primary stroke-background stroke-1 shadow-lg drop-shadow-[0_0_12px_var(--primary)]"
        />
      </svg>

      {/* Soft Fade Gradients overlay to make it look like a rolling cylinder */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      {/* Info Overlay */}
      <div className="absolute bottom-1 right-4 pointer-events-none text-right">
        <div className="text-sm font-bold tracking-tighter text-foreground leading-none">
          {timeString}
        </div>
        <div className="text-[8px] uppercase font-mono text-muted-foreground">
          {dayString}
        </div>
      </div>
    </div>
  );
}
