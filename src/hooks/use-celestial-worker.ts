import { useEffect, useState, useMemo, useRef } from "react";

/**
 * useCelestialWorker
 * 
 * A hook to interact with the celestial calculation web worker.
 * Handles worker instantiation, message passing, and state management.
 */
export function useCelestialWorker<T>(type: string, payload: any) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker only on client side
    if (typeof window === "undefined") return;

    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../lib/astrometry.worker.ts", import.meta.url),
        { type: "module" }
      );
    }

    const worker = workerRef.current;

    const handleMessage = (event: MessageEvent) => {
      const { type: responseType, payload: responsePayload } = event.data;

      if (responseType === `${type}_SUCCESS`) {
        setData(responsePayload);
        setIsLoading(false);
        setError(null);
      } else if (responseType === "ERROR") {
        setError(responsePayload);
        setIsLoading(false);
      }
    };

    worker.addEventListener("message", handleMessage);

    setIsLoading(true);
    worker.postMessage({ type, payload });

    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [type, payload]);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return { data, isLoading, error };
}
