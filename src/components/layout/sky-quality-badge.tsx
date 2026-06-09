"use client";

import { useVyomaStore } from "@/store/use-vyoma-store";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const BORTLE_MAP: Record<number, { label: string; description: string; color: string }> = {
  1: { label: "Excellent", description: "Pristine dark-sky site", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  2: { label: "Truly Dark", description: "Typical truly dark site", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  3: { label: "Rural Sky", description: "Some light pollution at horizon", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  4: { label: "Rural/Suburban", description: "Muted transition sky", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  5: { label: "Suburban", description: "Substantial light pollution", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  6: { label: "Bright Suburban", description: "Sky glow clearly visible", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  7: { label: "Suburban/Urban", description: "Strong sky glow", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  8: { label: "City Sky", description: "Very bright sky", color: "text-red-400 border-red-400/30 bg-red-400/10" },
  9: { label: "Inner-City", description: "Extremely bright sky", color: "text-red-400 border-red-400/30 bg-red-400/10" },
};

export function SkyQualityBadge() {
  const bortle = useVyomaStore((state) => state.bortle);
  const info = BORTLE_MAP[bortle] || BORTLE_MAP[5];

  return (
    <div className={cn(
      "flex flex-col border p-3 gap-0.5 transition-colors",
      info.color
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Sky Quality
          </span>
        </div>
        <span className="font-mono text-xs font-black">
          BORTLE {bortle}
        </span>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-sm font-black uppercase tracking-tight">
          {info.label}
        </span>
        <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter text-right">
          {info.description}
        </span>
      </div>
    </div>
  );
}
