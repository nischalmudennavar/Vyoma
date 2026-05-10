"use client";

import { Binoculars, Clock, MapPin, Moon, Star, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  getGalacticCorePosition,
  getGalacticCoreVisibility,
  getGoldenHour,
  getMoonDetails,
  getMoonPhase,
  getMoonRiseSet,
  getSunDetails,
  getTwilightPhases,
} from "@/lib/astrometry";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Container } from "@/components/container";

/**
 * Returns the appropriate moon emoji for a given phase angle (0-360).
 * Phase angles: 0 (New), 90 (First Quarter), 180 (Full), 270 (Last Quarter).
 */
function getMoonIcon(phaseAngle: number): string {
  if (phaseAngle < 22.5 || phaseAngle >= 337.5) return "🌑";
  if (phaseAngle < 67.5) return "🌒";
  if (phaseAngle < 112.5) return "🌓";
  if (phaseAngle < 157.5) return "🌔";
  if (phaseAngle < 202.5) return "🌕";
  if (phaseAngle < 247.5) return "🌖";
  if (phaseAngle < 292.5) return "🌗";
  return "🌘";
}

/**
 * Formats a date to HH:mm string.
 * @param date - The date to format.
 * @returns Formatted time string or --:-- if null.
 */
function formatTime(date: Date | null): string {
  if (!date) return "--:--";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * A detail panel that displays astronomical data on the right side of the viewport.
 * Occupies 15% of the viewport width with a minimum width for readability.
 */
export function AstronomyDetails() {
  const { viewDate, location } = useVyomaStore();

  const gcPos = getGalacticCorePosition(viewDate, location.lat, location.lng);
  const gcVis = getGalacticCoreVisibility(viewDate, location.lat, location.lng);
  const sunPhases = getTwilightPhases(viewDate, location.lat, location.lng);
  const moonRiseSet = getMoonRiseSet(viewDate, location.lat, location.lng);
  const goldenHour = getGoldenHour(viewDate, location.lat, location.lng);
  const sunDetails = getSunDetails(viewDate, location.lat, location.lng);
  const moonDetails = getMoonDetails(viewDate);
  const moonPhase = getMoonPhase(viewDate);

  return (
    <Container
      applyUiOpacity
      className="absolute top-6 right-6 z-20 w-[15vw] min-w-[300px] border border-border/40 bg-background/60 backdrop-blur-2xl shadow-2xl flex flex-col p-6 gap-8 max-h-[calc(100%-3rem)] overflow-y-auto pointer-events-auto transition-all duration-300"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
          <Star className="w-4 h-4 text-primary animate-pulse" />
          <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90">
            Galactic Core
          </h2>
        </div>
        <div className="grid gap-4 text-xs">
          <div className="flex justify-between items-center group">
            <Label className="text-muted-foreground group-hover:text-foreground/70 transition-colors">
              Elevation
            </Label>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {gcPos.alt.toFixed(2)}°
            </span>
          </div>
          <div className="flex justify-between items-center group">
            <Label className="text-muted-foreground group-hover:text-foreground/70 transition-colors">
              Azimuth
            </Label>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {gcPos.az.toFixed(2)}°
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-border/10">
            <Label className="text-muted-foreground">Visibility</Label>
            <span className="font-mono text-primary font-bold tabular-nums">
              {formatTime(gcVis.rise)} — {formatTime(gcVis.set)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2.5 border-t border-border/40 pt-3">
          <Sun className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90">
            Sun & Golden
          </h2>
        </div>
        <div className="grid gap-4 text-xs">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Rise / Set</Label>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {formatTime(sunPhases.sunrise)} / {formatTime(sunPhases.sunset)}
            </span>
          </div>

          <div className="space-y-2.5 bg-orange-400/5 p-3 rounded-none border border-orange-400/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400/80" />
                <Label className="text-[10px] uppercase font-bold text-orange-400/80">
                  Morning
                </Label>
              </div>
              <span className="font-mono text-orange-400 font-bold tabular-nums">
                {formatTime(goldenHour.morning.start)} -{" "}
                {formatTime(goldenHour.morning.end)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400/80" />
                <Label className="text-[10px] uppercase font-bold text-orange-400/80">
                  Evening
                </Label>
              </div>
              <span className="font-mono text-orange-400 font-bold tabular-nums">
                {formatTime(goldenHour.evening.start)} -{" "}
                {formatTime(goldenHour.evening.end)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-border/10">
            <div className="flex items-center gap-1.5">
              <Binoculars className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-muted-foreground">Angular Dia.</Label>
            </div>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {sunDetails.angularDiameter.toFixed(3)}°
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2.5 border-t border-border/40 pt-3">
          <Moon className="w-4 h-4 text-blue-300" />
          <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90">
            Moon
          </h2>
        </div>
        <div className="grid gap-4 text-xs">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Rise / Set</Label>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {formatTime(moonRiseSet.rise)} / {formatTime(moonRiseSet.set)}
            </span>
          </div>
          <div className="flex justify-between items-center group">
            <Label className="text-muted-foreground group-hover:text-foreground/70 transition-colors">
              Phase & Illum.
            </Label>
            <span className="font-mono text-foreground font-bold tabular-nums flex items-center gap-1.5">
              <span className="text-base leading-none">
                {getMoonIcon(moonPhase.phase)}
              </span>
              {moonPhase.illumination.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center group">
            <div className="flex items-center gap-1.5">
              <Binoculars className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-muted-foreground">Angular Dia.</Label>
            </div>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {moonDetails.angularDiameter.toFixed(3)}°
            </span>
          </div>
        </div>
      </div>

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
