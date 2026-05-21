"use client";

import { Cloud, Droplets, Star, Thermometer, Wind } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PaneItemContainer } from "@/components/layout/pane-item-container";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useVyomaStore, type WeatherData } from "@/store/use-vyoma-store";
import { getCardinalDirection } from "@/lib/astrometry-utils";

export function MeteorologySection({
  weather,
  loading,
}: {
  weather: WeatherData | null;
  loading: boolean;
}) {
  const isLoading = loading || !weather;
  const bortle = useVyomaStore((state) => state.bortle);
  return (
    <PaneItemContainer
      title="Meteorology"
      icon={<Cloud className={cn("w-4 h-4", isLoading && "animate-pulse")} />}
      iconThemeClass="text-white/60"
      borderThemeClass="border-white/10"
    >
      <div className="flex justify-between items-center">
        <Label className="tactical-label">Condition</Label>
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <span className="tactical-value">{weather.condition}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 bg-white/5 p-3 border border-white/5">
        {/* Temperature */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 tactical-label">
            <Thermometer className="w-3 h-3" />
            Temp
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <div className="tactical-value tabular-nums">
              {weather.temperature.toFixed(1)}°C
            </div>
          )}
        </div>

        {/* Humidity */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 tactical-label">
            <Droplets className="w-3 h-3" />
            Humid
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-10" />
          ) : (
            <div className="tactical-value tabular-nums">
              {weather.humidity}%
            </div>
          )}
        </div>

        {/* Cloud Cover */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 tactical-label">
            <Cloud className="w-3 h-3" />
            Clouds
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-10" />
          ) : (
            <div className="tactical-value tabular-nums">
              {weather.cloudCover}%
              <div className="flex gap-1 mt-0.5 opacity-40">
                <div
                  className="h-1 flex-1 bg-white/30"
                  style={{ width: `${weather.cloudCoverHigh}%` }}
                  title="High"
                />
                <div
                  className="h-1 flex-1 bg-white/50"
                  style={{ width: `${weather.cloudCoverMid}%` }}
                  title="Mid"
                />
                <div
                  className="h-1 flex-1 bg-white/70"
                  style={{ width: `${weather.cloudCoverLow}%` }}
                  title="Low"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pressure */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 tactical-label">
            <span className="text-[8px] leading-none">hPa</span>
            Pressure
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-14" />
          ) : (
            <div className="tactical-value tabular-nums">
              {weather.pressure.toFixed(0)}
            </div>
          )}
        </div>

        {/* Dew Point */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 tactical-label">
            <Thermometer className="w-3 h-3 opacity-50" />
            Dew Pt
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <div className="tactical-value tabular-nums">
              {weather.dewPoint.toFixed(1)}°C
            </div>
          )}
        </div>

        {/* Bortle Scale */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 tactical-label">
            <Star className="w-3 h-3" />
            Bortle
          </div>
          <div className="tactical-value tabular-nums">{bortle}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
        <div className="space-y-1">
          <Label className="tactical-label">Seeing</Label>
          {isLoading ? (
            <Skeleton className="h-3 w-16" />
          ) : (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-3",
                    i <= weather.seeing ? "bg-emerald-500/80" : "bg-white/10",
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <Label className="tactical-label">Transparency</Label>
          {isLoading ? (
            <Skeleton className="h-3 w-16" />
          ) : (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-3",
                    i <= weather.transparency
                      ? "bg-blue-500/80"
                      : "bg-white/10",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-white/40" />
          <Label className="tactical-label">Wind</Label>
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="tactical-value tabular-nums">
            {weather.windSpeed.toFixed(1)}{" "}
            <span className="text-[10px] opacity-60">km/h</span>{" "}
            {getCardinalDirection(weather.windDirection)}
          </span>
        )}
      </div>
    </PaneItemContainer>
  );
}

export function BortleSection({
  bortle: _ignored,
  loading,
}: {
  bortle: number | undefined;
  loading: boolean;
}) {
  const bortle = useVyomaStore((state) => state.bortle);
  const isLoading = loading;
  return (
    <PaneItemContainer
      title="Light Pollution"
      icon={<Star className={cn("w-4 h-4", isLoading && "animate-pulse")} />}
      iconThemeClass="text-yellow-400"
      borderThemeClass="border-yellow-400/30"
    >
      <div className="flex justify-between items-center">
        <Label className="tactical-label">Bortle Class</Label>
        {isLoading ? (
          <Skeleton className="h-4 w-10" />
        ) : (
          <div className="text-2xl font-black tabular-nums text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
            {bortle}
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight">
        Class {bortle} indicates{" "}
        {bortle <= 3
          ? "Excellent Dark Skies"
          : bortle <= 6
            ? "Suburban Light Pollution"
            : "Heavy Urban Glow"}
        .
      </p>
    </PaneItemContainer>
  );
}

export function WeatherPanel() {
  const { weather, isWeatherLoading } = useVyomaStore();

  return (
    <Container
      tactical
      className="w-full md:w-[320px] flex flex-col p-6 gap-6 pointer-events-auto transition-all duration-300 rounded-lg"
    >
      <MeteorologySection weather={weather} loading={isWeatherLoading} />
    </Container>
  );
}
