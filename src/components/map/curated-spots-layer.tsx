"use client";

import { useEffect, useState } from "react";
import { MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Star } from "lucide-react";

interface CuratedSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  bortle: number;
  description: string;
}

export function CuratedSpotsLayer() {
  const [spots, setSpots] = useState<CuratedSpot[]>([]);
  const updateLocation = useVyomaStore((state) => state.updateLocation);

  useEffect(() => {
    async function loadSpots() {
      try {
        const res = await fetch("/data/curated-spots.json");
        const data = await res.json();
        setSpots(data);
      } catch (error) {
        console.error("Failed to load curated spots:", error);
      }
    }
    loadSpots();
  }, []);

  return (
    <>
      {spots.map((spot) => (
        <MapMarker
          key={spot.id}
          latitude={spot.lat}
          longitude={spot.lng}
          onClick={() => {
            updateLocation(spot.lat, spot.lng, spot.name);
          }}
        >
          <MarkerContent>
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-yellow-400/30 rounded-none blur-md group-hover:bg-yellow-400/50 transition-colors animate-pulse" />
              {/* Swiss Aesthetic Marker: Diamond/Square rotated */}
              <div className="relative h-4 w-4 rotate-45 border border-yellow-400 bg-background flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.4)] transition-transform group-hover:scale-110 active:scale-95">
                <Star className="w-2.5 h-2.5 text-yellow-400 -rotate-45" fill="currentColor" />
              </div>
            </div>
          </MarkerContent>
          <MarkerTooltip className="border border-yellow-400/20">
            <div className="flex flex-col gap-0.5">
              <span className="font-black uppercase tracking-widest text-[10px]">
                Dark Sky Site
              </span>
              <span className="font-bold text-sm">{spot.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-mono">
                Bortle {spot.bortle} • {spot.description}
              </span>
            </div>
          </MarkerTooltip>
        </MapMarker>
      ))}
    </>
  );
}
