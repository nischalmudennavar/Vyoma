"use client";

import { useMemo } from "react";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { useCelestialWorker } from "@/hooks/use-celestial-worker";
import { SunTwilightSection, type CelestialData } from "@/components/celestial/astronomy-details";
import { DocLivePreview } from "@/components/layout/doc-live-preview";

export default function SunTwilightDocs() {
  const { viewDate, location } = useVyomaStore();

  const celestialPayload = useMemo(
    () => ({
      date: viewDate.toISOString(),
      lat: location.lat,
      lng: location.lng,
    }),
    [viewDate, location.lat, location.lng],
  );

  const { data, isLoading } = useCelestialWorker<CelestialData>(
    "CALCULATE_ALL",
    celestialPayload,
  );

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-orange-400 pl-6">
          Sun & Twilight
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Understanding the phases of twilight is critical for planning the "Blue Hour," 
          "Golden Hour," and the start of deep-sky imaging.
        </p>
      </section>

      <DocLivePreview 
        title="Live Solar Ephemeris"
        description="Current solar position, twilight transitions, and golden hour windows calculated for your current session."
      >
        <SunTwilightSection data={data} loading={isLoading} />
      </DocLivePreview>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">The Three Phases of Twilight</h2>
        <div className="grid gap-6">
          <div className="border border-border/40 p-5 space-y-3">
            <h3 className="font-bold text-sm uppercase text-orange-400">Civil Twilight</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sun is between 0° and -6°. The horizon is clearly defined, and brightest 
              stars (like Venus) become visible. Ideal for landscape photography with 
              foreground detail.
            </p>
          </div>
          <div className="border border-border/40 p-5 space-y-3">
            <h3 className="font-bold text-sm uppercase text-blue-400">Nautical Twilight</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sun is between -6° and -12°. The horizon becomes difficult to distinguish. 
              Most stars are visible, but the sky still holds a deep blue hue.
            </p>
          </div>
          <div className="border border-border/40 p-5 space-y-3 bg-primary/5">
            <h3 className="font-bold text-sm uppercase text-indigo-400">Astronomical Twilight</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sun is between -12° and -18°. The sky is nearly dark, but atmospheric 
              glow persists. Deep-sky imaging usually begins at the end of this phase 
              (Astronomical Dusk).
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Golden Hour</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The "Golden Hour" occurs when the sun is between -4° and 6°. During this time, 
          light travels through more of the atmosphere, resulting in warmer, softer 
          tones and long shadows.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Imaging Strategy</h2>
        <ul className="list-none space-y-4 text-sm">
          <li className="flex gap-4">
            <span className="text-orange-400 font-bold">01/</span>
            <span>
              <strong>Planning:</strong> Use the Solar Timeline to identify the exact 
              moment Astronomical Dusk ends. This is when the "True Night" begins.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="text-orange-400 font-bold">02/</span>
            <span>
              <strong>Flat Frames:</strong> Late Civil Twilight is often the best time 
              to take "Sky Flats" for telescope calibration.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
