"use client";

import { MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Star } from "lucide-react";

export function HandpickedSpotsLayer() {
  const { handpickedSpots, updateLocation } = useVyomaStore();

  return (
    <>
      {handpickedSpots.map((spot) => (
        <MapMarker
          key={`handpicked-${spot.id}`}
          latitude={spot.lat}
          longitude={spot.lng}
          onClick={() => {
            updateLocation(spot.lat, spot.lng, spot.name);
          }}
        >
          <MarkerContent>
            <div className="relative group">
              {/* Primary Glow */}
              <div className="absolute inset-0 bg-primary/40 rounded-none blur-lg group-hover:bg-primary/60 transition-colors animate-pulse" />
              {/* Swiss Aesthetic Marker: Double Diamond */}
              <div className="relative h-5 w-5 border-2 border-primary bg-background flex items-center justify-center transition-transform group-hover:scale-125 active:scale-90">
                <div className="absolute inset-0 border border-primary/30 rotate-45" />
                <Star className="w-3 h-3 text-primary" fill="currentColor" />
              </div>
            </div>
          </MarkerContent>
          <MarkerTooltip className="border border-primary/30 bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-0.5">
              <span className="font-black uppercase tracking-[0.2em] text-[9px] text-primary">
                Handpicked Dark Site
              </span>
              <span className="font-bold text-sm text-foreground">{spot.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-mono">
                Bortle {spot.bortle} • {spot.distance?.toFixed(0)}km away
              </span>
            </div>
          </MarkerTooltip>
        </MapMarker>
      ))}
    </>
  );
}
