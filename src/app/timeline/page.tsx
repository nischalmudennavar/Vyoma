"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CelestialTimeline } from "@/components/celestial-timeline";
import { Button } from "@/components/ui/button";
import {
  type CelestialEvent,
  getGalacticCoreVisibility,
  getMoonPhase,
  getMoonRiseSet,
  getSunPosition,
  getTwilightPhases,
} from "@/lib/astrometry";
import { useVyomaStore } from "@/store/use-vyoma-store";

export default function TimelinePage() {
  const { viewDate, location } = useVyomaStore();

  const events = useMemo(() => {
    const celestialEvents: CelestialEvent[] = [];
    const { lat, lng } = location;

    // 1. Twilight Phases
    const twilight = getTwilightPhases(viewDate, lat, lng);
    for (const [key, date] of Object.entries(twilight)) {
      if (date) {
        let title = key.replace(/([A-Z])/g, " $1").trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);

        let description = "";
        if (key.toLowerCase().includes("night")) {
          description = "The sun is completely below the horizon. The sky is dark, providing excellent visibility for deep-sky objects and the Milky Way.";
        } else if (key.toLowerCase().includes("astronomical")) {
          description = "The sun is 12 to 18 degrees below the horizon. The sky is dark enough for most astronomical observations.";
        } else if (key.toLowerCase().includes("nautical")) {
          description = "The sun is 6 to 12 degrees below the horizon. Bright stars are visible and the horizon can be seen.";
        } else if (key.toLowerCase().includes("civil")) {
          description = "The sun is less than 6 degrees below the horizon. Only the brightest stars and planets are visible.";
        } else if (key.toLowerCase().includes("sunrise") || key.toLowerCase().includes("sunset")) {
          description = `The moment of ${title.toLowerCase()}, marking the transition between day and twilight.`;
        } else {
          description = `The start of ${title.toLowerCase()}.`;
        }

        celestialEvents.push({
          id: `sun-${key}`,
          timestamp: date,
          title: title,
          type: "sun",
          subtitle: `Sun's elevation: ${getSunPosition(date, lat, lng).alt.toFixed(1)}°`,
          description,
        });
      }
    }

    // 2. Moon Rise/Set
    const moon = getMoonRiseSet(viewDate, lat, lng);
    if (moon.rise) {
      celestialEvents.push({
        id: "moon-rise",
        timestamp: moon.rise,
        title: "Moonrise",
        type: "moon",
        subtitle: `Sun's elevation: ${getSunPosition(moon.rise, lat, lng).alt.toFixed(1)}°`,
        description: "The moon appears above the horizon. Its bright light will begin to illuminate the night sky, potentially washing out fainter stars and deep-sky objects.",
      });
    }
    if (moon.set) {
      celestialEvents.push({
        id: "moon-set",
        timestamp: moon.set,
        title: "Moonset",
        type: "moon",
        subtitle: `Sun's elevation: ${getSunPosition(moon.set, lat, lng).alt.toFixed(1)}°`,
        description: "The moon drops below the horizon, returning the sky to darkness and providing better conditions for stargazing.",
      });
    }

    // 3. Moon Phase
    const phase = getMoonPhase(viewDate);
    const illumination = (((1 - Math.cos((phase.phase * Math.PI) / 180)) / 2) * 100).toFixed(1);
    celestialEvents.push({
      id: "moon-phase",
      timestamp: new Date(new Date(viewDate).setHours(12, 0, 0, 0)), // Marker for midday phase
      title: `Moon Phase: ${phase.name}`,
      type: "phase",
      subtitle: `Illumination: ${illumination}%`,
      description: `The moon is in its ${phase.name.toLowerCase()} phase with ${illumination}% of its surface illuminated. This affects overall sky brightness throughout the night.`,
    });

    // 4. Galactic Center
    const galactic = getGalacticCoreVisibility(viewDate, lat, lng);
    if (galactic.rise) {
      celestialEvents.push({
        id: "galactic-rise",
        timestamp: galactic.rise,
        title: "Galactic Center Rise",
        type: "galactic",
        subtitle: "Primary target visibility begins",
        description: "The dense, bright core of the Milky Way galaxy becomes visible above the horizon. This marks the optimal time for astrophotography of the galactic center.",
      });
    }
    if (galactic.set) {
      celestialEvents.push({
        id: "galactic-set",
        timestamp: galactic.set,
        title: "Galactic Center Set",
        type: "galactic",
        subtitle: "Visibility ends",
        description: "The core of the Milky Way sets below the horizon, ending the observation window for the galactic center.",
      });
    }

    return celestialEvents;
  }, [viewDate, location]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[#050505]/80 backdrop-blur-md border-b border-neutral-900">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">
              Celestial Timeline
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              {viewDate.toLocaleDateString([], {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
            Location
          </p>
          <p className="text-xs font-semibold text-neutral-300">
            {location.label ||
              `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <CelestialTimeline events={events} />
      </main>
    </div>
  );
}
