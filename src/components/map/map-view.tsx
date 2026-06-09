"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import type { MapRef } from "@/components/ui/map";
import { useVyomaSelector, useVyomaStore } from "@/store/use-vyoma-store";
import { LightPollutionLayer } from "./light-pollution-layer";
import { CuratedSpotsLayer } from "./curated-spots-layer";
import { HandpickedSpotsLayer } from "./handpicked-spots-layer";

const MapCelestialOverlay = dynamic(
  () =>
    import("@/components/celestial/map-celestial-overlay").then((mod) => ({
      default: mod.MapCelestialOverlay,
    })),
  { ssr: false },
);

const MapComponent = dynamic(
  () =>
    import("@/components/ui/map").then((mod) => ({
      default: mod.Map,
    })),
  { ssr: false },
);

const _MapControls = dynamic(
  () =>
    import("@/components/ui/map").then((mod) => ({
      default: mod.MapControls,
    })),
  { ssr: false },
);

/**
 * CoordinateTooltip is a transient UI element that displays current coordinates.
 * Subscribes directly to specific Zustand selectors so only the tiny text updates,
 * leaving the heavier MapView React tree alone during 60fps panning.
 */
function CoordinateTooltip() {
  const { location } = useVyomaSelector(["location"]);
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-background/80 backdrop-blur-md border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wider flex gap-4 shadow-2xl">
        <div className="flex gap-1.5">
          <span className="text-muted-foreground font-bold">LAT</span>
          <span className="text-primary tabular-nums">
            {location.lat.toFixed(4)}°
          </span>
        </div>
        <div className="flex gap-1.5">
          <span className="text-muted-foreground font-bold">LNG</span>
          <span className="text-primary tabular-nums">
            {location.lng.toFixed(4)}°
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Performs reverse geocoding to get a human-readable address from coordinates.
 */
async function getReverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      },
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("[MapView] Reverse geocoding failed:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/**
 * MapView component that integrates the interactive map with celestial data.
 * Optimized to avoid full re-renders during high-frequency panning.
 */
export function MapView() {
  const mapRef = useRef<MapRef>(null);
  const isInternalUpdate = useRef(false);

  // 1. Subscribe ONLY to non-transient UI state.
  // We exclude 'location' and 'zoom' to prevent 60fps re-renders of the Map tree.
  const { updateLocation, updateZoom, mapVisibility, showLightPollution } =
    useVyomaSelector([
      "updateLocation",
      "updateZoom",
      "mapVisibility",
      "showLightPollution",
    ]);

  // 2. Initial values for the map (uncontrolled mode startup).
  const initialViewport = useRef({
    center: [
      useVyomaStore.getState().location.lng,
      useVyomaStore.getState().location.lat,
    ] as [number, number],
    zoom: useVyomaStore.getState().zoom,
  });

  // 3. Sync external store changes (like jump-to-location from search) to map.
  // We use manual subscription to avoid React render cycles.
  useEffect(() => {
    const unsubscribe = useVyomaStore.subscribe(
      (state) => [state.location, state.zoom] as const,
      ([location, zoom]) => {
        if (!mapRef.current) return;

        // If the update came from the map itself, ignore it.
        if (isInternalUpdate.current) return;

        // If the map is already being panned by the user, don't interrupt with store sync.
        if (mapRef.current.isMoving()) return;

        // Flag that we are performing an update from the store to the map.
        isInternalUpdate.current = true;
        mapRef.current.jumpTo({
          center: [location.lng, location.lat],
          zoom: zoom,
        });
        isInternalUpdate.current = false;
      },
    );
    return unsubscribe;
  }, []);

  const handleViewportChangeWrapper = useCallback(
    (vp: { center: [number, number]; zoom: number }) => {
      // If the map is moving because of a store update, don't sync back to the store.
      if (isInternalUpdate.current) return;

      // Continuous update for store (used by Tooltip and Astronomy calculations).
      // We pull current label directly from store to avoid a React dependency on 'location'.
      const currentLabel = useVyomaStore.getState().location.label;
      updateLocation(vp.center[1], vp.center[0], currentLabel);
      updateZoom(vp.zoom);
    },
    [updateLocation, updateZoom],
  );

  const handleViewportChangeEnd = useCallback(
    async (vp: { center: [number, number]; zoom: number }) => {
      // If movement ended because of a store update, ignore.
      if (isInternalUpdate.current) return;

      // Once movement stops, perform the heavy reverse geocode.
      const label = await getReverseGeocode(vp.center[1], vp.center[0]);
      updateLocation(vp.center[1], vp.center[0], label);
    },
    [updateLocation],
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-muted">
      <MapComponent
        ref={mapRef}
        viewport={initialViewport.current}
        onViewportChange={handleViewportChangeWrapper}
        onViewportChangeEnd={handleViewportChangeEnd}
        scrollZoom={{ around: "center" }}
        doubleClickZoom={true}
        touchZoomRotate={{ around: "center" }}
      >
        {/* Curated Dark Sky Spots */}
        <CuratedSpotsLayer />

        {/* Handpicked Dark Sky Spots (Filtered by proximity) */}
        <HandpickedSpotsLayer />

        {/* The WASM Canvas Engine Layer */}
        <LightPollutionLayer isVisible={showLightPollution} />

        {/* Geographically-synced Celestial Overlay */}
        <MapCelestialOverlay />
      </MapComponent>

      {/* Transient coordinate tooltip - subscribes directly to location */}
      <CoordinateTooltip />

      {/* Map Visibility Overlay */}
      <div
        className="absolute inset-0 bg-background pointer-events-none z-[5]"
        style={{ opacity: 1 - mapVisibility / 100 }}
      />
    </div>
  );
}
