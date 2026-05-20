"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { MapMarker, MarkerContent } from "@/components/ui/map";
import {
  getGalacticCorePosition,
  getGalacticCoreTrajectory,
  getMoonPosition,
  getSunPosition,
} from "@/lib/astrometry";
import { useVyomaSelector } from "@/store/use-vyoma-store";

// Threshold for coordinate change to trigger expensive astrometry (approx 1km)
const ASTROMETRY_THRESHOLD = 0.01;

interface CelestialData {
  sunPos: { az: number; isAboveHorizon: boolean };
  moonPos: { az: number; isAboveHorizon: boolean };
  corePos: { az: number; isAboveHorizon: boolean };
  coreTrajectory: Array<{ az: number; alt: number }>;
}

/**
 * Throttled SVG content that only re-renders when celestial data actually changes.
 */
const CelestialSVG = memo(({ data }: { data: CelestialData }) => {
  const lineLength = 2000;

  // Helper to convert azimuth to SVG coordinates
  const azToCoords = (az: number, length: number) => {
    const rad = ((az - 90) * Math.PI) / 180;
    return {
      x: length * Math.cos(rad),
      y: length * Math.sin(rad),
    };
  };

  return (
    <svg
      width="1"
      height="1"
      className="pointer-events-none"
      style={{ overflow: "visible" }}
      role="img"
      aria-labelledby="celestial-overlay-title"
    >
      <title id="celestial-overlay-title">Celestial Ephemeris Overlay</title>
      <defs>
        <radialGradient
          id="fov-gradient"
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r="400"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. The Reticle (Concentric Circles) */}
      <g className="reticle">
        {[100, 200, 300].map((radius) => (
          <circle
            key={radius}
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.1"
          />
        ))}
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

      {/* 2. The Visibility/FOV Wedge */}
      <g className="fov-wedge">
        {(() => {
          const startAz = data.corePos.az - 30;
          const endAz = data.corePos.az + 30;
          const p1 = azToCoords(startAz, 400);
          const p2 = azToCoords(endAz, 400);

          return (
            <path
              d={`M 0 0 L ${p1.x} ${p1.y} A 400 400 0 0 1 ${p2.x} ${p2.y} Z`}
              fill="url(#fov-gradient)"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              className="backdrop-blur-[1px]"
            />
          );
        })()}
      </g>

      {/* 3. The Galactic Arc */}
      <g className="galactic-arc">
        {data.coreTrajectory.map((point) => {
          const radius = ((90 - point.alt) / 90) * 300;
          if (point.alt < -20 || radius > 400) return null;

          const coords = azToCoords(point.az, radius);
          const opacity = Math.max(0.05, (point.alt + 20) / 110);
          const size = Math.max(1, (point.alt + 20) / 30);

          return (
            <circle
              key={`core-traj-${point.az}-${point.alt}`}
              cx={coords.x}
              cy={coords.y}
              r={size}
              fill="white"
              fillOpacity={opacity}
            />
          );
        })}
      </g>

      {/* 4. Current Ephemeris Lines */}
      <g className="ephemeris-lines">
        <g>
          <line
            x1="0"
            y1="0"
            x2={azToCoords(data.sunPos.az, lineLength).x}
            y2={azToCoords(data.sunPos.az, lineLength).y}
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeOpacity={data.sunPos.isAboveHorizon ? 0.8 : 0.3}
          />
          <text
            {...azToCoords(data.sunPos.az, 180)}
            fill="#fbbf24"
            fillOpacity={data.sunPos.isAboveHorizon ? 0.9 : 0.4}
            fontSize="10"
            fontWeight="900"
            className="font-mono uppercase tracking-[0.2em]"
            textAnchor="start"
            dx="10"
            transform={`rotate(${data.sunPos.az - 90}, ${azToCoords(data.sunPos.az, 180).x}, ${azToCoords(data.sunPos.az, 180).y})`}
          >
            Sun
          </text>
        </g>

        <g>
          <line
            x1="0"
            y1="0"
            x2={azToCoords(data.moonPos.az, lineLength).x}
            y2={azToCoords(data.moonPos.az, lineLength).y}
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity={data.moonPos.isAboveHorizon ? 0.8 : 0.3}
            strokeDasharray={data.moonPos.isAboveHorizon ? "none" : "4 4"}
          />
          <text
            {...azToCoords(data.moonPos.az, 180)}
            fill="white"
            fillOpacity={data.moonPos.isAboveHorizon ? 0.9 : 0.4}
            fontSize="10"
            fontWeight="900"
            className="font-mono uppercase tracking-[0.2em]"
            textAnchor="start"
            dx="10"
            transform={`rotate(${data.moonPos.az - 90}, ${azToCoords(data.moonPos.az, 180).x}, ${azToCoords(data.moonPos.az, 180).y})`}
          >
            Moon
          </text>
        </g>
      </g>

      {/* 5. Center Pivot */}
      <g className="center-pivot">
        <circle
          cx="0"
          cy="0"
          r="8"
          fill="none"
          stroke="oklch(0.7 0.1 40)"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="4"
          fill="oklch(0.15 0.02 15)"
          stroke="oklch(0.7 0.1 40)"
          strokeWidth="0.5"
        />
        <circle cx="0" cy="0" r="1" fill="oklch(0.7 0.1 40)" />
      </g>
    </svg>
  );
});

CelestialSVG.displayName = "CelestialSVG";

/**
 * MapCelestialOverlay
 * A geographically-synced SVG layer optimized for performance.
 * The marker updates at 60fps to stay centered, but heavy celestial
 * calculations only fire when the observer moves > 0.01 degrees.
 */
export function MapCelestialOverlay() {
  const { location, viewDate } = useVyomaSelector(["location", "viewDate"]);

  // Track the location used for astrometry to avoid 60fps recalculations
  const [astroLocation, setAstroLocation] = useState(location);

  useEffect(() => {
    const dLat = Math.abs(location.lat - astroLocation.lat);
    const dLng = Math.abs(location.lng - astroLocation.lng);

    if (dLat > ASTROMETRY_THRESHOLD || dLng > ASTROMETRY_THRESHOLD) {
      setAstroLocation(location);
    }
  }, [location, astroLocation]);

  const data = useMemo(() => {
    const sunPos = getSunPosition(
      viewDate,
      astroLocation.lat,
      astroLocation.lng,
    );
    const moonPos = getMoonPosition(
      viewDate,
      astroLocation.lat,
      astroLocation.lng,
    );
    const corePos = getGalacticCorePosition(
      viewDate,
      astroLocation.lat,
      astroLocation.lng,
    );
    const coreTrajectory = getGalacticCoreTrajectory(
      viewDate,
      astroLocation.lat,
      astroLocation.lng,
      24,
    );

    return { sunPos, moonPos, corePos, coreTrajectory };
  }, [viewDate, astroLocation]);

  return (
    <MapMarker
      longitude={location.lng}
      latitude={location.lat}
      rotationAlignment="map"
      pitchAlignment="map"
      anchor="center"
    >
      <MarkerContent>
        <CelestialSVG data={data} />
      </MarkerContent>
    </MapMarker>
  );
}
