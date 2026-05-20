"use client";

import {
  Cloud,
  Compass,
  Keyboard as KeyboardIcon,
  MapPin,
  Settings2,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { KeyboardShortcutsModal } from "@/components/layout/keyboard-shortcuts-modal";
import { LocationAutocomplete } from "@/components/location/location-autocomplete";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/slider";
import { DatePicker } from "@/components/ui/date-picker";
import { useCelestialWorker } from "@/hooks/use-celestial-worker";
import type { CelestialCoordinates, TwilightPhases } from "@/lib/astrometry";
import { cn } from "@/lib/utils";
import { useVyomaStore } from "@/store/use-vyoma-store";

// --- Helper Functions (Shared from previous panels) ---

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

function getCardinalDirection(azimuth: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.floor((azimuth + 11.25) / 22.5) % 16;
  return directions[index];
}

function formatTime(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

interface CelestialData {
  gcPos: CelestialCoordinates;
  gcVis: { rise: Date | null; set: Date | null };
  sunPhases: TwilightPhases;
  moonRiseSet: { rise: Date | null; set: Date | null };
  goldenHour: {
    morning: { start: Date | null; end: Date | null };
    evening: { start: Date | null; end: Date | null };
  };
  sunDetails: { distanceKm: number; angularDiameter: number };
  moonDetails: { distanceKm: number; angularDiameter: number };
  moonPhase: { phase: number; name: string; illumination: number };
}

export function LeftPane() {
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);

  const {
    location,
    viewDate,
    updateDate,
    updateTime,
    updateLocation,
    uiOpacity,
    setUiOpacity,
    mapVisibility,
    setMapVisibility,
    lpOpacity,
    setLpOpacity,
    baseFontSize,
    setBaseFontSize,
    panelsLocked,
    setPanelsLocked,
    showMoon,
    toggleMoon,
    showLightPollution,
    toggleLightPollution,
    weather,
    isWeatherLoading,
  } = useVyomaStore();

  const celestialPayload = useMemo(
    () => ({
      date: viewDate.toISOString(),
      lat: location.lat,
      lng: location.lng,
    }),
    [viewDate, location.lat, location.lng],
  );

  const { data, isLoading: isCelestialLoading } =
    useCelestialWorker<CelestialData>("CALCULATE_ALL", celestialPayload);

  const celestialLoading = !data || isCelestialLoading;
  const weatherLoading = isWeatherLoading || !weather;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      updateTime(hours, minutes);
    }
  };

  const hours = viewDate.getHours().toString().padStart(2, "0");
  const minutes = viewDate.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  return (
    <Container
      applyUiOpacity
      className="absolute top-28 left-8 z-20 w-full md:w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl flex flex-col p-0 max-h-[calc(100%-8rem)] overflow-hidden pointer-events-auto"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-border/40 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black tracking-widest uppercase">
              System Control
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsKeyboardModalOpen(true)}
            className="hover:bg-primary/20"
          >
            <KeyboardIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Accordion Content */}
        <div className="flex-1 overflow-y-auto p-5 pt-0 custom-scrollbar">
          <Accordion
            type="multiple"
            defaultValue={["location-time"]}
            className="w-full"
          >
            {/* 1. Location & Chronology */}
            <AccordionItem value="location-time">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Geospatial & Time</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <LocationAutocomplete />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                        Lat
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        value={location.lat}
                        onChange={(e) =>
                          updateLocation(
                            parseFloat(e.target.value) || 0,
                            location.lng,
                            location.label,
                          )
                        }
                        className="h-8 text-xs bg-muted/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                        Lng
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        value={location.lng}
                        onChange={(e) =>
                          updateLocation(
                            location.lat,
                            parseFloat(e.target.value) || 0,
                            location.label,
                          )
                        }
                        className="h-8 text-xs bg-muted/30"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/10">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Date
                    </Label>
                    <DatePicker
                      date={viewDate}
                      setDate={(date) => date && updateDate(date)}
                      className="h-8 text-xs bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Time
                    </Label>
                    <Input
                      type="time"
                      value={timeString}
                      onChange={handleTimeChange}
                      className="h-8 text-xs bg-muted/30"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. System Settings */}
            <AccordionItem value="settings">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  <span>System Parameters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      UI Opacity
                    </Label>
                    <span className="font-mono text-[10px]">{uiOpacity}%</span>
                  </div>
                  <Slider
                    value={[uiOpacity]}
                    onValueChange={([val]) => setUiOpacity(val)}
                    min={20}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Map Visibility
                    </Label>
                    <span className="font-mono text-[10px]">
                      {mapVisibility}%
                    </span>
                  </div>
                  <Slider
                    value={[mapVisibility]}
                    onValueChange={([val]) => setMapVisibility(val)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      LP Opacity
                    </Label>
                    <span className="font-mono text-[10px]">{lpOpacity}%</span>
                  </div>
                  <Slider
                    value={[lpOpacity]}
                    onValueChange={([val]) => setLpOpacity(val)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Font Size
                    </Label>
                    <span className="font-mono text-[10px]">
                      {baseFontSize}px
                    </span>
                  </div>
                  <Slider
                    value={[baseFontSize]}
                    onValueChange={([val]) => setBaseFontSize(val)}
                    min={10}
                    max={24}
                    step={1}
                  />
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t border-border/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Lunar Layer
                    </Label>
                    <button
                      type="button"
                      onClick={toggleMoon}
                      className={cn(
                        "h-4 w-8 border transition-colors",
                        showMoon ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <div
                        className={cn(
                          "h-3 w-3 bg-white transition-transform",
                          showMoon ? "translate-x-4" : "translate-x-0.5",
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      LP Engine
                    </Label>
                    <button
                      type="button"
                      onClick={toggleLightPollution}
                      className={cn(
                        "h-4 w-8 border transition-colors",
                        showLightPollution ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <div
                        className={cn(
                          "h-3 w-3 bg-white transition-transform",
                          showLightPollution
                            ? "translate-x-4"
                            : "translate-x-0.5",
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Lock Panels
                    </Label>
                    <button
                      type="button"
                      onClick={() => setPanelsLocked(!panelsLocked)}
                      className={cn(
                        "h-4 w-8 border transition-colors",
                        panelsLocked ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <div
                        className={cn(
                          "h-3 w-3 bg-white transition-transform",
                          panelsLocked ? "translate-x-4" : "translate-x-0.5",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Celestial Status */}
            <AccordionItem value="celestial">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Celestial Metrics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="bg-muted/20 p-3 border-l-2 border-primary/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      GC Elevation
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <span className="font-mono text-xs">
                        {data.gcPos.alt.toFixed(2)}°
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      GC Azimuth
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-3 w-12" />
                    ) : (
                      <span className="font-mono text-xs">
                        {data.gcPos.az.toFixed(2)}°{" "}
                        {getCardinalDirection(data.gcPos.az)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Sun Rise/Set
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-3 w-16" />
                    ) : (
                      <span className="font-mono text-xs text-orange-400">
                        {formatTime(data.sunPhases.sunrise)} /{" "}
                        {formatTime(data.sunPhases.sunset)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Golden Hour (M/E)
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-3 w-20" />
                    ) : (
                      <span className="font-mono text-[10px] text-orange-400/80">
                        {formatTime(data.goldenHour.morning.start)} |{" "}
                        {formatTime(data.goldenHour.evening.start)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-border/10">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Moon Phase
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-3 w-12" />
                    ) : (
                      <div className="flex items-center gap-1 font-mono text-xs text-blue-300">
                        <span>{getMoonIcon(data.moonPhase.phase)}</span>
                        <span>{data.moonPhase.illumination.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Atmospheric Conditions */}
            <AccordionItem value="weather">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  <span>Meteorological</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 bg-sky-400/5 p-3 border border-sky-400/10">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Temp
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <div className="font-mono text-sm">
                        {weather.temperature.toFixed(1)}°C
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Clouds
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <div className="font-mono text-sm">
                        {weather.cloudCover}%
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Bortle
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <div className="font-mono text-sm">
                        {weather.bortle}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Seeing
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <div className="font-mono text-sm">
                        {weather.seeing}/5
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 pt-2 border-t border-sky-400/10 flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Wind Vector
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-3 w-24" />
                    ) : (
                      <span className="font-mono text-[10px]">
                        {weather.windSpeed.toFixed(1)} km/h{" "}
                        {getCardinalDirection(weather.windDirection)}
                      </span>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-background/50 border-t border-border/40 text-[9px] text-muted-foreground/60 flex justify-between font-mono">
          <span>{location.lat.toFixed(4)}°N</span>
          <span>{location.lng.toFixed(4)}°E</span>
        </div>
      </div>

      <KeyboardShortcutsModal
        open={isKeyboardModalOpen}
        onOpenChange={setIsKeyboardModalOpen}
      />
    </Container>
  );
}
