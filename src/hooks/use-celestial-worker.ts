"use client";

import { useEffect, useRef, useState } from "react";

interface WorkerPayload {
  date: string | Date | number;
  lat: number;
  lng: number;
  [key: string]: unknown;
}

/**
 * Custom hook to interact with the Celestial Web Worker.
 * Offloads heavy astronomy calculations from the main thread.
 */
export function useCelestialWorker<T>(type: string, payload: WorkerPayload) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(
      new URL("../lib/astrometry.worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type: responseType, payload: responsePayload } = event.data;

      if (responseType === `${type}_SUCCESS`) {
        setData(responsePayload);
        setIsLoading(false);
      } else if (responseType === "ERROR") {
        setError(responsePayload);
        setIsLoading(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [type]);

  useEffect(() => {
    if (!workerRef.current || !payload.date || !payload.lat || !payload.lng)
      return;

    setIsLoading(true);
    workerRef.current.postMessage({ type, payload });
  }, [type, payload.date, payload.lat, payload.lng]);

  return { data, isLoading, error };
}
