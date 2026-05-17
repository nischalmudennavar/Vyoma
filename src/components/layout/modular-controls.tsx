"use client";

import { Container } from "@/components/layout/container";
import { LocationAutocomplete } from "@/components/location/location-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVyomaStore } from "@/store/use-vyoma-store";

export function LocationControls() {
  const { location, updateLocation } = useVyomaStore();

  return (
    <Container
      applyUiOpacity
      className="w-full md:w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl flex flex-col p-5 gap-6 pointer-events-auto"
    >
      <div className="space-y-1">
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
    </Container>
  );
}

export function VisibilityControls() {
  const { showMoon, toggleMoon } = useVyomaStore();

  return (
    <Container
      applyUiOpacity
      className="w-full md:w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl flex flex-col p-5 gap-6 pointer-events-auto"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">Visibility</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="moon-toggle">Show Moon</Label>
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
    </Container>
  );
}

export function TimeDateControls() {
  const { viewDate, updateDate, updateTime } = useVyomaStore();

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
      className="w-full md:w-[320px] border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl flex flex-col p-5 gap-6 pointer-events-auto"
    >
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
