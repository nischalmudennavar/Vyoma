"use client";

import { useEffect, useRef, useState } from "react";
import {
  getGalacticCorePosition,
  getGalacticCoreTrajectory,
  getMoonPosition,
  getSunPosition,
} from "@/lib/astrometry";
import { useVyomaStore } from "@/store/use-vyoma-store";

export function CelestialRadar() {
  const { location, viewDate } = useVyomaStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
      />
    );
  }

  const { width, height } = dimensions;
  const centerX = width / 2;
  const centerY = height / 2;
  // Radar radius maxes out at the shortest edge divided by 2, slightly padded
  const maxRadius = (Math.min(width, height) / 2) * 0.9;

  const currentPos = getGalacticCorePosition(
    viewDate,
    location.lat,
    location.lng,
  );
  const trajectory = getGalacticCoreTrajectory(
    viewDate,
    location.lat,
    location.lng,
  );

  const sunPos = getSunPosition(viewDate, location.lat, location.lng);
  const moonPos = getMoonPosition(viewDate, location.lat, location.lng);

  // Projection Math: Azimuthal Equidistant
  const project = (alt: number, az: number, clamp = false) => {
    let r = maxRadius * (1 - alt / 90);

    if (clamp) {
      // Clamp to keep it inside the viewport (max distance is half the shortest screen dimension minus padding)
      const maxAllowed = Math.min(width, height) / 2 - 25;
      r = Math.min(r, maxAllowed);
    }

    const azRad = (az * Math.PI) / 180;

    const x = centerX + r * Math.sin(azRad);
    const y = centerY - r * Math.cos(azRad);

    return { x, y, r };
  };

  const currentProjected = project(currentPos.alt, currentPos.az, true);
  const sunProjected = project(sunPos.alt, sunPos.az, true);
  const moonProjected = project(moonPos.alt, moonPos.az, true);

  // Filter trajectory to only show above-horizon points for a cleaner look,
  // or show all but fade them. The prompt implies fading/hiding if alt < 0.
  const trajectoryPath = trajectory.map((p) => {
    const proj = project(p.alt, p.az);
    return { ...proj, isAbove: p.isAboveHorizon };
  });

  // Calculate rings for Alt 30 and Alt 60
  const r30 = maxRadius * (1 - 30 / 90);
  const r60 = maxRadius * (1 - 60 / 90);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20"
    >
      <svg width={width} height={height} className="w-full h-full">
        {/* Grid: Horizon (Alt 0) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          className="fill-none stroke-foreground/20 stroke-1"
        />
        {/* Grid: Alt 30 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={r30}
          className="fill-none stroke-foreground/10 stroke-1 stroke-dasharray-4"
        />
        {/* Grid: Alt 60 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={r60}
          className="fill-none stroke-foreground/10 stroke-1 stroke-dasharray-4"
        />

        {/* Axes */}
        <line
          x1={centerX}
          y1={centerY - maxRadius}
          x2={centerX}
          y2={centerY + maxRadius}
          className="stroke-foreground/10 stroke-1"
        />
        <line
          x1={centerX - maxRadius}
          y1={centerY}
          x2={centerX + maxRadius}
          y2={centerY}
          className="stroke-foreground/10 stroke-1"
        />

        {/* Cardinal Directions */}
        <text
          x={centerX}
          y={centerY - maxRadius - 10}
          className="fill-foreground/50 text-xs text-center font-mono"
          textAnchor="middle"
        >
          N
        </text>
        <text
          x={centerX}
          y={centerY + maxRadius + 20}
          className="fill-foreground/50 text-xs text-center font-mono"
          textAnchor="middle"
        >
          S
        </text>
        <text
          x={centerX + maxRadius + 15}
          y={centerY + 4}
          className="fill-foreground/50 text-xs text-center font-mono"
          textAnchor="middle"
        >
          E
        </text>
        <text
          x={centerX - maxRadius - 15}
          y={centerY + 4}
          className="fill-foreground/50 text-xs text-center font-mono"
          textAnchor="middle"
        >
          W
        </text>

        {/* Trajectory Arc */}
        {trajectoryPath.map((pt, i) => {
          if (i === 0) return null;
          const prev = trajectoryPath[i - 1];
          // Only draw line if both points are above horizon for a clean arc,
          // or draw faded if below. Let's draw above horizon brightly.
          if (!pt.isAbove && !prev.isAbove) return null;

          const opacityClass = pt.isAbove
            ? "stroke-primary/50"
            : "stroke-primary/10";
          return (
            <line
              key={`traj-${i}`}
              x1={prev.x}
              y1={prev.y}
              x2={pt.x}
              y2={pt.y}
              className={`stroke-2 stroke-dasharray-2 ${opacityClass}`}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Sun Indicator */}
        <g
          className={`transition-all duration-300 ${sunPos.isAboveHorizon ? "opacity-100" : "opacity-30"}`}
          style={{
            transform: `translate(${sunProjected.x}px, ${sunProjected.y}px)`,
          }}
        >
          <circle
            r={8}
            className="fill-[#facc15]"
            style={{
              filter: sunPos.isAboveHorizon
                ? "drop-shadow(0 0 10px rgba(250,204,21,0.8))"
                : "none",
            }}
          />
          <text
            y={20}
            className="fill-[#facc15] text-[10px] text-center font-mono font-bold"
            textAnchor="middle"
          >
            SUN
          </text>
        </g>

        {/* Moon Indicator */}
        <g
          className={`transition-all duration-300 ${moonPos.isAboveHorizon ? "opacity-100" : "opacity-30"}`}
          style={{
            transform: `translate(${moonProjected.x}px, ${moonProjected.y}px)`,
          }}
        >
          <circle
            r={8}
            className="fill-[#e2e8f0]"
            style={{
              filter: moonPos.isAboveHorizon
                ? "drop-shadow(0 0 10px rgba(226,232,240,0.8))"
                : "none",
            }}
          />
          <text
            y={20}
            className="fill-[#e2e8f0] text-[10px] text-center font-mono font-bold"
            textAnchor="middle"
          >
            MOON
          </text>
        </g>

        {/* Current Core Position */}
        <g
          className={`transition-all duration-300 ${currentPos.isAboveHorizon ? "opacity-100" : "opacity-30"}`}
          style={{
            transform: `translate(${currentProjected.x}px, ${currentProjected.y}px)`,
          }}
        >
          <circle
            r={12}
            className="fill-primary"
            style={{
              filter: currentPos.isAboveHorizon
                ? "drop-shadow(0 0 12px var(--color-primary))"
                : "none",
            }}
          />
          <circle r={4} className="fill-background" />
          <text
            y={24}
            className="fill-primary text-[10px] text-center font-mono font-bold"
            textAnchor="middle"
          >
            CORE
          </text>
        </g>
      </svg>
    </div>
  );
}
