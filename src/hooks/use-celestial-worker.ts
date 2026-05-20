"use client";

import { useEffect, useRef, useState } from "react";

interface Payload {
  date: string | Date;
  lat: number;
  lng: number;
  [key: string]: unknown;
}

interface WorkerMessage<T> {
  type: string;
  payload: T;
  error?: string;
}

/**
 * Custom hook to interface with a Web Worker for celestial calculations.
 *
 * @param type - The type of calculation to request from the worker.
 * @param payload - The data needed for the calculation.
 * @returns An object containing the calculation result, loading state, and any errors.
 */
export function useCelestialWorker<T>(type: string, payload: Payload) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create the worker instance only once per type
    const worker = new Worker(
      new URL("../lib/astrometry.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (event: MessageEvent<WorkerMessage<T>>) => {
      const {
        type: responseType,
        payload: responseData,
        error: workerError,
      } = event.data;

      // Handle success response (type matches or has _SUCCESS suffix)
      if (responseType === type || responseType === `${type}_SUCCESS`) {
        const processedData = parseDates(responseData) as T;
        setData(processedData);
        setIsLoading(false);
        setError(null);
      } else if (workerError || responseType === "ERROR") {
        setError(new Error(workerError || (responseData as unknown as string)));
        setIsLoading(false);
      }
    };

    worker.onerror = (err) => {
      setError(new Error(`Worker error: ${err.message}`));
      setIsLoading(false);
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, [type]);

  useEffect(() => {
    if (!workerRef.current || payload.date === undefined) return;

    // Validate coordinates - allow 0, but check for null/undefined/NaN
    const lat = Number.parseFloat(payload.lat.toString());
    const lng = Number.parseFloat(payload.lng.toString());
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    setIsLoading(true);
    workerRef.current.postMessage({ type, payload });
  }, [type, payload]);

  return { data, isLoading, error };
}

/**
 * Recursively searches an object for ISO date strings and converts them to Date objects.
 * Also preserves existing Date objects.
 */
function parseDates(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  // If it's already a Date, return it
  if (obj instanceof Date) return obj;

  if (typeof obj === "string") {
    // ISO Date regex
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj)) {
      const date = new Date(obj);
      return Number.isNaN(date.getTime()) ? obj : date;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(parseDates);
  }

  if (typeof obj === "object" && obj !== null) {
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = parseDates(value);
    }
    return newObj;
  }

  return obj;
}
