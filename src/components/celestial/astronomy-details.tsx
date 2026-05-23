"use client";
import { Binoculars, Clock, MapPin, Moon, Star, Sun } from "lucide-react";
import { useMemo } from "react";
import { Container } from "@/components/layout/container";
import { PaneItemContainer } from "@/components/layout/pane-item-container";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCelestialWorker } from "@/hooks/use-celestial-worker";
import type { CelestialCoordinates, TwilightPhases } from "@/lib/astrometry";
import {
  formatTime,
  getCardinalDirection,
  getMoonIcon,
} from "@/lib/astrometry-utils";
import { cn } from "@/lib/utils";
import { useVyomaStore } from "@/store/use-vyoma-store";

export interface CelestialData {
  gcPos: CelestialCoordinates;
  gcVis: { rise: Date | null; set: Date | null };
  sunPhases: TwilightPhases;
  moonRiseSet: { rise: Date | null; set: Date | null };
  moonFreeWindow: { start: Date | null; end: Date | null };
  goldenHour: {
    morning: { start: Date | null; end: Date | null };
    evening: { start: Date | null; end: Date | null };
  };
  sunDetails: { distanceKm: number; angularDiameter: number };
  moonDetails: { distanceKm: number; angularDiameter: number };
  moonPhase: { phase: number; name: string; illumination: number };
}

export function GalacticCoreSection({
  data,
  loading,
}: {
  data: CelestialData | null;
  loading: boolean;
}) {
  return (
    <PaneItemContainer
      title="Galactic Core"
      icon={<Star className={cn("w-4 h-4", loading && "animate-pulse")} />}
    >
      <div className="flex justify-between items-center group">
        <Label className="text-muted-foreground group-hover:text-foreground/70 transition-colors">
          Elevation
        </Label>
        {loading || !data ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="font-mono text-foreground font-semibold tabular-nums">
            {data.gcPos.alt.toFixed(2)}°
          </span>
        )}
      </div>
      <div className="flex justify-between items-center group">
        <Label className="text-muted-foreground group-hover:text-foreground/70 transition-colors">
          Azimuth
        </Label>
        {loading || !data ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          <span className="font-mono text-foreground font-semibold tabular-nums flex items-center gap-1.5">
            {data.gcPos.az.toFixed(2)}°
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest">
              {getCardinalDirection(data.gcPos.az)}
            </span>
          </span>
        )}
      </div>
      <div className="flex justify-between items-center pt-1 border-t border-border/10">
        <Label className="text-muted-foreground">Visibility</Label>
        {loading || !data ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="font-mono text-primary font-bold tabular-nums">
            {formatTime(data.gcVis.rise)} — {formatTime(data.gcVis.set)}
          </span>
        )}
      </div>
    </PaneItemContainer>
  );
}

