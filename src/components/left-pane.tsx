"use client";

import { LocationAutocomplete } from "@/components/location-autocomplete";
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

  // Format date for input type="date" (YYYY-MM-DD)
  const year = viewDate.getFullYear();
  const month = (viewDate.getMonth() + 1).toString().padStart(2, "0");
  const day = viewDate.getDate().toString().padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  // Format time for input type="time" (HH:MM)
  const hours = viewDate.getHours().toString().padStart(2, "0");
  const minutes = viewDate.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  return (
    <aside className="w-[15vw] min-w-[240px] max-w-[320px] h-full border-r bg-background flex flex-col p-4 gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Location</h2>
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

      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Time & Date</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="date">Date</Label>
          </div>
          <Input
            id="date"
            type="date"
            value={dateString}
            onChange={handleDateChange}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="time">Time</Label>
          </div>
          <Input
            id="time"
            type="time"
            value={timeString}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </aside>
  );
}
