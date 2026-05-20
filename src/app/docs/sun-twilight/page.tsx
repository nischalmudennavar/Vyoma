export default function SunTwilightDocs() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Sun & Twilight
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Twilight is the transition between day and night. For astrophotographers, 
          the level of twilight determines which objects can be seen and when deep-sky 
          imaging can begin.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Optimal Timing</h2>
        <div className="border-l-4 border-primary bg-primary/5 p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest">True Night Entry</span>
            <span className="text-primary font-mono font-bold">-18° Altitude</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Deep-sky imaging should strictly begin only after the Sun reaches -18°. 
            This is the "gold standard" where the sky is at its darkest and no solar 
            gradients will interfere with your long exposures.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">The Three Phases</h2>
        <div className="grid gap-6">
          <div className="space-y-2 border border-border/40 p-5">
            <h3 className="font-bold text-sm uppercase flex items-center gap-2">
              <div className="size-2 bg-blue-300" />
              Civil Twilight (Sun 0° to -6°)
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ideal for landscape photography where you still want detail in the foreground 
              without artificial lights. Only the brightest stars and planets are visible.
            </p>
          </div>
          <div className="space-y-2 border border-border/40 p-5">
            <h3 className="font-bold text-sm uppercase flex items-center gap-2">
              <div className="size-2 bg-blue-600" />
              Nautical Twilight (Sun -6° to -12°)
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              The horizon becomes difficult to distinguish. Many more stars appear. 
              A great time for long-exposure "Blue Hour" photography.
            </p>
          </div>
          <div className="space-y-2 border border-border/40 p-5 bg-primary/5">
            <h3 className="font-bold text-sm uppercase flex items-center gap-2 text-primary">
              <div className="size-2 bg-primary" />
              Astronomical Twilight (Sun -12° to -18°)
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              The sky is nearly black. Deep-sky imaging can often begin here, although 
              the horizon might still have a very faint glow.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 border border-border/40 p-8 bg-muted/20 font-mono">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
          The "Golden Hour"
        </h2>
        <p className="text-xs leading-loose text-muted-foreground">
          Vyoma defines the Golden Hour as the period when the Sun is between -4° and 6°. 
          This is when the light is most diffused and warm, perfect for architectural 
          astrophotography or foreground lighting.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Photographer Considerations</h2>
        <ul className="list-none space-y-4 text-sm">
          <li className="flex gap-4 border-l border-border/40 pl-6">
            <span>
              <strong>Deep Sky:</strong> Do not start your sequence until the Sun reaches 
              <span className="text-primary font-bold"> -18°</span> (True Night). Any earlier 
              will result in massive color gradients in your sub-exposures.
            </span>
          </li>
          <li className="flex gap-4 border-l border-border/40 pl-6">
            <span>
              <strong>Foreground Blending:</strong> Take your foreground shots during 
              Blue Hour (Nautical Twilight) and blend them with your tracked sky shots 
              later for natural-looking results.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
