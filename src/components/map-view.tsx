"use client";

import {
  Map as MapComponent,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
import { useVyomaStore } from "@/store/use-vyoma-store";

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
        onViewportChange={(_vp) => {
          // You could optionally sync map center back to state on drag:
          // updateLocation(_vp.center[1], _vp.center[0], location.label);
        }}
      >
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
        <MapMarker
          longitude={location.lng}
          latitude={location.lat}
          draggable={true}
          onDragEnd={(lngLat) => {
            updateLocation(lngLat.lat, lngLat.lng, location.label);
          }}
        >
          <MarkerContent />
        </MapMarker>
      </MapComponent>
    </div>
  );
}
