"use client";

import { useEffect, useRef, useState } from "react";
// Import your custom WASM engine!
// @ts-expect-error - this will be available once we build the WASM package
import init, { PollutionEngine } from "vyoma-core";
import { useMap } from "@/components/ui/map";
import { useVyomaSelector } from "@/store/use-vyoma-store";

// Standard Bortle Scale Colors (RGBA)
const BORTLE_COLORS: Record<number, [number, number, number, number]> = {
  1: [0, 0, 0, 0], // Pristine (Transparent)
  2: [0, 0, 0, 0], // Dark (Transparent)
  3: [0, 0, 255, 60], // Rural (Blue)
  4: [0, 255, 0, 60], // Suburban Transition (Green)
  5: [255, 255, 0, 60], // Suburban (Yellow)
  6: [255, 128, 0, 60], // Bright Suburban (Orange)
  7: [255, 0, 0, 70], // Urban Transition (Red)
  8: [255, 255, 255, 100], // City (White)
  9: [255, 200, 255, 120], // Inner City (Pinkish White)
};

export function LightPollutionLayer({ isVisible }: { isVisible: boolean }) {
  const { map, isLoaded } = useMap();
  const { lpOpacity } = useVyomaSelector(["lpOpacity"]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [engineReady, setEngineReady] = useState(false);
  const engineRef = useRef<PollutionEngine | null>(null);

  // 1. Boot up WASM and load the data into memory
  useEffect(() => {
    async function loadEngine() {
      try {
        // Initialize the WASM module
        await init();

        // Fetch the binary map and metadata
        const [binRes, metaRes] = await Promise.all([
          fetch("/data/light_pollution.bin"),
          fetch("/data/metadata.json"),
        ]);

        const buffer = await binRes.arrayBuffer();
        const metadata = await metaRes.json();

        // Create the stateful Rust engine (this copies the 10MB buffer ONCE into WASM memory)
        engineRef.current = new PollutionEngine(
          new Uint8Array(buffer),
          metadata.width,
          metadata.height,
          metadata.origin_lon,
          metadata.origin_lat,
          metadata.pixel_width,
          metadata.pixel_height,
        );

        setEngineReady(true);
      } catch (error) {
        console.error("Failed to load Vyoma WASM engine:", error);
      }
    }
    loadEngine();

    return () => {
      // Free the Rust struct when component unmounts
      engineRef.current?.free();
    };
  }, []);

  // 2. The Render Loop
  useEffect(() => {
    if (
      !isVisible ||
      !isLoaded ||
      !map ||
      !engineReady ||
      !engineRef.current ||
      !canvasRef.current
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;

    const renderHeatmap = () => {
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();

      // Render at low resolution, CSS handles smoothing
      const RESOLUTION = 0.2;
      canvas.width = Math.floor(rect.width * RESOLUTION);
      canvas.height = Math.floor(rect.height * RESOLUTION);

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      const engine = engineRef.current;

      if (!engine) return;

      // Scan through the low-res grid
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          // Translate Screen Pixel -> Geographic Coordinates
          const lngLat = map.unproject([x / RESOLUTION, y / RESOLUTION]);

          // Query the WASM Core (Extremely fast, no copies!)
          const bortle = engine.get_bortle_class(lngLat.lat, lngLat.lng);

          // Apply Color
          const color = BORTLE_COLORS[bortle] || BORTLE_COLORS[1];
          const index = (y * canvas.width + x) * 4;
          data[index] = color[0]; // R
          data[index + 1] = color[1]; // G
          data[index + 2] = color[2]; // B
          data[index + 3] = color[3]; // A
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // Debounced draw for high performance during movement
    const handleMove = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(renderHeatmap);
    };

    renderHeatmap();
    map.on("move", handleMove); // Real-time sync
    map.on("zoom", handleMove); // Real-time sync

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      map.off("move", handleMove);
      map.off("zoom", handleMove);
    };
  }, [isVisible, isLoaded, map, engineReady]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{
        imageRendering: "auto", // Smooths the low-res pixels into a heatmap
        mixBlendMode: "screen", // Makes it overlay nicely on a dark map
        opacity: lpOpacity / 100,
      }}
    />
  );
}
