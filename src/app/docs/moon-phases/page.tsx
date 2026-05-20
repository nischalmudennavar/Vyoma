export default function MoonPhasesDocs() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Moon Phases
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The Moon is the single most significant natural source of light pollution. Understanding its phases and cycle is critical for scheduling deep-sky imaging sessions.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Optimal Conditions</h2>
        <div className="grid gap-4">
          <div className="border-l-4 border-primary bg-primary/5 p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest">Favourable Phase</span>
              <span className="text-primary font-mono font-bold">&lt; 10% Illumination</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest">Target Separation</span>
              <span className="text-primary font-mono font-bold">&gt; 90°</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plan your deepest imaging for the New Moon window. If the Moon is present, 
              maintain at least 90° of angular separation from your target to minimize 
              atmospheric scatter and glare.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">The Lunar Cycle</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border/40 p-4 space-y-2 bg-primary/5">
            <h3 className="font-bold text-[10px] uppercase text-primary">New Moon</h3>
            <p className="text-[10px] text-muted-foreground leading-tight">0% illumination. The gold standard for deep-sky photography.</p>
          </div>
          <div className="border border-border/40 p-4 space-y-2">
            <h3 className="font-bold text-[10px] uppercase">First Quarter</h3>
            <p className="text-[10px] text-muted-foreground leading-tight">50% illumination. Best for evening landscape shots.</p>
          </div>
          <div className="border border-border/40 p-4 space-y-2 bg-muted/20">
            <h3 className="font-bold text-[10px] uppercase">Full Moon</h3>
            <p className="text-[10px] text-muted-foreground leading-tight">100% illumination. Limits imaging to narrowband or bright clusters.</p>
          </div>
          <div className="border border-border/40 p-4 space-y-2">
            <h3 className="font-bold text-[10px] uppercase">Last Quarter</h3>
            <p className="text-[10px] text-muted-foreground leading-tight">50% illumination. Best for early morning sessions.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Imaging Strategy</h2>
        <div className="space-y-4">
          <div className="p-6 border-l-4 border-primary bg-primary/5 space-y-2">
            <h3 className="font-bold text-sm uppercase">The "Moon-Free" Window</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Even during a 50% moon, you can find windows of total darkness between Moonset and Sunrise, or Sunset and Moonrise. Vyoma calculates these windows automatically in the Astronomy Details panel.
            </p>
          </div>
          <div className="p-6 border-l-4 border-border bg-muted/20 space-y-2">
            <h3 className="font-bold text-sm uppercase">Angular Separation</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              If the Moon is up, try to image targets at least 90° away from it to minimize gradients and glare, especially in wide-field shots.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 border border-border/40 p-8 font-mono">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
          Recommended Filters
        </h2>
        <div className="grid gap-4 mt-4">
          <div className="flex justify-between items-center text-[10px] border-b border-border/40 pb-2">
            <span className="font-bold">Broadband (LRGB)</span>
            <span className="text-red-500 font-black">Avoid if Moon &gt; 25%</span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-b border-border/40 pb-2">
            <span className="font-bold">Dual-Narrowband</span>
            <span className="text-yellow-500 font-black">Usable up to 75%</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold">Hydrogen-Alpha (Ha)</span>
            <span className="text-green-500 font-black">Usable even at 100%</span>
          </div>
        </div>
      </section>
    </div>
  );
}
