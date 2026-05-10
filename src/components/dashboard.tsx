"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/header";

const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => ({ default: mod.MapView })),
  { ssr: false },
);
const LeftPane = dynamic(
  () => import("@/components/control-panel/left-pane").then((mod) => ({ default: mod.LeftPane })),
  { ssr: false },
);
const AstronomyDetails = dynamic(
  () => import("@/components/control-panel/astronomy-details").then((mod) => ({ default: mod.AstronomyDetails })),
  { ssr: false },
);
const EphemerisOverlay = dynamic(
  () => import("@/components/control-panel/ephemeris-overlay").then((mod) => ({ default: mod.EphemerisOverlay })),
  { ssr: false },
);
const SettingsPanel = dynamic(
  () => import("@/components/control-panel/settings-panel").then((mod) => ({ default: mod.SettingsPanel })),
  { ssr: false },
);

export function Dashboard() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <main className="flex flex-1 overflow-hidden relative">
        <MapView />
        <LeftPane />
        <AstronomyDetails />
        <EphemerisOverlay />
        <SettingsPanel />
      </main>
    </div>
  );
}
