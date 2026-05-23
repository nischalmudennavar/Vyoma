"use client";

import { useMemo } from "react";
import {
  type CelestialData,
  MoonImagingSection,
} from "@/components/celestial/astronomy-details";
import { DocLivePreview } from "@/components/layout/doc-live-preview";
import { useCelestialWorker } from "@/hooks/use-celestial-worker";
import { useVyomaStore } from "@/store/use-vyoma-store";

export default function MoonPhasesDocs() {
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
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-blue-300 pl-6">
          Moon Phases
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The Moon is the single most significant factor in light pollution for
          deep-sky photographers. Its phase and position determine when the sky
          is truly "dark."
        </p>
      </section>

      <DocLivePreview
        title="Live Lunar Tracking"
        description="Current lunar phase, illumination percentage, and imaging windows for your active session."
      >
        <MoonImagingSection data={data} loading={isLoading} />
      </DocLivePreview>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Understanding Illumination
        </h2>
        <div className="grid gap-4">
          <div className="bg-muted/30 p-6 space-y-4 border-l-2 border-blue-300/40 font-mono">
            <p className="text-sm">
              Illumination refers to the percentage of the Moon&apos;s disk that
              reflects sunlight toward Earth. A{" "}
              <span className="text-blue-300 font-bold">New Moon (0%)</span>
              is ideal for deep-sky imaging, while a{" "}
              <span className="text-blue-300 font-bold">Full Moon (100%)</span>
              can wash out all but the brightest stars.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Moon-Free Windows</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vyoma calculates the exact window when the Moon is below the horizon
          AND the Sun is in Astronomical Twilight or deeper. This is your
          "Golden Window" for high-contrast nebula and galaxy photography.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">The 50% Rule</h2>
        <div className="grid gap-6">
          <div className="border border-border/40 p-5 space-y-2 bg-blue-300/5">
            <h3 className="font-bold text-sm uppercase text-blue-300">
              Waxing/Waning Crescent
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Under 25% illumination. Generally safe for broadband imaging
              (galaxies, reflection nebulae) if the Moon is far from the target.
            </p>
          </div>
          <div className="border border-border/40 p-5 space-y-2">
            <h3 className="font-bold text-sm uppercase">First/Last Quarter</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Approx 50% illumination. Significant light pollution. Narrowband
              filters (H-alpha, OIII) are highly recommended.
            </p>
          </div>
          <div className="border border-border/40 p-5 space-y-2">
            <h3 className="font-bold text-sm uppercase">Gibbous/Full</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Over 75% illumination. Sky background is very bright. Focus on
              planetary imaging, lunar photography, or equipment testing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
