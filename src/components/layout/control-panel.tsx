"use client";

import { LocationAutocomplete } from "@/components/location/location-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { Container } from "@/components/layout/container";

export function ControlPanel() {
  const {
    location,
    viewDate,
    updateDate,
    updateTime,
    updateLocation,
    showMoon,
    toggleMoon,
  } = useVyomaStore();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-").map(Number);
      updateDate(new Date(year, month - 1, day));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      updateTime(hours, minutes);
    }
  };

  const year = viewDate.getFullYear();
  const month = (viewDate.getMonth() + 1).toString().padStart(2, "0");
  const day = viewDate.getDate().toString().padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  const hours = viewDate.getHours().toString().padStart(2, "0");
  const minutes = viewDate.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  return (
    <Container
      applyUiOpacity
      className="w-full md:w-[320px] border border-border/80 bg-background/(--container-opacity) backdrop-blur-2xl shadow-2xl flex flex-col p-6 gap-6 pointer-events-auto transition-all duration-300"
      style={{ backgroundColor: "color-mix(in oklch, color-mix(in oklch, var(--color-background), var(--color-primary) 5%), transparent calc(100% * (1 - var(--container-opacity, 0.8))))" } as React.CSSProperties}
    >
      <div className="space-y-4">
        <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90 border-b border-border/40 pb-2">
          Location
        </h2>
        <div className="bg-muted/20 p-4 space-y-4 border-l-2 border-primary/30">
          <LocationAutocomplete />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="lat" className="text-[10px] uppercase font-bold text-muted-foreground">Lat</Label>
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
              <Label htmlFor="lng" className="text-[10px] uppercase font-bold text-muted-foreground">Lng</Label>
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
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90 border-b border-border/40 pb-2">
          Visibility
        </h2>
        <div className="bg-muted/20 p-4 border-l-2 border-primary/30 flex items-center justify-between">
          <Label htmlFor="moon-toggle" className="text-xs font-medium">Show Moon</Label>
          <button
            type="button"
            id="moon-toggle"
            role="switch"
            aria-checked={showMoon}
            onClick={toggleMoon}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
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
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90 border-b border-border/40 pb-2">
          Time & Date
        </h2>
        <div className="bg-muted/20 p-4 space-y-4 border-l-2 border-primary/30">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-[10px] uppercase font-bold text-muted-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={dateString}
              onChange={handleDateChange}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-[10px] uppercase font-bold text-muted-foreground">Time</Label>
            <Input
              id="time"
              type="time"
              value={timeString}
              onChange={handleTimeChange}
              className="bg-background/50"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