export function SunTwilightSection({
  data,
  loading,
}: {
  data: CelestialData | null;
  loading: boolean;
}) {
  return (
    <PaneItemContainer
      title="Sun & Twilight"
      icon={<Sun className={cn("w-4 h-4", loading && "animate-pulse")} />}
      iconThemeClass="text-orange-400"
      borderThemeClass="border-orange-400/30"
    >
      <div className="flex justify-between items-center">
        <Label className="text-muted-foreground">Rise / Set</Label>
        {loading || !data ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="font-mono text-foreground font-semibold tabular-nums">
            {formatTime(data.sunPhases.sunrise)} /{" "}
            {formatTime(data.sunPhases.sunset)}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center bg-indigo-500/10 p-2 border border-indigo-500/20">
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3 text-indigo-400" />
          <Label className="text-[10px] uppercase font-bold text-indigo-400">
            True Night
          </Label>
        </div>
        {loading || !data ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="font-mono text-indigo-400 font-bold tabular-nums text-xs">
            {formatTime(data.sunPhases.astronomicalDusk)} -{" "}
            {formatTime(data.sunPhases.astronomicalDawn)}
          </span>
        )}
      </div>

      <div className="space-y-1 bg-orange-400/10 p-3 rounded-none border border-orange-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-400/80" />
            <Label className="text-[10px] uppercase font-bold text-orange-400/80">
              Morning
            </Label>
          </div>
          {loading || !data ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span className="font-mono text-orange-400 font-bold tabular-nums text-sm">
              {formatTime(data.goldenHour.morning.start)} -{" "}
              {formatTime(data.goldenHour.morning.end)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-400/80" />
            <Label className="text-[10px] uppercase font-bold text-orange-400/80">
              Evening
            </Label>
          </div>
          {loading || !data ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span className="font-mono text-orange-400 font-bold tabular-nums text-sm">
              {formatTime(data.goldenHour.evening.start)} -{" "}
              {formatTime(data.goldenHour.evening.end)}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-1 border-t border-border/10">
        <div className="flex items-center gap-1.5">
          <Binoculars className="w-3.5 h-3.5 text-muted-foreground" />
          <Label className="text-muted-foreground">Angular Dia.</Label>
        </div>
        {loading || !data ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="font-mono text-foreground font-semibold tabular-nums">
            {data.sunDetails.angularDiameter.toFixed(3)}°
          </span>
        )}
      </div>
    </PaneItemContainer>
  );
}

export function MoonImagingSection({
  data,
  loading,
}: {
  data: CelestialData | null;
  loading: boolean;
}) {
  return (
    <PaneItemContainer
      title="Moon & Imaging"
      icon={<Moon className={cn("w-4 h-4", loading && "animate-pulse")} />}
      iconThemeClass="text-blue-300"
      borderThemeClass="border-blue-300/30"
    >
      <div className="flex justify-between items-center">
        <Label className="text-muted-foreground">Rise / Set</Label>
        {loading || !data ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="font-mono text-foreground font-semibold tabular-nums">
            {formatTime(data.moonRiseSet.rise)} /{" "}
            {formatTime(data.moonRiseSet.set)}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center bg-emerald-500/10 p-2 border border-emerald-500/20">
        <div className="flex items-center gap-1.5">
          <Binoculars className="w-3 h-3 text-emerald-400" />
          <Label className="text-[10px] uppercase font-bold text-emerald-400">
            Moon-Free
          </Label>
        </div>
        {loading || !data ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="font-mono text-emerald-400 font-bold tabular-nums text-xs">
            {data.moonFreeWindow.start
              ? `${formatTime(data.moonFreeWindow.start)} - ${formatTime(data.moonFreeWindow.end)}`
              : "None"}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center group">
        <Label className="text-muted-foreground group-hover:text-foreground/70 transition-colors">
          Phase & Illum.
        </Label>
        {loading || !data ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          <span className="font-mono text-foreground font-bold tabular-nums flex items-center gap-1.5">
            <span className="text-base leading-none">
              {getMoonIcon(data.moonPhase.phase)}
            </span>
            {data.moonPhase.illumination.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex justify-between items-center group">
        <div className="flex items-center gap-1.5">
          <Binoculars className="w-3.5 h-3.5 text-muted-foreground" />
          <Label className="text-muted-foreground">Angular Dia.</Label>
        </div>
        {loading || !data ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="font-mono text-foreground font-semibold tabular-nums">
            {data.moonDetails.angularDiameter.toFixed(3)}°
          </span>
        )}
      </div>
    </PaneItemContainer>
  );
}

/**
 * A detail panel that displays astronomical data.
 */
export function AstronomyDetails() {
  const { viewDate, location } = useVyomaStore();

  const celestialPayload = useMemo(
    () => ({
      date: viewDate.toISOString(),
      lat: location.lat,
      lng: location.lng,
    }),
    [viewDate, location.lat, location.lng],
  );

  const { data, isLoading } = useCelestialWorker<CelestialData>(
    "CALCULATE_ALL",
    celestialPayload,
  );

  const loading = !data || isLoading;

  return (
    <Container
      applyUiOpacity
      className="w-full md:w-[320px] border border-border/80 bg-background/(--container-opacity) backdrop-blur-2xl shadow-2xl flex flex-col p-6 gap-6 max-h-[80vh] overflow-y-auto pointer-events-auto transition-all duration-300"
      style={
        {
          backgroundColor:
            "color-mix(in oklch, color-mix(in oklch, var(--color-background), var(--color-primary) 5%), transparent calc(100% * (1 - var(--container-opacity, 0.8))))",
        } as React.CSSProperties
      }
    >
      <GalacticCoreSection data={data} loading={loading} />
      <SunTwilightSection data={data} loading={loading} />
      <MoonImagingSection data={data} loading={loading} />

      {/* Location Footer */}
      <div className="mt-auto pt-5 text-[10px] text-muted-foreground/80 border-t border-border/40 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary/60" />
          <span className="font-medium truncate">
            {location.label || "Custom Location"}
          </span>
        </div>
        <div className="flex justify-between font-mono tracking-tighter opacity-70">
          <span>{location.lat.toFixed(4)}°N</span>
          <span>{location.lng.toFixed(4)}°E</span>
        </div>
      </div>
    </Container>
  );
}
