"use client";

import { useEffect, useMemo, useState } from "react";
import { useMap } from "@/components/ui/map";
import { useVyomaStore } from "@/store/use-vyoma-store";
import {
  getGalacticCoreTrajectory,
  getGalacticCorePosition,
  getSunPosition,
  getMoonPosition,
} from "@/lib/astrometry";

/**
 * MapCelestialOverlay
 * A geographically-synced SVG layer that renders celestial trajectories, 
 * current azimuths, and a precision reticle centered on the observer.
 * Follows the Modern Swiss / Analog Instrument aesthetic.
 */
export function MapCelestialOverlay() {
  const { map, isLoaded } = useMap();
  const { location, viewDate } = useVyomaStore();
  const [viewport, setViewport] = useState<{ x: number; y: number; bearing: number } | null>(null);

  // Sync center point and bearing with map movement
  useEffect(() => {
    if (!map || !isLoaded) return;

    const updatePosition = () => {
      const pos = map.project([location.lng, location.lat]);
      setViewport({ x: pos.x, y: pos.y, bearing: map.getBearing() });
    };

    map.on("move", updatePosition);
    map.on("zoom", updatePosition);
    map.on("rotate", updatePosition);
    map.on("pitch", updatePosition);
    
    // Initial position
    updatePosition();

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
      map.off("rotate", updatePosition);
      map.off("pitch", updatePosition);
    };
  }, [map, isLoaded, location.lat, location.lng]);

  const data = useMemo(() => {
    const sunPos = getSunPosition(viewDate, location.lat, location.lng);
    const moonPos = getMoonPosition(viewDate, location.lat, location.lng);
    const corePos = getGalacticCorePosition(viewDate, location.lat, location.lng);
    const coreTrajectory = getGalacticCoreTrajectory(viewDate, location.lat, location.lng, 24);
    
    return { sunPos, moonPos, corePos, coreTrajectory };
  }, [viewDate, location.lat, location.lng]);

  if (!viewport || !isLoaded) return null;

  const { x, y, bearing } = viewport;
  const lineLength = 2000; // Extend lines to map edges

  // Helper to convert azimuth to SVG coordinates, taking map bearing into account
  const azToCoords = (az: number, length: number) => {
    const rad = ((az - 90 - bearing) * Math.PI) / 180;
    return {
      x: x + length * Math.cos(rad),
      y: y + length * Math.sin(rad),
    };
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="fov-gradient" gradientUnits="userSpaceOnUse" cx={x} cy={y} r={400}>
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. The Reticle (Concentric Circles) - Etched Glass look */}
      <g className="reticle">
        {[100, 200, 300].map((radius) => (
          <circle
            key={radius}
            cx={x}
            cy={y}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.1"
            className="drop-shadow-sm"
          />
        ))}
        {/* Cardinal Directions lines (N, E, S, W) inside reticle */}
        {[0, 90, 180, 270].map((az) => {
          const p1 = azToCoords(az, 90);
          const p2 = azToCoords(az, 310);
          return (
            <line
              key={`axis-${az}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.05"
            />
          );
        })}
      </g>

      {/* 2. The Visibility/FOV Wedge (The Cone) */}
      <g className="fov-wedge">
        {/* Centered on the Galactic Core's current position */}
        {(() => {
          const startAz = data.corePos.az - 30;
          const endAz = data.corePos.az + 30;
          const p1 = azToCoords(startAz, 400);
          const p2 = azToCoords(endAz, 400);
          
          return (
            <path
              d={`M ${x} ${y} L ${p1.x} ${p1.y} A 400 400 0 0 1 ${p2.x} ${p2.y} Z`}
              fill="url(#fov-gradient)"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              className="backdrop-blur-[1px]"
            />
          );
        })()}
      </g>

      {/* 3. The Galactic Arc (Dotted Curve projected onto the dome) */}
      <g className="galactic-arc">
        {data.coreTrajectory.map((point, i) => {
          // Project altitude: Alt 90 = center (0), Alt 0 = outer ring (300)
          const radius = ((90 - point.alt) / 90) * 300;
          
          if (point.alt < -20 || radius > 400) return null; // Hide if too far below horizon

          const coords = azToCoords(point.az, radius);
          // Variable opacity and size based on altitude
          const opacity = Math.max(0.05, (point.alt + 20) / 110);
          const size = Math.max(1, (point.alt + 20) / 30);

          return (
            <circle
              key={`core-traj-${i}`}
              cx={coords.x}
              cy={coords.y}
              r={size}
              fill="white"
              fillOpacity={opacity}
            />
          );
        })}
      </g>

      {/* 4. Current Ephemeris Lines (Sun & Moon) */}
      <g className="ephemeris-lines">
        {/* Sun Line */}
        <line
          x1={x}
          y1={y}
          x2={azToCoords(data.sunPos.az, lineLength).x}
          y2={azToCoords(data.sunPos.az, lineLength).y}
          stroke="#fbbf24" // amber/yellow
          strokeWidth="1.5"
          strokeOpacity={data.sunPos.isAboveHorizon ? 0.8 : 0.3}
        />
        {/* Moon Line */}
        <line
          x1={x}
          y1={y}
          x2={azToCoords(data.moonPos.az, lineLength).x}
          y2={azToCoords(data.moonPos.az, lineLength).y}
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity={data.moonPos.isAboveHorizon ? 0.8 : 0.3}
          strokeDasharray={data.moonPos.isAboveHorizon ? "none" : "4 4"}
        />
      </g>

      {/* 5. Center Pivot (Mechanical Watch Dial) */}
      <g className="center-pivot">
        {/* Outer ring */}
        <circle
          cx={x}
          cy={y}
          r="8"
          fill="none"
          stroke="oklch(0.7 0.1 40)" // Metallic/Brass tone
          strokeWidth="1.5"
        />
        {/* Inner dial */}
        <circle
          cx={x}
          cy={y}
          r="4"
          fill="oklch(0.15 0.02 15)" // Dark background
          stroke="oklch(0.7 0.1 40)"
          strokeWidth="0.5"
        />
        {/* Center pin */}
        <circle cx={x} cy={y} r="1" fill="oklch(0.7 0.1 40)" />
      </g>
    </svg>
  );
}
