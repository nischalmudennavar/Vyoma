"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Info, Cloud, Star, X } from "lucide-react";
import { AstronomyDetails } from "./control-panel/astronomy-details";
import { WeatherPanel } from "./control-panel/weather-panel";
import { ControlPanel } from "./control-panel/control-panel";
import { useState } from "react";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 z-40 size-12 rounded-none bg-background/80 backdrop-blur-xl border-border shadow-2xl"
          >
            <Info className="w-5 h-5" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[92%] flex-col bg-background border-t border-border outline-none rounded-none">
            <div className="flex-1 overflow-y-auto p-4 bg-background">
              <div className="mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
              
              <div className="space-y-8 pb-10">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                    <Star className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest">Celestial Data</h2>
                  </div>
                  <AstronomyDetails />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <h2 className="text-xs font-black uppercase tracking-widest">Meteorology</h2>
                  </div>
                  <WeatherPanel />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-xs font-black uppercase tracking-widest">Controls</h2>
                  </div>
                  <ControlPanel />
                </section>
              </div>
            </div>
            
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
