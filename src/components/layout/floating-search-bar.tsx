"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LocationAutocomplete } from "@/components/location/location-autocomplete";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useVyomaStore } from "@/store/use-vyoma-store";

/**
 * A floating search bar (Airbnb-style) positioned at the top-center.
 * Adheres to the Swiss Aesthetic: zero-radius corners and high contrast.
 * Handles Geospatial (Location) and Chronological (Date/Time) inputs.
 */
export function FloatingSearchBar() {
  const { location, viewDate, updateDate, updateTime } = useVyomaStore();

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
      className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto hidden md:block"
    >
      <div className="flex items-center bg-background/90 backdrop-blur-xl border border-border shadow-tactical h-16 w-max min-w-[640px]">
        {/* Location Section */}
        <div className="flex-1 flex flex-col px-6 border-r border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer h-full justify-center min-w-[280px]">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 group-hover:text-primary transition-colors">
            Location
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <div className="w-full">
              <LocationAutocomplete
                hideLabel
                className="h-6 text-sm font-black bg-transparent border-none p-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30 rounded-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Date Section */}
        <div className="flex-1 flex flex-col px-6 border-r border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer h-full justify-center min-w-[180px]">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 group-hover:text-primary transition-colors">
            Target Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <DatePicker
              date={viewDate}
              setDate={(date) => date && updateDate(date)}
              className="h-6 text-sm font-black bg-transparent border-none p-0 focus-visible:ring-0 shadow-none w-full justify-start rounded-none px-0"
            />
          </div>
        </div>

        {/* Time Section */}
        <div className="flex-1 flex flex-col px-6 hover:bg-primary/5 transition-colors group cursor-pointer h-full justify-center min-w-[180px]">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 group-hover:text-primary transition-colors">
            Observation Time
          </label>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <Input
              type="time"
              value={timeString}
              onChange={handleTimeChange}
              className="h-6 text-sm font-black bg-transparent border-none p-0 focus-visible:ring-0 shadow-none w-full rounded-none px-0"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
