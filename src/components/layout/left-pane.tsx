"use client";

import { Container } from "@/components/layout/container";
import { LocationAutocomplete } from "@/components/location/location-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVyomaStore } from "@/store/use-vyoma-store";

export function LeftPane() {
  const { location, viewDate, updateDate, updateTime, updateLocation } =
    useVyomaStore();

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
      className="absolute top-6 left-6 z-20 w-full md:w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl flex flex-col p-5 gap-6 max-h-[calc(100%-3rem)] overflow-y-auto pointer-events-auto"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">Controls</h2>
        <LocationAutocomplete />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="lat">Lat</Label>
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
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Lng</Label>
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
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">Time & Date</h2>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={dateString}
            onChange={handleDateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={timeString}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </Container>
  );
}
