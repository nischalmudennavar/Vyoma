"use client";

import { CelestialRadar } from "@/components/celestial-radar";
import {
  Map as MapComponent,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
import { useVyomaStore } from "@/store/use-vyoma-store";

/**
 * MapView component that integrates the interactive map with celestial data.
 * Updates the global observer location automatically as the user drags the map.
 */
export function MapView() {
  const location = useVyomaStore((state) => state.location);
  const updateLocation = useVyomaStore((state) => state.updateLocation);

  return (
    <div className="w-full h-full relative overflow-hidden bg-muted">
      <MapComponent
        viewport={{
          center: [location.lng, location.lat],
          zoom: 4,
        }}
        onViewportChange={(vp) => {
          // Automatically sync map center back to global state on drag
          updateLocation(vp.center[1], vp.center[0], location.label);
        }}
      >
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {/* Observer's active location marker */}
        <MapMarker
          longitude={location.lng}
          latitude={location.lat}
          draggable={true}
          onDragEnd={(lngLat) => {
            updateLocation(lngLat.lat, lngLat.lng, location.label);
          }}
        >
          <MarkerContent className="scale-125 ring-4 ring-primary/20 rounded-full" />
        </MapMarker>
      </MapComponent>

      {/* 2D Celestial Radar Overlay - Locked to the center (committed location) */}
      <CelestialRadar />
    </div>
  );
}
