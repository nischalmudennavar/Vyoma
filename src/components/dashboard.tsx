"use client";

import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/mode-toggle";

const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => ({ default: mod.MapView })),
  { ssr: false },
);
const LeftPane = dynamic(
  () => import("@/components/left-pane").then((mod) => ({ default: mod.LeftPane })),
  { ssr: false },
);
const AstronomyDetails = dynamic(
  () => import("@/components/astronomy-details").then((mod) => ({ default: mod.AstronomyDetails })),
  { ssr: false },
);
const EphemerisOverlay = dynamic(
  () => import("@/components/ephemeris-overlay").then((mod) => ({ default: mod.EphemerisOverlay })),
  { ssr: false },
);

export function Dashboard() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="flex w-full items-center justify-between border-b px-6 py-4 shrink-0 z-10 bg-background/80 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight">Vyoma</h1>
        <ModeToggle />
      </header>
      <main className="flex flex-1 overflow-hidden relative">
        <MapView />
        <LeftPane />
        <AstronomyDetails />
        <EphemerisOverlay />
      </main>
    </div>
  );
}
