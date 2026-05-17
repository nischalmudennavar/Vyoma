"use client";

import { Eye, Lock, Settings2, Unlock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PaneItemContainer } from "@/components/layout/pane-item-container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useVyomaStore } from "@/store/use-vyoma-store";

/**
 * UtilsPane provides centralized access to search and system settings.
 * Designed with the "Swiss Aesthetic" - high contrast, zero radii, and rigorous alignment.
 */
export function UtilsPane() {
  const {
    uiOpacity,
    setUiOpacity,
    mapVisibility,
    setMapVisibility,
    lpOpacity,
    setLpOpacity,
    baseFontSize,
    setBaseFontSize,
    panelsLocked,
    setPanelsLocked,
    showMoon,
    toggleMoon,
    showLightPollution,
    toggleLightPollution,
  } = useVyomaStore();

  return (
    <Container
      applyUiOpacity
      className="w-full md:w-[320px] border border-border/80 bg-background/(--container-opacity) backdrop-blur-2xl shadow-2xl flex flex-col p-6 gap-6 pointer-events-auto transition-all duration-300"
      style={
        {
          backgroundColor:
            "color-mix(in oklch, color-mix(in oklch, var(--color-background), var(--color-primary) 5%), transparent calc(100% * (1 - var(--container-opacity, 0.8))))",
        } as React.CSSProperties
      }
    >
      {/* Settings Section */}
      <PaneItemContainer
        title="Settings"
        icon={<Settings2 className="w-4 h-4" />}
      >
        {/* UI Opacity */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Interface Opacity
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-primary">
              {uiOpacity}%
            </span>
          </div>
          <Slider
            value={[uiOpacity]}
            onValueChange={([val]) => setUiOpacity(val)}
            min={20}
            max={100}
            step={1}
          />
        </div>

        {/* Map Visibility */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Map Visibility
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-primary">
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

        {/* Light Pollution Opacity */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              LP Layer Opacity
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-primary">
              {lpOpacity}%
            </span>
          </div>
          <Slider
            value={[lpOpacity]}
            onValueChange={([val]) => setLpOpacity(val)}
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              System Font Size
            </Label>
            <span className="font-mono text-[10px] tabular-nums text-primary">
              {baseFontSize}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-none"
              onClick={() => setBaseFontSize(Math.max(10, baseFontSize - 1))}
            >
              -
            </Button>
            <Slider
              value={[baseFontSize]}
              onValueChange={([val]) => setBaseFontSize(val)}
              min={10}
              max={24}
              step={1}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-none"
              onClick={() => setBaseFontSize(Math.min(24, baseFontSize + 1))}
            >
              +
            </Button>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                Show Moon
              </Label>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showMoon}
              onClick={toggleMoon}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-none border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                showMoon ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-3 w-3 rounded-none bg-white shadow-lg ring-0 transition-transform ${
                  showMoon ? "translate-x-4" : "translate-x-0.5"
                } mt-[0.5px]`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {panelsLocked ? (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                Lock Layout
              </Label>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={panelsLocked}
              onClick={() => setPanelsLocked(!panelsLocked)}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-none border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                panelsLocked ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-3 w-3 rounded-none bg-white shadow-lg ring-0 transition-transform ${
                  panelsLocked ? "translate-x-4" : "translate-x-0.5"
                } mt-[0.5px]`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                Light Pollution
              </Label>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showLightPollution}
              onClick={toggleLightPollution}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-none border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                showLightPollution ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-3 w-3 rounded-none bg-white shadow-lg ring-0 transition-transform ${
                  showLightPollution ? "translate-x-4" : "translate-x-0.5"
                } mt-[0.5px]`}
              />
            </button>
          </div>
        </div>
      </PaneItemContainer>
    </Container>
  );
}
