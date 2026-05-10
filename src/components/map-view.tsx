"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
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
 * MapView component that integrates the interactive map with celestial data.
 * Updates the global observer location automatically as the user drags the map.
 */
export function MapView() {
  const { location, updateLocation, zoom, updateZoom } = useVyomaSelector([
    "location",
    "updateLocation",
    "zoom",
    "updateZoom",
  ]);
  const labelRef = useRef(location.label);
  labelRef.current = location.label;

  const handleViewportChange = useCallback(
    (vp: { center: [number, number]; zoom: number }) => {
      updateLocation(vp.center[1], vp.center[0], labelRef.current);
      updateZoom(vp.zoom);
    },
    [updateLocation, updateZoom],
  );

  const handleDragEnd = useCallback(
    (lngLat: { lat: number; lng: number }) => {
      updateLocation(lngLat.lat, lngLat.lng, labelRef.current);
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
        onViewportChange={handleViewportChange}
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
          onDragEnd={handleDragEnd}
        >
          <MarkerContent className="scale-125 ring-4 ring-primary/20 rounded-full" />
        </MapMarker>
      </MapComponent>

      {/* 2D Celestial Radar Overlay - Locked to the center (committed location) */}
      <CelestialRadar />
    </div>
  );
}
