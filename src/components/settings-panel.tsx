"use client";

import { Minus, Plus, Settings2, X } from "lucide-react";
import { useState } from "react";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Container } from "@/components/container";

/**
 * SettingsPanel component that provides global UI customization controls.
 * Adheres to the Technical Brutalist aesthetic with zero radii.
 */
export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    uiOpacity,
    setUiOpacity,
    mapVisibility,
    setMapVisibility,
    baseFontSize,
    setBaseFontSize,
  } = useVyomaStore();

  const handleFontSizeChange = (delta: number) => {
    setBaseFontSize(Math.max(10, Math.min(24, baseFontSize + delta)));
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-6 left-6 z-30 bg-background/80 backdrop-blur-xl border-border/50"
        onClick={() => setIsOpen(true)}
        title="Open Settings"
      >
        <Settings2 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Container
      applyUiOpacity
      className="absolute bottom-6 left-6 z-30 w-72 border border-border/50 bg-background/90 backdrop-blur-2xl shadow-2xl flex flex-col p-5 gap-6 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-black tracking-widest uppercase">
            Settings
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsOpen(false)}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2.5">
          <div className="flex justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
              UI Opacity
            </Label>
            <span className="font-mono text-[10px] tabular-nums">
              {uiOpacity}%
            </span>
          </div>
          <Slider
            value={[uiOpacity]}
            onValueChange={([val]) => setUiOpacity(val)}
            min={10}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
              Map Visibility
            </Label>
            <span className="font-mono text-[10px] tabular-nums">
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

        <div className="space-y-2.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground">
            Base Font Size
          </Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handleFontSizeChange(-1)}
              disabled={baseFontSize <= 10}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="flex-1 text-center font-mono text-sm tabular-nums">
              {baseFontSize}px
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handleFontSizeChange(1)}
              disabled={baseFontSize >= 24}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="text-[9px] uppercase font-mono text-muted-foreground/60 tracking-tighter">
        Visual Guidelines: Technical Brutalism
      </div>
    </Container>
  );
}
