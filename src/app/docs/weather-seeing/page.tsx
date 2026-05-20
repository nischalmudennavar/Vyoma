export default function WeatherSeeingDocs() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Weather & Seeing
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Clear skies are just the beginning. For high-resolution astrophotography, atmospheric stability (seeing) and transparency are equally important.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Optimal Metrics</h2>
        <div className="border-l-4 border-primary bg-primary/5 p-6 space-y-4">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest border-b border-primary/20 pb-2">
            <span>Metric</span>
            <span>Target Value</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span>Total Cloud Cover</span>
            <span className="text-primary font-bold">&lt; 10%</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span>Atmospheric Seeing</span>
            <span className="text-primary font-bold">&lt; 1.5&quot;</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span>Relative Humidity</span>
            <span className="text-primary font-bold">&lt; 85%</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
            Values within these ranges minimize atmospheric scattering and 
            optical aberrations, ensuring maximum signal collection during 
            your sub-exposures.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Atmospheric Seeing</h2>
        <div className="grid gap-6">
          <div className="space-y-2 border border-border/40 p-5 bg-primary/5">
            <h3 className="font-bold text-sm uppercase text-primary">Definition</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              "Seeing" refers to the amount of apparent twinkling of stars caused by turbulence in the Earth&apos;s atmosphere. In poor seeing, stars appear as large, blurry blobs. In excellent seeing, they are sharp pinpoints.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-[10px] font-mono">
            <div className="p-4 border border-border/40">
              <span className="text-primary font-bold">Arcseconds (")</span>
              <p className="mt-1">Measurements below 1.5" are considered excellent for planetary and high-resolution deep-sky imaging.</p>
            </div>
            <div className="p-4 border border-border/40">
              <span className="text-primary font-bold">Jet Stream</span>
              <p className="mt-1">High-speed winds at high altitudes are the primary cause of poor seeing. Look for "Low Jet Stream" forecasts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Transparency</h2>
        <div className="p-8 border border-border/40 bg-muted/20">
          <p className="text-sm leading-loose">
            Transparency is a measure of how clear the atmosphere is, independent of turbulence. 
            High humidity, smoke, or dust can reduce transparency, causing light from stars to be scattered. 
            Excellent transparency is required for capturing faint nebulae and distant galaxies.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Key Metrics in Vyoma</h2>
        <ul className="list-none space-y-6 text-sm">
          <li className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-1.5 bg-primary" />
              <strong className="uppercase text-xs tracking-widest">Cloud Cover</strong>
            </div>
            <p className="text-xs text-muted-foreground pl-3.5 leading-relaxed">
              Measured from 0% to 100%. For astrophotography, you generally need &lt;10% total cloud cover across all layers (Low, Mid, High).
            </p>
          </li>
          <li className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-1.5 bg-primary" />
              <strong className="uppercase text-xs tracking-widest">Relative Humidity</strong>
            </div>
            <p className="text-xs text-muted-foreground pl-3.5 leading-relaxed">
              High humidity (&gt;85%) increases the risk of dew forming on your optics. Ensure your dew heaters are active if the temperature is near the dew point.
            </p>
          </li>
          <li className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-1.5 bg-primary" />
              <strong className="uppercase text-xs tracking-widest">Dew Point</strong>
            </div>
            <p className="text-xs text-muted-foreground pl-3.5 leading-relaxed">
              The temperature at which water vapor condenses into liquid water. If the air temperature drops to the dew point, frost or dew will form on your equipment.
            </p>
          </li>
        </ul>
      </section>

      <div className="border border-primary/20 p-6 text-center italic text-xs text-muted-foreground">
        "The best telescope in the world cannot fix a turbulent atmosphere."
      </div>
    </div>
  );
}
