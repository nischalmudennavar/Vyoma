"use client";

import { useVyomaStore } from "@/store/use-vyoma-store";
import { BortleSection } from "@/components/weather/weather-panel";
import { DocLivePreview } from "@/components/layout/doc-live-preview";

export default function BortleDocs() {
  const { weather, isWeatherLoading } = useVyomaStore();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Bortle Scale
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The Bortle Dark-Sky Scale is a nine-level numeric scale that measures the night sky&apos;s brightness of a particular location. It quantifies the astronomical observability of celestial objects and the interference caused by light pollution.
        </p>
      </section>

      <DocLivePreview 
        title="Live Sky Quality"
        description="The Bortle class for your current location. This determines your signal-to-noise ratio and exposure limits."
      >
        <BortleSection bortle={weather?.bortle} loading={isWeatherLoading} />
      </DocLivePreview>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Favourable Zones</h2>
        <div className="border-l-4 border-primary bg-primary/5 p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest">Ideal Imaging Class</span>
            <span className="text-primary font-mono font-bold">Class 1 — 3</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Locations rated Bortle 3 or lower provide the high contrast needed for 
            faint nebulosity and broadband imaging. In these zones, the "natural" 
            sky background is dominant over artificial glow.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Understanding the Levels</h2>
        <div className="grid gap-2 border border-border/40 font-mono">
          <div className="grid grid-cols-[80px_1fr] border-b border-border/40 p-4 hover:bg-primary/5 transition-colors">
            <span className="text-primary font-black">Class 1</span>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase">Excellent Dark-Sky Site</p>
              <p className="text-[10px] text-muted-foreground">The Milky Way is so bright it casts shadows. Scorpius and Sagittarius cast diffuse light.</p>
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] border-b border-border/40 p-4 hover:bg-primary/5 transition-colors">
            <span className="text-blue-400 font-black">Class 3</span>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase">Rural Sky</p>
              <p className="text-[10px] text-muted-foreground">Some light pollution is evident along the horizon. The Milky Way still appears complex.</p>
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] border-b border-border/40 p-4 hover:bg-primary/5 transition-colors">
            <span className="text-yellow-400 font-black">Class 5</span>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase">Suburban Sky</p>
              <p className="text-[10px] text-muted-foreground">The Milky Way is very weak or invisible near the horizon. Light domes are visible in several directions.</p>
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] p-4 hover:bg-primary/5 transition-colors">
            <span className="text-red-500 font-black">Class 9</span>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase">Inner-City Sky</p>
              <p className="text-[10px] text-muted-foreground">Only the brightest stars, planets, and the Moon are visible. Forget the Milky Way.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Impact on Exposure</h2>
        <div className="p-8 border border-border/40 bg-muted/30">
          <p className="text-sm leading-loose">
            For every step up the Bortle scale, the background sky brightness increases significantly. 
            In a <span className="font-bold">Bortle 1</span> site, you can shoot 5-minute sub-exposures without blowing out the histogram. 
            In <span className="font-bold text-red-500">Bortle 9</span>, your sensor will be saturated in less than 20 seconds.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Photographer Tips</h2>
        <ul className="list-none space-y-4 text-sm">
          <li className="flex gap-4">
            <span className="text-primary font-bold">»</span>
            <span>
              <strong>Filters:</strong> If you are stuck in Bortle 6+, use Narrowband (H-alpha, OIII, SII) 
              or Duo-band filters to cut through the sodium and LED light domes.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="text-primary font-bold">»</span>
            <span>
              <strong>Distance:</strong> Traveling just 30-40 minutes away from a city can often 
              drop you 2 classes on the Bortle scale, doubling your signal-to-noise ratio.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
