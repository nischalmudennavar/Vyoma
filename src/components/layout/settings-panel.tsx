"use client";

import {
  Compass,
  Eye,
  Map as MapIcon,
  Minus,
  Monitor,
  Plus,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useVyomaSelector } from "@/store/use-vyoma-store";

/**
 * SettingsPanel component refactored into a detailed dialog.
 * Provides granular control over UI, Map, and Celestial Engine.
 */
export function SettingsPanel() {
  const {
    showSettings,
    toggleSettings,
    mapVisibility,
    setMapVisibility,
    baseFontSize,
    setBaseFontSize,
    showMoon,
    toggleMoon,
    showLightPollution,
    toggleLightPollution,
  } = useVyomaSelector([
    "showSettings",
    "toggleSettings",
    "mapVisibility",
    "setMapVisibility",
    "baseFontSize",
    "setBaseFontSize",
    "showMoon",
    "toggleMoon",
    "showLightPollution",
    "toggleLightPollution",
  ]);

  const handleFontSizeChange = (delta: number) => {
    setBaseFontSize(Math.max(10, Math.min(24, baseFontSize + delta)));
  };

  return (
    <Dialog open={showSettings} onOpenChange={toggleSettings}>
      <DialogContent className="md:max-w-2xl bg-background/95 backdrop-blur-2xl border-border/40 shadow-3xl">
        <DialogHeader className="border-b border-border/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary">
              <Settings2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-base">System Parameters</DialogTitle>
              <DialogDescription>
                Configure the celestial engine and interface preferences.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-4">
          {/* Interface Column */}
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Monitor className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Interface
                </h3>
              </div>

              <div className="space-y-1 bg-muted/20 p-4 border border-border/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Base Font Size
                    </Label>
                    <span className="font-mono text-xs tabular-nums text-primary">
                      {baseFontSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => handleFontSizeChange(-1)}
                      disabled={baseFontSize <= 10}
                      className="size-7"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="flex-1 h-1 bg-muted relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
                        style={{
                          width: `${((baseFontSize - 10) / 14) * 100}%`,
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => handleFontSizeChange(1)}
                      disabled={baseFontSize >= 24}
                      className="size-7"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Visibility
                </h3>
              </div>
              <div className="space-y-1 bg-muted/20 p-4 border border-border/20">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Lunar Elements
                  </Label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showMoon}
                    onClick={toggleMoon}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      showMoon ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-none bg-white shadow-lg ring-0 transition-transform ${
                        showMoon ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/10">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Light Pollution
                  </Label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showLightPollution}
                    onClick={toggleLightPollution}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      showLightPollution ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-none bg-white shadow-lg ring-0 transition-transform ${
                        showLightPollution ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map & Engine Column */}
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <MapIcon className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Map View
                </h3>
              </div>

              <div className="space-y-6 bg-muted/20 p-4 border border-border/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Background Opacity
                    </Label>
                    <span className="font-mono text-xs tabular-nums text-primary">
                      {mapVisibility}%
                    </span>
                  </div>
                  <Slider
                    value={[mapVisibility]}
                    onValueChange={([val]) => setMapVisibility(val)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Compass className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Celestial Engine
                </h3>
              </div>
              <div className="p-4 bg-muted/10 border border-border/10">
                <p className="text-[10px] text-muted-foreground leading-relaxed font-mono">
                  Engine Version: 1.0.4-LADAKH
                  <br />
                  Calculation: Topocentric
                  <br />
                  Atmospheric Refraction: Active
                </p>
                <div className="mt-4 pt-4 border-t border-border/5">
                  <span className="text-[9px] text-primary/60 font-black uppercase tracking-widest">
                    Status: Nominal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-6 border-t border-border/40 flex justify-between items-center">
          <div className="text-[9px] uppercase font-mono text-muted-foreground/60 tracking-tighter">
            Architectural Standard: Technical Brutalism / Swiss
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSettings}
            className="h-7 px-4 text-[10px] uppercase font-black tracking-widest"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
