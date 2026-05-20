export default function GalacticCoreDocs() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Galactic Core
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The Galactic Core (GC) is the rotational center of the Milky Way galaxy. For photographers, 
          it represents the most visually dense and impressive part of our night sky.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Technical definition</h2>
        <div className="bg-muted/30 p-6 space-y-4 border-l-2 border-primary/40 font-mono">
          <p className="text-sm">
            Vyoma tracks the GC at approximately <span className="text-primary font-bold">RA 17h 45m, Dec -29° 00&apos;</span>. 
            This position is near the constellation Sagittarius.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Optimal Conditions</h2>
        <div className="grid gap-4">
          <div className="border-l-4 border-primary bg-primary/5 p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-widest">Target Altitude</span>
              <span className="text-primary font-mono font-bold">&gt; 30°</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For high-resolution imaging, wait for the GC to rise above 30°. Below this height, 
              atmospheric extinction and refraction significantly degrade fine detail in 
              dark nebulae.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Impact on Photographers</h2>
        <div className="grid gap-6">
          <div className="space-y-2 border border-border/40 p-5 bg-primary/5">
            <h3 className="font-bold text-sm uppercase text-primary">Seasonality</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Depending on your hemisphere, the "Milky Way Season" typically runs from 
              late February to October. In the Northern Hemisphere, it peaks in summer, 
              while in the Southern Hemisphere, it sits much higher in the sky.
            </p>
          </div>
          <div className="space-y-2 border border-border/40 p-5">
            <h3 className="font-bold text-sm uppercase">Elevation</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              The higher the GC is in the sky (Altitude), the less atmospheric distortion 
              you encounter. Aim for an altitude above <span className="font-bold text-foreground">30°</span> 
              for maximum detail and clarity in the dust lanes.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Things to Consider</h2>
        <ul className="list-none space-y-4 text-sm">
          <li className="flex gap-4">
            <span className="text-primary font-bold">01/</span>
            <span>
              <strong>Moon Phase:</strong> Even a 20% moon can wash out the delicate 
              gradients of the Milky Way. Use the Moon-Free window tool in the Astronomy 
              Details panel.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="text-primary font-bold">02/</span>
            <span>
              <strong>Atmospheric Haze:</strong> High humidity and particulates scatter 
              light from nearby cities, destroying GC contrast.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
