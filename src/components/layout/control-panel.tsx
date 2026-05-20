"use client";

import { Clock, Keyboard, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PaneItemContainer } from "@/components/layout/pane-item-container";
import { LocationAutocomplete } from "@/components/location/location-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useVyomaStore } from "@/store/use-vyoma-store";

export function ControlPanel() {
  const { location, viewDate, updateDate, updateTime, updateLocation } =
    useVyomaStore();

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      updateTime(hours, minutes);
    }
  };

  const hours = viewDate.getHours().toString().padStart(2, "0");
  const minutes = viewDate.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

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
      <PaneItemContainer title="Location" icon={<MapPin className="w-4 h-4" />}>
        <LocationAutocomplete />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label
              htmlFor="lat"
              className="text-[10px] uppercase font-bold text-muted-foreground"
            >
              Lat
            </Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={location.lat}
              onChange={(e) =>
                updateLocation(
                  parseFloat(e.target.value) || 0,
                  location.lng,
                  location.label,
                )
              }
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lng"
              className="text-[10px] uppercase font-bold text-muted-foreground"
            >
              Lng
            </Label>
            <Input
              id="lng"
              type="number"
              step="any"
              value={location.lng}
              onChange={(e) =>
                updateLocation(
                  location.lat,
                  parseFloat(e.target.value) || 0,
                  location.label,
                )
              }
              className="bg-background/50"
            />
          </div>
        </div>
      </PaneItemContainer>

      <PaneItemContainer
        title="Time & Date"
        icon={<Clock className="w-4 h-4" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="text-[10px] uppercase font-bold text-muted-foreground"
            >
              Date
            </Label>
            <DatePicker
              date={viewDate}
              setDate={(date) => date && updateDate(date)}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="time"
              className="text-[10px] uppercase font-bold text-muted-foreground"
            >
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={timeString}
              onChange={handleTimeChange}
              className="bg-background/50"
            />
          </div>
        </div>
      </PaneItemContainer>

      <PaneItemContainer
        title="Keyboard Controls"
        icon={<Keyboard className="w-4 h-4" />}
      >
        <div className="space-y-3 text-muted-foreground">
          <div className="flex justify-between items-center">
            <span className="font-mono bg-background/50 border border-border/40 px-1.5 py-0.5 rounded-sm shadow-sm text-[10px] font-bold text-foreground">
              W A S D
            </span>
            <span>Pan Map</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono bg-background/50 border border-border/40 px-1.5 py-0.5 rounded-sm shadow-sm text-[10px] font-bold text-foreground">
              Q / E
            </span>
            <span>Zoom Out / In</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono bg-background/50 border border-border/40 px-1.5 py-0.5 rounded-sm shadow-sm text-[10px] font-bold text-foreground">
              ↑ / ↓
            </span>
            <span>Time (± Day)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono bg-background/50 border border-border/40 px-1.5 py-0.5 rounded-sm shadow-sm text-[10px] font-bold text-foreground">
              ← / →
            </span>
            <span>Time (± Hour)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono bg-background/50 border border-border/40 px-1.5 py-0.5 rounded-sm shadow-sm text-[10px] font-bold text-foreground">
              R
            </span>
            <span>Reset View</span>
          </div>
        </div>
      </PaneItemContainer>
    </Container>
  );
}
