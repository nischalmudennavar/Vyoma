# Visual Design Guidelines - Project Vyoma

## Core Aesthetic: Modern Swiss & Analog Instrumentation
Project Vyoma follows a clean, minimalist, and data-driven aesthetic inspired by high-end Swiss watchmaking, vintage camera mechanics, and precise astronomical charts. The interface should feel like a "living" instrument—functional, elegant, and mechanically precise.

### 1. Geometric Precision (No Radius Policy)
- **Zero Radii:** A strict `rounded-none` policy is enforced across the entire application for UI containers.
- **Instrument Primitives:** Circular shapes are reserved for mechanical pivots, watch-like dials, and celestial bodies.
- **Swiss Layout:** Use generous white space (or dark space) and clear grid alignments.

### 2. Layout & Spacing
- **Floating Overlays:** Positioned with precision (e.g., `top-6`, `left-6`).
- **Analog Glass:** Overlays use `bg-background/80` or `bg-background/50` with `backdrop-blur-xl` and `shadow-2xl` to mimic etched focusing glass.
- **Fine Lines:** Use 1px borders (`border-border/40`) and "etched" markings to define areas.

### 3. Typography
- **Monospace Precision:** `font-mono` (Fira Code) for technical data and metadata.
- **Swiss Sans:** Clean, high-legibility sans-serif for primary navigation (if any).
- **Metadata:** Small, crisp caps with wide tracking (`text-[10px] uppercase font-bold tracking-widest`) for a "technical manual" feel.

### 4. Color Palette (OKLCH)
- **Base:** Deep space dark (`oklch(0.1188 0.0318 15.2849)`).
- **Markings:** Highly transparent white/grey lines for "etched" reticles.
- **Ephemeris Tones:** 
  - Sun: Muted warm amber (Rise) and burnt orange (Set).
  - Moon: Cool ice blue or silver.
  - Core: Neon primary highlight.

### 5. Instrumentation (The Celestial Overlay)
- **The Reticle:** Concentric 1px circles representing distance or elevation, centered on a metallic/brass pivot.
- **Variable Trajectories:** The Galactic Arc uses dots that grow in size and opacity as the core rises in the sky, adding a sense of Z-axis depth.
- **Visibility Wedge:** A precise, frosted-glass "cone" showing the optimal FOV or visibility window.

### 6. Implementation Pattern: UI Containers
- **Centralized Opacity:** All floating UI elements use the `Container` component with the `applyUiOpacity` prop.
- **Indirect Control:** The `Container` acts as the single point of synchronization with the global settings panel.




Link the WASM Core to Next.js
You need to tell your Next.js project that the vyoma-core Rust library exists and can be imported.

Open your frontend's package.json.

Add the compiled WASM package to your dependencies. Assuming vyoma-core is in the same root directory as your Next.js project, link it locally:

JSON
"dependencies": {
  // ... your other dependencies
  "vyoma-core": "file:../vyoma-core/pkg"
}
Run your package manager install command (e.g., npm install or pnpm install) to link the package.

Step 3: Create the Probe Component
We will build an invisible listener component that handles the heavy lifting: downloading the memory buffer, listening for map clicks, and executing the WASM function.

Create a new file at src/components/map/light-pollution-probe.tsx and paste this code. Notice that we are utilizing your existing useMap and MapPopup components from ui/map.tsx.

TypeScript
"use client";

import { useEffect, useState } from "react";
import { useMap, MapPopup } from "@/components/ui/map";
import { get_bortle_class } from "vyoma-core";

type MapMetadata = {
  width: number;
  height: number;
  origin_lon: number;
  origin_lat: number;
  pixel_width: number;
  pixel_height: number;
};

export function LightPollutionProbe() {
  const { map, isLoaded } = useMap();
  const [engineReady, setEngineReady] = useState(false);
  const [mapData, setMapData] = useState<Uint8Array | null>(null);
  const [metadata, setMetadata] = useState<MapMetadata | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{lat: number, lng: number, bortle: number} | null>(null);

  // 1. Fetch the binary map and metadata into memory
  useEffect(() => {
    async function loadOfflineEngine() {
      try {
        const [binRes, metaRes] = await Promise.all([
          fetch("/data/light_pollution.bin"),
          fetch("/data/metadata.json")
        ]);
        
        const buffer = await binRes.arrayBuffer();
        setMapData(new Uint8Array(buffer));
        setMetadata(await metaRes.json());
        setEngineReady(true);
      } catch (error) {
        console.error("Failed to load Vyoma light pollution engine:", error);
      }
    }
    loadOfflineEngine();
  }, []);

  // 2. Listen for clicks on the MapLibre instance
  useEffect(() => {
    if (!isLoaded || !map || !engineReady || !mapData || !metadata) return;

    const handleMapClick = (e: any) => {
      const { lat, lng } = e.lngLat;
      
      // 3. Execute the microsecond WASM calculation
      const bortle = get_bortle_class(
        lat, 
        lng, 
        mapData, 
        metadata.width, 
        metadata.height, 
        metadata.origin_lon, 
        metadata.origin_lat, 
        metadata.pixel_width, 
        metadata.pixel_height
      );

      setSelectedPoint({ lat, lng, bortle });
    };

    map.on("click", handleMapClick);
    
    return () => {
      map.off("click", handleMapClick);
    };
  }, [isLoaded, map, engineReady, mapData, metadata]);

  // 4. Render the UI result
  if (!selectedPoint) return null;

  return (
    <MapPopup 
      latitude={selectedPoint.lat} 
      longitude={selectedPoint.lng}
      closeButton={true}
      onClose={() => setSelectedPoint(null)}
      className="min-w-[140px]"
    >
      <div className="flex flex-col gap-1 p-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          Sky Quality
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">Class {selectedPoint.bortle}</span>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {selectedPoint.bortle <= 3 ? "Excellent for astrophotography" : "Heavy light pollution"}
        </span>
      </div>
    </MapPopup>
  );
}
Step 4: Inject the Probe into the Map View
Finally, drop this new component inside your existing MapView so it mounts alongside MapLibre.

Open src/components/map/map-view.tsx and update it:

TypeScript
"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useVyomaSelector } from "@/store/use-vyoma-store";
import { LightPollutionProbe } from "./light-pollution-probe"; // <-- Add import

// ... your existing dynamic imports ...

export function MapView() {
  const { location, updateLocation, zoom, updateZoom, mapVisibility } =
    useVyomaSelector([ /* ... */ ]);

  // ... your existing callbacks ...

  return (
    <div className="w-full h-full relative overflow-hidden bg-muted">
      <MapComponent
        viewport={{
          center: [location.lng, location.lat],
          zoom: zoom,
        }}
        onViewportChange={handleViewportChangeWrapper}
        onViewportChangeEnd={handleViewportChangeEnd}
        scrollZoom={{ around: "center" }}
        doubleClickZoom={true}
        touchZoomRotate={{ around: "center" }}
      >
        
        {/* Geographically-synced Celestial Overlay */}
        <MapCelestialOverlay />

        {/* Inject the WASM Light Pollution Probe */}
        <LightPollutionProbe />

      </MapComponent>

      {/* Map Visibility Overlay */}
      <div
        className="absolute inset-0 bg-background pointer-events-none z-[5]"
        style={{ opacity: 1 - mapVisibility / 100 }}
      />
    </div>
  );
}
How to test it
Run your Next.js development server (npm run dev).

Open the app and click anywhere on the map.

The very first click might take a few milliseconds as the browser warms up the WASM engine, but subsequent clicks will display the Bortle Class popup instantaneously.