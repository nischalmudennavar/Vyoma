"use client";

import { Cloud, Info, Star, X } from "lucide-react";
import { useState } from "react";
import { Drawer } from "vaul";
import { AstronomyDetails } from "@/components/celestial/astronomy-details";
import { ControlPanel } from "@/components/layout/control-panel";
import { Button } from "@/components/ui/button";
import { WeatherPanel } from "@/components/weather/weather-panel";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-none border border-border/50 bg-background/50 backdrop-blur-md shadow-sm"
          >
            <Info className="w-5 h-5" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[92%] flex-col bg-background border-t border-border outline-none rounded-none">
            <div className="flex-1 overflow-y-auto p-0 bg-background">
              <div className="mx-auto my-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />

              <div className="space-y-0 pb-10">
                <section className="space-y-0">
                  <div className="flex items-center gap-2 border-b border-border/40 p-4 bg-muted/5">
                    <Star className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Celestial Data
                    </h2>
                  </div>
                  <div className="w-full">
                    <AstronomyDetails />
                  </div>
                </section>

                <section className="space-y-0">
                  <div className="flex items-center gap-2 border-y border-border/40 p-4 bg-muted/5">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Meteorology
                    </h2>
                  </div>
                  <div className="w-full">
                    <WeatherPanel />
                  </div>
                </section>

                <section className="space-y-0">
                  <div className="flex items-center gap-2 border-y border-border/40 p-4 bg-muted/5">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Controls
                    </h2>
                  </div>
                  <div className="w-full">
                    <ControlPanel />
                  </div>
                </section>
              </div>
            </div>
            ...
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
