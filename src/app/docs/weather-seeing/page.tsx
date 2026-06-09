"use client";

import { DocLivePreview } from "@/components/layout/doc-live-preview";
import { MeteorologySection } from "@/components/weather/weather-panel";
import { useVyomaStore } from "@/store/use-vyoma-store";

export default function WeatherSeeingDocs() {
  const { weather, isWeatherLoading } = useVyomaStore();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-emerald-500 pl-6">
          Weather & Seeing
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The best equipment in the world cannot overcome a turbulent or opaque
          atmosphere. Meteorological data is the final gatekeeper for a
          successful session.
        </p>
      </section>

      <DocLivePreview
        title="Live Local Weather"
        description="Active meteorological conditions, seeing estimates, and transparency data for your current location."
      >
        <MeteorologySection weather={weather} loading={isWeatherLoading} />
      </DocLivePreview>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Understanding "Seeing"
        </h2>
        <div className="bg-muted/30 p-6 space-y-4 border-l-2 border-emerald-500/40 font-mono">
          <p className="text-sm italic">
            "Seeing" refers to the amount of apparent twinkling of stars caused
            by atmospheric turbulence.
          </p>
          <p className="text-sm">
            High turbulence (Poor Seeing) smears fine details in planets and
            deep-sky objects. Vyoma scales seeing from{" "}
            <span className="text-emerald-500 font-bold">1 (Poor)</span>
            to <span className="text-emerald-500 font-bold">5 (Excellent)</span>
            .
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Transparency</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Transparency measures the clarity of the atmosphere, primarily
          affected by humidity, dust, and smoke. High transparency is required
          to see faint nebulosity and distant galaxies.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Dew Point vs. Temperature
        </h2>
        <div className="grid gap-6">
          <div className="border border-border/40 p-5 space-y-2">
            <h3 className="font-bold text-sm uppercase text-primary">
              The Danger Zone
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              When the Ambient Temperature drops to within 2-3°C of the Dew
              Point, moisture will begin to condense on your telescope optics.
              Use dew heaters to stay above this threshold.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Cloud Layers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border/40 p-4 bg-emerald-500/5">
            <h4 className="text-[10px] font-black uppercase mb-1">
              High Clouds
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Cirrus clouds that often smear star light but might allow some
              imaging.
            </p>
          </div>
          <div className="border border-border/40 p-4">
            <h4 className="text-[10px] font-black uppercase mb-1">
              Mid Clouds
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Alto-level clouds that usually block most deep-sky targets.
            </p>
          </div>
          <div className="border border-border/40 p-4">
            <h4 className="text-[10px] font-black uppercase mb-1">
              Low Clouds
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Thick stratus or cumulus clouds that completely obscure the sky.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
