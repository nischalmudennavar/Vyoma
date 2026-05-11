"use client";

import {
  Cloud,
  Droplets,
  Thermometer,
  Wind,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Container } from "@/components/container";

function getCardinalDirection(azimuth: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const index = Math.floor((azimuth + 11.25) / 22.5) % 16;
  return directions[index];
}

export function WeatherPanel() {
  const { weather } = useVyomaStore();

  if (!weather) return null;

  return (
    <Container
      applyUiOpacity
      className="w-[320px] border border-border/80 bg-background/(--container-opacity) backdrop-blur-2xl shadow-2xl flex flex-col p-6 gap-6 pointer-events-auto transition-all duration-300"
      style={{ backgroundColor: "color-mix(in oklch, color-mix(in oklch, var(--color-background), var(--color-primary) 5%), transparent calc(100% * (1 - var(--container-opacity, 0.8))))" } as React.CSSProperties}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
          <Cloud className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90">
            Meteorology
          </h2>
        </div>
        <div className="grid gap-4 text-xs bg-muted/20 p-4 border-l-2 border-sky-400/30">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Condition</Label>
            <span className="font-mono text-foreground font-semibold">
              {weather.condition}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-sky-400/5 p-3 border border-sky-400/10">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400/80">
                <Thermometer className="w-3 h-3" />
                Temp
              </div>
              <div className="font-mono text-foreground font-bold tabular-nums">
                {weather.temperature.toFixed(1)}°C
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400/80">
                <Droplets className="w-3 h-3" />
                Humid
              </div>
              <div className="font-mono text-foreground font-bold tabular-nums">
                {weather.humidity}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400/80">
                <Cloud className="w-3 h-3" />
                Clouds
              </div>
              <div className="font-mono text-foreground font-bold tabular-nums">
                {weather.cloudCover}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400/80">
                <span className="text-[8px]">hPa</span>
                Pressure
              </div>
              <div className="font-mono text-foreground font-bold tabular-nums">
                {weather.pressure.toFixed(0)}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-border/10">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-muted-foreground">Wind</Label>
            </div>
            <span className="font-mono text-foreground font-semibold tabular-nums">
              {weather.windSpeed.toFixed(1)} km/h {getCardinalDirection(weather.windDirection)}
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
}
