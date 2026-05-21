"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "@/components/ui/map";
import { useVyomaSelector, useVyomaStore } from "@/store/use-vyoma-store";

export function LightPollutionLayer({ isVisible }: { isVisible: boolean }) {
  const { map, isLoaded } = useMap();
  const { lpOpacity, location } = useVyomaSelector(["lpOpacity", "location"]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [workerReady, setWorkerReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // 1. Initialize Worker (ALWAYS LOAD for background lookups)
  useEffect(() => {
    const worker = new Worker(
      new URL("../../lib/pollution.worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === "READY") {
        setWorkerReady(true);
      } else if (e.data.type === "BORTLE_RESULT") {
        const { bortle } = e.data.payload;
        useVyomaStore.getState().setBortle(bortle);
      }
    };

    async function initWorker() {
      try {
        const [binRes, metaRes] = await Promise.all([
          fetch("/data/light_pollution.bin"),
          fetch("/data/metadata.json"),
        ]);
        const buffer = await binRes.arrayBuffer();
        const metadata = await metaRes.json();

        worker.postMessage(
          { type: "INIT", payload: { buffer, metadata } },
          [buffer], // Transfer buffer to worker
        );
      } catch (err) {
        console.error("Worker init failed:", err);
      }
    }

    initWorker();

    return () => {
      worker.terminate();
    };
  }, []); // Run once on mount

  // 2. Request Bortle on location change
  useEffect(() => {
    if (!workerRef.current || !workerReady) return;

    workerRef.current.postMessage({
      type: "GET_BORTLE",
      payload: { lat: location.lat, lng: location.lng },
    });
  }, [location.lat, location.lng, workerReady]);

  // 3. Pass OffscreenCanvas to Worker (only when visible/ready)
  useEffect(() => {
    if (!workerRef.current || !canvasRef.current || !workerReady) return;

    try {
      const offscreen = canvasRef.current.transferControlToOffscreen();
      workerRef.current.postMessage(
        { type: "SET_CANVAS", payload: { canvas: offscreen } },
        [offscreen], // Transfer ownership to worker
      );
    } catch (err) {
      console.error("Failed to transfer canvas to worker:", err);
    }
  }, [workerReady, isVisible]); // Re-bind if visibility changes and canvas is remounted

  // 4. The Render Loop (Triggered by map movement)
  useEffect(() => {
    if (!isVisible || !isLoaded || !map || !workerReady || !workerRef.current)
      return;

    let rafId: number;

    const requestRender = () => {
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();
      const nw = map.unproject([0, 0]);
      const se = map.unproject([rect.width, rect.height]);

      workerRef.current?.postMessage({
        type: "RENDER",
        payload: {
          nw: { lat: nw.lat, lng: nw.lng },
          se: { lat: se.lat, lng: se.lng },
          width: rect.width,
          height: rect.height,
          resolution: 0.2,
        },
      });
    };

    const handleMove = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(requestRender);
    };

    requestRender();
    map.on("move", handleMove);
    map.on("zoom", handleMove);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      map.off("move", handleMove);
      map.off("zoom", handleMove);
    };
  }, [isVisible, isLoaded, map, workerReady]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 invisible"}`}
      style={{
        imageRendering: "auto",
        mixBlendMode: "screen",
        opacity: lpOpacity / 100,
      }}
    />
  );
}
