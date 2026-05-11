"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { useVyomaStore } from "@/store/use-vyoma-store";

// Import modular components
import { AstronomyDetails } from "@/components/control-panel/astronomy-details";
import { WeatherPanel } from "@/components/control-panel/weather-panel";
import { ControlPanel } from "@/components/control-panel/control-panel";

const MapView = dynamic(
  () =>
    import("@/components/map-view").then((mod) => ({ default: mod.MapView })),
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
    import("@/components/control-panel/ephemeris-overlay").then((mod) => ({
      default: mod.EphemerisOverlay,
    })),
  { ssr: false },
);
const SettingsPanel = dynamic(
  () =>
    import("@/components/control-panel/settings-panel").then((mod) => ({
      default: mod.SettingsPanel,
    })),
  { ssr: false },
);

import { useHotkeys } from "@/hooks/use-hotkeys";
import { CommandPalette } from "@/components/command-palette";
import { MobileDrawer } from "@/components/mobile-drawer";

export function Dashboard() {
  useHotkeys();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground relative">
      <Header />
      <CommandPalette />
      <main className="flex flex-1 overflow-hidden relative">
        <MapView />

        {/* Desktop Left Control Panel */}
        <div className="hidden md:flex absolute top-6 left-6 z-20 flex-col gap-6 max-h-[calc(100%-3rem)] overflow-y-auto pointer-events-none">
          <div className="pointer-events-auto">
            <ControlPanel />
          </div>
        </div>

        {/* Desktop Right Info Panels */}
        <div className="hidden md:flex absolute top-6 right-6 z-20 flex-col gap-6 max-h-[calc(100%-3rem)] overflow-y-auto pointer-events-none">
          <div className="pointer-events-auto">
            <AstronomyDetails />
          </div>
          <div className="pointer-events-auto">
            <WeatherPanel />
          </div>
        </div>

        {/* Mobile Management */}
        <MobileDrawer />

        <EphemerisOverlay />
        <SettingsPanel />
      </main>
    </div>
  );
}

