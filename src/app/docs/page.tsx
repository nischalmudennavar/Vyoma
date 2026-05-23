import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-primary pl-6">
          Introduction
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Vyoma is a specialized precision planning tool designed for
          astrophotographers. By combining topocentric celestial calculations
          with real-time weather and light pollution data, it allows you to
          visualize and plan the perfect shot down to the minute.
        </p>
      </section>

      <div className="grid gap-8 border border-border/40 p-8 bg-primary/5">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">
          Core Mission
        </h2>
        <p className="text-sm leading-loose">
          Modern astrophotography is a battle against variables. Atmospheric
          turbulence, light pollution, and complex celestial mechanics often
          dictate success. Vyoma aggregates these variables into a unified
          "Swiss Aesthetic" interface, providing the rigorous data alignment
          needed for deep-sky imaging and wide-field landscapes.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Documentation Sections
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/docs/terminology"
            className="group border border-border/40 p-4 hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
              Terminology
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Glossary of astronomical and technical terms.
            </p>
          </Link>
          <Link
            href="/docs/galactic-core"
            className="group border border-border/40 p-4 hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
              Galactic Core
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Technical details for Milky Way photography.
            </p>
          </Link>
          <Link
            href="/docs/sun-twilight"
            className="group border border-border/40 p-4 hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
              Sun & Twilight
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Understanding the transition between day and night.
            </p>
          </Link>
          <Link
            href="/docs/moon-phases"
            className="group border border-border/40 p-4 hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
              Moon Phases
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Managing the impact of lunar light pollution.
            </p>
          </Link>
          <Link
            href="/docs/bortle-scale"
            className="group border border-border/40 p-4 hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
              Bortle Scale
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Quantifying light pollution at your location.
            </p>
          </Link>
          <Link
            href="/docs/weather-seeing"
            className="group border border-border/40 p-4 hover:bg-primary/5 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
              Weather & Seeing
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Atmospheric transparency and stability.
            </p>
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Navigation Overview
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 border-l border-border/40 pl-4">
            <h3 className="font-bold text-sm uppercase">Ephemeris Timeline</h3>
            <p className="text-xs text-muted-foreground">
              The bottom timeline tracks the Sun, Moon, and Galactic Core
              altitudes over a 24-hour period. Use the joystick or keyboard to
              scrub through time.
            </p>
          </div>
          <div className="space-y-2 border-l border-border/40 pl-4">
            <h3 className="font-bold text-sm uppercase">System Control</h3>
            <p className="text-xs text-muted-foreground">
              Located on the left, this pane handles geospatial coordinates, UI
              customization, and light pollution layer toggles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
