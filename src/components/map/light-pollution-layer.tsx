"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "@/components/ui/map";
import { useVyomaSelector } from "@/store/use-vyoma-store";

export function LightPollutionLayer({ isVisible }: { isVisible: boolean }) {
  const { map, isLoaded } = useMap();
  const { lpOpacity } = useVyomaSelector(["lpOpacity"]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [workerReady, setWorkerReady] = useState(false);
  const [hasEverBeenVisible, setHasEverBeenVisible] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // Track visibility to trigger lazy load
  useEffect(() => {
    if (isVisible && !hasEverBeenVisible) {
      setHasEverBeenVisible(true);
    }
  }, [isVisible, hasEverBeenVisible]);

  // 1. Initialize Worker (LAZY LOAD)
  useEffect(() => {
    if (!hasEverBeenVisible) return;

    const worker = new Worker(
      new URL("../../lib/pollution.worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === "READY") {
        setWorkerReady(true);
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
  }, [hasEverBeenVisible]);

  // 2. Pass OffscreenCanvas to Worker
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
  }, [workerReady]);

  // 3. The Render Loop (Triggered by map movement)
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

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{
        imageRendering: "auto",
        mixBlendMode: "screen",
        opacity: lpOpacity / 100,
      }}
    />
  );
}
