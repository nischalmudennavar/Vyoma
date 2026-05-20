"use client";

import { MapPin, Clock } from "lucide-react";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { PaneItemContainer } from "@/components/layout/pane-item-container";

export function LocationStatus() {
  const { location, viewDate } = useVyomaStore();

  return (
    <PaneItemContainer
      title="Observer Status"
      icon={<MapPin className="w-4 h-4" />}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-4">
          <span className="text-muted-foreground uppercase font-black text-[9px] tracking-widest">Site</span>
          <span className="text-foreground font-bold text-right truncate max-w-[160px]">
            {location.label || "Custom Location"}
          </span>
        </div>
        
        <div className="flex justify-between items-center border-t border-border/10 pt-2">
          <span className="text-muted-foreground uppercase font-black text-[9px] tracking-widest">Coordinates</span>
          <div className="font-mono text-[10px] space-x-2">
            <span className="text-primary">{location.lat.toFixed(4)}°N</span>
            <span className="text-primary">{location.lng.toFixed(4)}°E</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-border/10 pt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground uppercase font-black text-[9px] tracking-widest">Epoch</span>
          </div>
          <span className="font-mono text-[10px] text-foreground">
            {viewDate.toISOString().split('T')[0]}
          </span>
        </div>
      </div>
    </PaneItemContainer>
  );
}
