"use client";

import { useEffect, useState, useMemo } from "react";
import { Star, MapPin, Navigation } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useVyomaStore, useVyomaSelector, type CuratedSpot } from "@/store/use-vyoma-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const CACHE_KEY = "vyoma-curated-spots";
const RADIUS_KM = 1000;

export function RightPane() {
  const { location } = useVyomaSelector(["location"]);
  const { updateLocation, updateZoom, setHandpickedSpots } = useVyomaStore();
  
  const [allSpots, setAllSpots] = useState<CuratedSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  // 1. Fetch and Cache
  useEffect(() => {
    async function fetchSpots() {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          setAllSpots(JSON.parse(cached));
          setIsLoading(false);
          return;
        }

        const res = await fetch("/data/curated-spots.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setAllSpots(data);
      } catch (error) {
        console.error("[RightPane] Failed to fetch curated spots:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSpots();
  }, []);

  // 2. Filter and Sort
  const processedSpots = useMemo(() => {
    if (!allSpots.length) return { local: [], global: [] };

    const withDistance = allSpots
      .filter((spot) => spot.bortle <= 3)
      .map((spot) => ({
        ...spot,
        distance: calculateDistance(location.lat, location.lng, spot.lat, spot.lng),
      }))
      .sort((a, b) => a.distance! - b.distance!);

    const local = withDistance.filter((spot) => spot.distance! <= RADIUS_KM);
    const global = withDistance;

    return { local, global };
  }, [allSpots, location.lat, location.lng]);

  const displaySpots = isGlobalMode || processedSpots.local.length === 0 
    ? processedSpots.global 
    : processedSpots.local;

  // 3. Update global state for map layer
  useEffect(() => {
    setHandpickedSpots(displaySpots);
  }, [displaySpots, setHandpickedSpots]);

  if (isLoading) return null;

  const showFallback = processedSpots.local.length === 0 && !isGlobalMode;

  return (
    <Container
      applyUiOpacity
      className="absolute top-28 right-8 z-20 w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-tactical flex flex-col p-0 max-h-[calc(100%-8rem)] overflow-hidden pointer-events-auto"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-border/40 flex items-center justify-between bg-primary/5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black tracking-widest uppercase">
                {isGlobalMode || processedSpots.local.length === 0 ? "Global Highlights" : "Nearby Dark Sites"}
              </h2>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-tight">
              {isGlobalMode || processedSpots.local.length === 0 ? "Top World Sites" : `Within ${RADIUS_KM}km`}
            </span>
          </div>
          <div className="text-[10px] font-mono text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 border border-primary/20">
            {displaySpots.length}
          </div>
        </div>

        {/* List Content */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {showFallback && (
              <div className="p-4 mb-2 bg-primary/5 border border-primary/20 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono leading-relaxed">
                  No sites within {RADIUS_KM}km.<br/>Showing Global Highlights instead.
                </p>
              </div>
            )}
            
            {displaySpots.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                  No handpicked sites found
                </p>
              </div>
            ) : (
              displaySpots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => {
                    updateLocation(spot.lat, spot.lng, spot.name);
                    updateZoom(10);
                  }}
                  className="w-full text-left p-3 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider group-hover:text-primary transition-colors truncate pr-2">
                      {spot.name}
                    </span>
                    <span className="text-[10px] font-mono bg-primary/20 px-1.5 py-0.5 text-primary border border-primary/30 shrink-0">
                      B{spot.bortle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>{spot.distance > 5000 ? ">5000" : spot.distance?.toFixed(0)} km</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="text-primary font-bold">Fly To</span>
                    </div>
                  </div>
                  {/* Subtle accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer controls */}
        <div className="p-3 border-t border-border/40 bg-muted/30 flex justify-center">
          <button
            onClick={() => setIsGlobalMode(!isGlobalMode)}
            className="text-[9px] font-mono text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <div className={cn("w-2 h-2 border border-muted-foreground", isGlobalMode && "bg-primary border-primary")} />
            {isGlobalMode ? "Switch to Nearby" : "Show All Global Sites"}
          </button>
        </div>
      </div>
    </Container>
  );
}
