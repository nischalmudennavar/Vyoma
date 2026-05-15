"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";

// Import modular components
import { AstronomyDetails } from "@/components/celestial/astronomy-details";
import { WeatherPanel } from "@/components/weather/weather-panel";
import { ControlPanel } from "@/components/layout/control-panel";
import { UtilsPane } from "@/components/layout/utils-pane";

const MapView = dynamic(
  () =>
    import("@/components/map/map-view").then((mod) => ({ default: mod.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-background animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Initializing Celestial Map...
        </span>
      </div>
    ),
  },
);

const EphemerisOverlay = dynamic(
  () =>
    import("@/components/celestial/ephemeris-overlay").then((mod) => ({
      default: mod.EphemerisOverlay,
    })),
  { ssr: false },
);

const SettingsPanel = dynamic(
  () =>
    import("@/components/layout/settings-panel").then((mod) => ({
      default: mod.SettingsPanel,
    })),
  { ssr: false },
);

import { useHotkeys } from "@/hooks/use-hotkeys";
import { CommandPalette } from "@/components/navigation/command-palette";

export function Dashboard() {
  useHotkeys();

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground relative">
      <Header />
      {/* <CommandPalette /> */}
      
      <main className="w-full h-full relative">
        <MapView />

        {/* Desktop Left Control Panel */}
        <div className="hidden md:flex absolute top-28 left-8 z-20 flex-col gap-6 max-h-[calc(100%-6rem)] overflow-y-auto pointer-events-none">
          <div className="pointer-events-auto">
            <UtilsPane />
          </div>
          <div className="pointer-events-auto">
            <ControlPanel />
          </div>
        </div>

        {/* Desktop Right Info Panels */}
        <div className="hidden md:flex absolute top-28 right-8 z-20 flex-col gap-6 max-h-[calc(100%-4rem)] overflow-y-auto pointer-events-none">
          <div className="pointer-events-auto">
            <AstronomyDetails />
          </div>
          <div className="pointer-events-auto">
            <WeatherPanel />
          </div>
        </div>

        {/* Mobile Management */}
        
        <EphemerisOverlay />
        <SettingsPanel />
      </main>
    </div>
  );
}


