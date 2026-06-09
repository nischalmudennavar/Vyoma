"use client";

import dynamic from "next/dynamic";
import { FloatingSearchBar } from "@/components/layout/floating-search-bar";
// Import modular components
import { Header } from "@/components/layout/header";
import { LeftPane } from "@/components/layout/left-pane";
import { RightPane } from "@/components/layout/right-pane";

const MapView = dynamic(
  () =>
    import("@/components/map/map-view").then((mod) => ({
      default: mod.MapView,
    })),
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

export function Dashboard() {
  useHotkeys();

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground relative">
      <Header />
      <FloatingSearchBar />
      {/* <CommandPalette /> */}

      <main className="w-full h-full relative">
        <MapView />

        {/* Desktop Controls */}
        <div className="hidden md:block pointer-events-none">
          <LeftPane />
          <div className="hidden xl:block">
            <RightPane />
          </div>
        </div>

        {/* Mobile Management */}

        <EphemerisOverlay />
        <SettingsPanel />
      </main>
    </div>
  );
}
