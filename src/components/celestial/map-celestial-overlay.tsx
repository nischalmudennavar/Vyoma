"use client";

import { memo, useEffect, useState } from "react";
import { MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import { useCelestialContext } from "@/context/celestial-context";
import { useVyomaSelector } from "@/store/use-vyoma-store";

/**
 * Throttled SVG content that only re-renders when celestial data actually changes.
 */
const CelestialSVG = memo(
  ({
    sun,
    moon,
    core,
    trajectory,
    bearing,
  }: {
    sun: any;
    moon: any;
    core: any;
    trajectory: any[];
    bearing: number;
  }) => {
    const RADAR_SIZE = 400;
    const CENTER = RADAR_SIZE / 2;
    const RADIUS = CENTER - 40;

    // Helper to convert Az/Alt to SVG coordinates
    const polarToCartesian = (az: number, alt: number, r: number) => {
      const angleRad = ((az - 90) * Math.PI) / 180;
      const currentR = r * (1 - Math.max(0, alt) / 90);
      return {
        x: CENTER + currentR * Math.cos(angleRad),
        y: CENTER + currentR * Math.sin(angleRad),
      };
    };

    const sunXY = polarToCartesian(sun.az, sun.alt, RADIUS);
    const moonXY = polarToCartesian(moon.az, moon.alt, RADIUS);
    const coreXY = polarToCartesian(core.az, core.alt, RADIUS);

    return (
      <svg
        width={RADAR_SIZE}
        height={RADAR_SIZE}
        viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          style={{
            transform: `rotate(${-bearing}deg)`,
            transformOrigin: "center",
          }}
        >
          {/* 0. Visibility Wedge (FOV) */}
          <path
            d={`M ${CENTER} ${CENTER} L ${CENTER + RADIUS * Math.cos(((-30 - 90) * Math.PI) / 180)} ${CENTER + RADIUS * Math.sin(((-30 - 90) * Math.PI) / 180)} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS * Math.cos(((30 - 90) * Math.PI) / 180)} ${CENTER + RADIUS * Math.sin(((30 - 90) * Math.PI) / 180)} Z`}
            fill="var(--primary)"
            className="opacity-5"
          />

          {/* 1. The Reticle (Concentric Elevation Rings) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="url(#radar-glow)"
            stroke="currentColor"
            className="text-foreground/10"
            strokeWidth="1"
          />
          {[30, 60].map((alt) => (
            <circle
              key={alt}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS * (1 - alt / 90)}
              fill="none"
              stroke="currentColor"
              className="text-foreground/5"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
          ))}

          {/* Cardinal Markers */}
          {["N", "E", "S", "W"].map((label, i) => {
            const angle = (i * 90 * Math.PI) / 180 - Math.PI / 2;
            const tx = CENTER + (RADIUS + 15) * Math.cos(angle);
            const ty = CENTER + (RADIUS + 15) * Math.sin(angle);
            return (
              <text
                key={label}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground/40 font-mono text-[10px] font-black uppercase tracking-widest"
                transform={`rotate(${bearing}, ${tx}, ${ty})`}
              >
                {label}
              </text>
            );
          })}

          {/* 3. Galactic Arc (Trajectory) */}
          <g className="galactic-arc">
            {trajectory.map((point, i) => {
              if (point.alt < 0) return null;
              const { x, y } = polarToCartesian(point.az, point.alt, RADIUS);
              const size = 0.5 + (point.alt / 90) * 2;
              const opacity = 0.1 + (point.alt / 90) * 0.6;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={size}
                  className="fill-primary"
                  style={{ opacity }}
                />
              );
            })}
          </g>

          {/* 4. Active Bodies */}
          {sun.isAboveHorizon && (
            <g filter="url(#glow)">
              <circle
                cx={sunXY.x}
                cy={sunXY.y}
                r="4"
                className="fill-primary shadow-tactical"
              />
              <text
                x={sunXY.x}
                y={sunXY.y - 8}
                textAnchor="middle"
                className="fill-primary font-mono text-[8px] font-black uppercase tracking-tighter"
                transform={`rotate(${bearing}, ${sunXY.x}, ${sunXY.y - 8})`}
              >
                SUN
              </text>
            </g>
          )}

          {moon.isAboveHorizon && (
            <g>
              <circle
                cx={moonXY.x}
                cy={moonXY.y}
                r="3"
                className="fill-foreground"
              />
              <text
                x={moonXY.x}
                y={moonXY.y - 8}
                textAnchor="middle"
                className="fill-foreground font-mono text-[8px] font-black uppercase tracking-tighter"
                transform={`rotate(${bearing}, ${moonXY.x}, ${moonXY.y - 8})`}
              >
                MOON
              </text>
            </g>
          )}

          {core.isAboveHorizon && (
            <g filter="url(#glow)">
              <circle
                cx={coreXY.x}
                cy={coreXY.y}
                r="5"
                className="fill-primary animate-pulse"
              />
              <text
                x={coreXY.x}
                y={coreXY.y - 10}
                textAnchor="middle"
                className="fill-primary font-mono text-[9px] font-black uppercase tracking-tighter"
                transform={`rotate(${bearing}, ${coreXY.x}, ${coreXY.y - 10})`}
              >
                CORE
              </text>
            </g>
          )}

          {/* 5. Center Pivot */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={4}
            className="fill-background stroke-primary stroke-[2]"
          />
          <circle cx={CENTER} cy={CENTER} r={1} className="fill-primary" />
        </g>
      </svg>
    );
  },
);

CelestialSVG.displayName = "CelestialSVG";

/**
 * MapCelestialOverlay
 * Sit directly on the map view, providing a technical instrumentation layer.
 */
export function MapCelestialOverlay() {
  const { map } = useMap();
  const { location } = useVyomaSelector(["location"]);
  const [bearing, setBearing] = useState(0);

  const {
    sunPos: sun,
    moonPos: moon,
    gcPos: core,
    ephemeris,
    isLoading,
  } = useCelestialContext();

  useEffect(() => {
    if (!map) return;
    setBearing(map.getBearing());
    const handleMove = () => setBearing(map.getBearing());
    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
    };
  }, [map]);

  if (!sun || !moon || !core) return null;

  const trajectory = ephemeris?.trajectories.gc || [];

  return (
    <MapMarker
      longitude={location.lng}
      latitude={location.lat}
      rotationAlignment="map"
      pitchAlignment="map"
      anchor="center"
    >
      <MarkerContent>
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          <CelestialSVG
            sun={sun}
            moon={moon}
            core={core}
            trajectory={trajectory}
            bearing={bearing}
          />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            Celestial Radar
          </div>
        </div>
      </MarkerContent>
    </MapMarker>
  );
}
