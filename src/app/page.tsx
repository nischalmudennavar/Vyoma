import { AstronomyDetails } from "@/components/astronomy-details";
import { EphemerisOverlay } from "@/components/ephemeris-overlay";
import { LeftPane } from "@/components/left-pane";
import { MapView } from "@/components/map-view";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
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
