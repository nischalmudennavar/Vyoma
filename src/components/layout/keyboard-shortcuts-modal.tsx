"use client";

import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { keys: ["W", "A", "S", "D"], action: "Pan Map" },
    { keys: ["Q", "/", "E"], action: "Zoom Out / In" },
    { keys: ["↑", "/", "↓"], action: "Time (± Day)" },
    { keys: ["←", "/", "→"], action: "Time (± Hour)" },
    { keys: ["R"], action: "Reset View" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-2xl border-border/40 shadow-3xl">
        <DialogHeader className="border-b border-border/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary">
              <Keyboard className="w-5 h-5" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-base font-black tracking-widest uppercase">
                Keyboard System
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Command & Control Hotkeys
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.action}
              className="flex justify-between items-center bg-muted/20 p-3 border border-border/10 group hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1.5">
                {shortcut.keys.map((key) => (
                  <span
                    key={key}
                    className="font-mono bg-background border border-border/40 px-2 py-1 rounded-none shadow-sm text-[10px] font-black text-foreground group-hover:text-primary transition-colors"
                  >
                    {key}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/20 text-[9px] uppercase font-mono text-muted-foreground/60 tracking-widest text-center">
          Architectural Standard: Vyoma-Core-OS
        </div>
      </DialogContent>
    </Dialog>
  );
}
