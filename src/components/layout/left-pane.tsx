"use client";

import {
  Cloud,
  Compass,
  Keyboard as KeyboardIcon,
  Settings2,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { KeyboardShortcutsModal } from "@/components/layout/keyboard-shortcuts-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/slider";
import { useCelestialContext } from "@/context/celestial-context";
import { useCelestialWorker } from "@/hooks/use-celestial-worker";
import type { CelestialCoordinates, TwilightPhases } from "@/lib/astrometry";
import { cn } from "@/lib/utils";
import { useVyomaSelector } from "@/store/use-vyoma-store";
import { ScoutModePanel } from "./scout-mode-panel";
import { SkyQualityBadge } from "./sky-quality-badge";

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

function formatTime(date: Date | null | undefined): string {
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    location,
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
  } = useVyomaSelector([
    "location",
    "uiOpacity",
    "setUiOpacity",
    "mapVisibility",
    "setMapVisibility",
    "lpOpacity",
    "setLpOpacity",
    "baseFontSize",
    "setBaseFontSize",
    "panelsLocked",
    "setPanelsLocked",
    "showMoon",
    "toggleMoon",
    "showLightPollution",
    "toggleLightPollution",
    "weather",
    "isWeatherLoading",
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  const {
    gcPos,
    sunPhases,
    goldenHour,
    moonPhase,
    isLoading: isCelestialLoading,
  } = useCelestialContext();

  const celestialLoading = isCelestialLoading || !gcPos;
  const weatherLoading = isWeatherLoading || !weather;

  return (
    <Container
      applyUiOpacity
      className="absolute top-28 left-8 z-20 w-full md:w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-tactical flex flex-col p-0 max-h-[calc(100%-8rem)] overflow-hidden pointer-events-auto"
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
          <div className="py-5 space-y-4">
            <SkyQualityBadge />
            <ScoutModePanel />
          </div>

          <Accordion
            type="multiple"
            defaultValue={["celestial"]}
            className="w-full"
          >
            {/* 2. System Settings */}
            <AccordionItem value="settings">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  <span>System Parameters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      UI Opacity
                    </Label>
                    <span className="font-mono text-base font-black text-primary leading-none">
                      {uiOpacity}%
                    </span>
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
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      Map Visibility
                    </Label>
                    <span className="font-mono text-base font-black text-primary leading-none">
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
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      LP Opacity
                    </Label>
                    <span className="font-mono text-base font-black text-primary leading-none">
                      {lpOpacity}%
                    </span>
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
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      Font Size
                    </Label>
                    <span className="font-mono text-base font-black text-primary leading-none">
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
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Full Screen
                    </Label>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className={cn(
                        "h-4 w-8 border transition-colors",
                        isFullscreen ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <div
                        className={cn(
                          "h-3 w-3 bg-white transition-transform",
                          isFullscreen ? "translate-x-4" : "translate-x-0.5",
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
                <div className="bg-muted/20 p-4 border-l-2 border-primary/30 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      GC Elevation
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : (
                      <span className="font-mono text-base font-black leading-none">
                        {gcPos.alt.toFixed(2)}°
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      GC Azimuth
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-4 w-12" />
                    ) : (
                      <span className="font-mono text-base font-black leading-none">
                        {gcPos.az.toFixed(2)}°{" "}
                        <span className="text-[10px] font-bold text-muted-foreground/60 ml-1">
                          {getCardinalDirection(gcPos.az)}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      Sun Rise/Set
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <span className="font-mono text-base font-black text-orange-400 leading-none">
                        {formatTime(sunPhases?.sunrise)} /{" "}
                        {formatTime(sunPhases?.sunset)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      Golden Hour
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <span className="font-mono text-sm font-black text-orange-400/80 leading-none">
                        {formatTime(goldenHour?.morning.start)} |{" "}
                        {formatTime(goldenHour?.evening.start)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-border/10">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                      Moon Phase
                    </span>
                    {celestialLoading ? (
                      <Skeleton className="h-4 w-12" />
                    ) : (
                      <div className="flex items-center gap-2 font-mono text-base font-black text-blue-300 leading-none">
                        <span className="text-xl leading-none">
                          {getMoonIcon(moonPhase?.phase ?? 0)}
                        </span>
                        <span>{moonPhase?.illumination.toFixed(1)}%</span>
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
                <div className="grid grid-cols-2 gap-4 bg-sky-400/5 p-4 border border-sky-400/10">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Temp
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : (
                      <div className="font-mono text-base font-black leading-none">
                        {weather.temperature.toFixed(1)}°C
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Clouds
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : (
                      <div className="font-mono text-base font-black leading-none">
                        {weather.cloudCover}%
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Seeing
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : (
                      <div className="font-mono text-base font-black leading-none text-emerald-400">
                        {weather.seeing}/5
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 opacity-0 pointer-events-none">
                    {/* Spacer for 2-column grid balance */}
                  </div>
                  <div className="col-span-2 pt-3 border-t border-sky-400/10 flex justify-between items-end">
                    <span className="text-[9px] uppercase font-bold text-sky-400/70">
                      Wind Vector
                    </span>
                    {weatherLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <span className="font-mono text-base font-black leading-none">
                        {weather.windSpeed.toFixed(1)}{" "}
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          km/h
                        </span>{" "}
                        <span className="text-primary/80">
                          {getCardinalDirection(weather.windDirection)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-background/50 border-t border-border/40 text-[10px] font-black flex justify-between font-mono tracking-tighter">
          <span className="text-muted-foreground/80">
            LAT:{" "}
            <span className="text-foreground">{location.lat.toFixed(4)}°N</span>
          </span>
          <span className="text-muted-foreground/80">
            LNG:{" "}
            <span className="text-foreground">{location.lng.toFixed(4)}°E</span>
          </span>
        </div>
      </div>

      <KeyboardShortcutsModal
        open={isKeyboardModalOpen}
        onOpenChange={setIsKeyboardModalOpen}
      />
    </Container>
  );
}
