export default function TerminologyDocs() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Terminology
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A quick reference guide for astronomical and technical terms used within the Vyoma interface.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Quick Reference</h2>
        <div className="grid gap-4 border border-border/40 p-6 bg-primary/5 font-mono">
          <div className="flex justify-between items-center text-[10px] border-b border-border/40 pb-2">
            <span className="font-bold uppercase">Optimal Altitude</span>
            <span className="text-primary font-black">&gt; 30°</span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-b border-border/40 pb-2">
            <span className="font-bold uppercase">Imaging Window</span>
            <span className="text-primary font-black">&lt; -18° Sun</span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-b border-border/40 pb-2">
            <span className="font-bold uppercase">Dark Sky Target</span>
            <span className="text-primary font-black">Bortle 1-3</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold uppercase">Stable Seeing</span>
            <span className="text-primary font-black">&lt; 1.5&quot;</span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Positional Data</h2>
        <div className="grid gap-4 border border-border/40 p-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm uppercase text-primary">Altitude (Alt)</h3>
            <p className="text-xs leading-relaxed">
              The angle of a celestial object above the observer&apos;s horizon. 0° is the horizon, and 90° is the zenith (directly overhead).
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm uppercase text-primary">Azimuth (Az)</h3>
            <p className="text-xs leading-relaxed">
              The compass direction of a celestial object, measured in degrees clockwise from North (0°). East is 90°, South is 180°, and West is 270°.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm uppercase text-primary">Topocentric</h3>
            <p className="text-xs leading-relaxed">
              Calculations performed relative to the observer&apos;s specific position on the surface of the Earth, accounting for parallax.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Time & Coordinates</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 border-l border-border/40 pl-4">
            <h3 className="font-bold text-sm uppercase">Right Ascension (RA)</h3>
            <p className="text-xs text-muted-foreground">
              The celestial equivalent of longitude. It measures the distance eastward along the celestial equator from the vernal equinox.
            </p>
          </div>
          <div className="space-y-2 border-l border-border/40 pl-4">
            <h3 className="font-bold text-sm uppercase">Declination (Dec)</h3>
            <p className="text-xs text-muted-foreground">
              The celestial equivalent of latitude. It measures the angle north (+) or south (-) of the celestial equator.
            </p>
          </div>
          <div className="space-y-2 border-l border-border/40 pl-4">
            <h3 className="font-bold text-sm uppercase">UTC / Julian Date</h3>
            <p className="text-xs text-muted-foreground">
              Vyoma performs internal calculations using Julian Dates to ensure high-precision temporal alignment across millennia.
            </p>
          </div>
          <div className="space-y-2 border-l border-border/40 pl-4">
            <h3 className="font-bold text-sm uppercase">Zenith</h3>
            <p className="text-xs text-muted-foreground">
              The point in the sky directly above the observer. In Vyoma, objects reaching high altitudes near the zenith are ideal for imaging.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Imaging Metrics</h2>
        <div className="p-8 border border-border/40 font-mono">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-primary font-black">SNR</span>
              <p className="text-xs leading-loose text-muted-foreground">
                <strong>Signal-to-Noise Ratio:</strong> A measure of how much useful information (light from stars/nebulae) you have compared to unwanted noise (light pollution, sensor heat).
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-primary font-black">SQM</span>
              <p className="text-xs leading-loose text-muted-foreground">
                <strong>Sky Quality Meter:</strong> An instrument used to measure the luminance of the night sky in magnitudes per square arcsecond.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
