"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { CelestialCoordinates, TwilightPhases } from "@/lib/astrometry";
import { useVyomaSelector } from "@/store/use-vyoma-store";

/**
 * The unified state for all celestial metrics and trajectories.
 * This is the high-leverage interface for the Observer Context Module.
 */
export interface CelestialState {
  // Current positions
  gcPos: CelestialCoordinates | null;
  sunPos: CelestialCoordinates | null;
  moonPos: CelestialCoordinates | null;

  // Visibility and windows
  gcVis: { rise: Date | null; set: Date | null } | null;
  sunPhases: TwilightPhases | null;
  moonRiseSet: { rise: Date | null; set: Date | null } | null;
  moonFreeWindow: { start: Date | null; end: Date | null } | null;
  goldenHour: {
    morning: { start: Date | null; end: Date | null };
    evening: { start: Date | null; end: Date | null };
  } | null;

  // Details
  sunDetails: { distanceKm: number; angularDiameter: number } | null;
  moonDetails: { distanceKm: number; angularDiameter: number } | null;
  moonPhase: { phase: number; name: string; illumination: number } | null;

  // Trajectories (Longer window for timelines)
  ephemeris: {
    trajectories: {
      gc: Array<CelestialCoordinates & { time: Date }>;
      sun: Array<CelestialCoordinates & { time: Date }>;
      moon: Array<CelestialCoordinates & { time: Date }>;
    };
    twilightPhases: TwilightPhases;
  } | null;

  isLoading: boolean;
  error: Error | null;
}

const CelestialContext = createContext<CelestialState | undefined>(undefined);

/**
 * Provider that orchestrates a single Web Worker to perform all celestial math.
 * Ensures that all components are perfectly synchronized to the same observer state.
 */
export function CelestialProvider({ children }: { children: React.ReactNode }) {
  const { location, viewDate } = useVyomaSelector(["location", "viewDate"]);
  const [state, setState] = useState<CelestialState>({
    gcPos: null,
    sunPos: null,
    moonPos: null,
    gcVis: null,
    sunPhases: null,
    moonRiseSet: null,
    moonFreeWindow: null,
    goldenHour: null,
    sunDetails: null,
    moonDetails: null,
    moonPhase: null,
    ephemeris: null,
    isLoading: false,
    error: null,
  });

  const workerRef = React.useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize single persistent worker
    const worker = new Worker(
      new URL("../lib/astrometry.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (event) => {
      const { type, payload, error } = event.data;

      if (error || type === "ERROR") {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: new Error(error || payload),
        }));
        return;
      }

      if (type === "CALCULATE_ALL_SUCCESS") {
        setState((s) => ({
          ...s,
          ...(parseDates(payload) as any),
          // We manually map sunPos and moonPos from the detailed pos objects if needed,
          // but astrometry.worker CALCULATE_ALL currently doesn't return them directly.
          // Let's assume we'll update the worker or map them here.
          sunPos: payload.sunPos || null,
          moonPos: payload.moonPos || null,
          isLoading: false,
          error: null,
        }));
      }

      if (type === "CALCULATE_EPHEMERIS_SUCCESS") {
        setState((s) => ({
          ...s,
          ephemeris: parseDates(payload) as CelestialState["ephemeris"],
          isLoading: false,
          error: null,
        }));
      }
    };

    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  // Sync calculation on location/time change
  useEffect(() => {
    if (!workerRef.current) return;

    setState((s) => ({ ...s, isLoading: true }));

    const payload = {
      date: viewDate.toISOString(),
      lat: location.lat,
      lng: location.lng,
    };

    workerRef.current.postMessage({ type: "CALCULATE_ALL", payload });
    workerRef.current.postMessage({ type: "CALCULATE_EPHEMERIS", payload });
  }, [location.lat, location.lng, viewDate]);

  return (
    <CelestialContext.Provider value={state}>
      {children}
    </CelestialContext.Provider>
  );
}

export function useCelestialContext() {
  const context = useContext(CelestialContext);
  if (context === undefined) {
    throw new Error(
      "useCelestialContext must be used within a CelestialProvider",
    );
  }
  return context;
}

/**
 * Recursively searches an object for ISO date strings and converts them to Date objects.
 */
function parseDates(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  if (typeof obj === "string") {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj)) {
      const date = new Date(obj);
      return Number.isNaN(date.getTime()) ? obj : date;
    }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(parseDates);
  if (typeof obj === "object" && obj !== null) {
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = parseDates(value);
    }
    return newObj;
  }
  return obj;
}
