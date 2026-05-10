"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useVyomaSelector } from "@/store/use-vyoma-store";

const CelestialRadar = dynamic(
  () =>
    import("@/components/celestial-radar").then((mod) => ({
      default: mod.CelestialRadar,
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

const MapControls = dynamic(
  () =>
    import("@/components/ui/map").then((mod) => ({
      default: mod.MapControls,
    })),
  { ssr: false },
);

const MapMarker = dynamic(
  () =>
    import("@/components/ui/map").then((mod) => ({
      default: mod.MapMarker,
    })),
  { ssr: false },
);

const MarkerContent = dynamic(
  () =>
    import("@/components/ui/map").then((mod) => ({
      default: mod.MarkerContent,
    })),
  { ssr: false },
);

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
 * Updates the global observer location automatically as the user drags the map.
 */
export function MapView() {
  const { location, updateLocation, zoom, updateZoom, mapVisibility } =
    useVyomaSelector([
      "location",
      "updateLocation",
      "zoom",
      "updateZoom",
      "mapVisibility",
    ]);

  const handleDrag = useCallback(
    (lngLat: { lat: number; lng: number }) => {
      // Fast update for radar/visuals during drag (preserving label)
      updateLocation(lngLat.lat, lngLat.lng, location.label);
    },
    [updateLocation, location.label],
  );

  const handleDragEnd = useCallback(
    async (lngLat: { lat: number; lng: number }) => {
      // On drop, update with reverse geocoded label
      const label = await getReverseGeocode(lngLat.lat, lngLat.lng);
      updateLocation(lngLat.lat, lngLat.lng, label);
    },
    [updateLocation],
  );

  const handleViewportChangeWrapper = useCallback(
    (vp: { center: [number, number]; zoom: number }) => {
      // Continuous update for visuals (preserving label to avoid search field jitter)
      updateLocation(vp.center[1], vp.center[0], location.label);
      updateZoom(vp.zoom);
    },
    [updateLocation, updateZoom, location.label],
  );

  const handleViewportChangeEnd = useCallback(
    async (vp: { center: [number, number]; zoom: number }) => {
      // Once movement stops, update with reverse geocoded label
      const label = await getReverseGeocode(vp.center[1], vp.center[0]);
      updateLocation(vp.center[1], vp.center[0], label);
    },
    [updateLocation],
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-muted">
      <MapComponent
        viewport={{
          center: [location.lng, location.lat],
          zoom: zoom,
        }}
        onViewportChange={handleViewportChangeWrapper}
        onViewportChangeEnd={handleViewportChangeEnd}
      >
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {/* Observer's active location marker - anchored at center to avoid shifting during zoom */}
        <MapMarker
          longitude={location.lng}
          latitude={location.lat}
          draggable={true}
          anchor="center"
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          <MarkerContent className="scale-125 ring-4 ring-primary/20 rounded-none" />
        </MapMarker>
      </MapComponent>

      {/* Map Visibility Overlay */}
      <div
        className="absolute inset-0 bg-background pointer-events-none z-[5]"
        style={{ opacity: 1 - mapVisibility / 100 }}
      />

      {/* 2D Celestial Radar Overlay - Locked to the center (committed location) */}
      <CelestialRadar />
    </div>
  );
}
