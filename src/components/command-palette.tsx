"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, MapPin, Sun, Moon, Star, Calendar, Clock } from "lucide-react";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { updateLocation, updateDate, updateTime } = useVyomaStore();

  // Toggle open on Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search locations
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}&format=json&limit=5`,
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-md transition-all"
    >
      <div className="w-full max-w-[640px] bg-background border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden rounded-none">
        <div className="flex items-center border-b border-border px-4 h-12 gap-3 bg-muted/20">
          <Search className="w-4 h-4 text-primary" />
          <Command.Input
            autoFocus
            placeholder="Search locations, stars, or commands..."
            onValueChange={setQuery}
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono placeholder:text-muted-foreground/50 h-full"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-background border border-border/50">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Esc</span>
          </div>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 outline-none bg-background">
          <Command.Empty className="py-6 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
            No results found.
          </Command.Empty>

          {results.length > 0 && (
            <Command.Group heading="Locations" className="px-2 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              {results.map((res) => (
                <Command.Item
                  key={res.place_id}
                  onSelect={() => {
                    updateLocation(parseFloat(res.lat), parseFloat(res.lon), res.display_name);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-xs cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground hover:bg-muted transition-colors rounded-none outline-none mt-1"
                >
                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                  <span className="truncate">{res.display_name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Quick Actions" className="px-2 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 mt-2">
            <Command.Item
              onSelect={() => {
                updateDate(new Date());
                updateTime(new Date().getHours(), new Date().getMinutes());
                setOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 text-xs cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground hover:bg-muted transition-colors rounded-none outline-none mt-1"
            >
              <Clock className="w-3.5 h-3.5 opacity-70" />
              <span>Reset to Current Time</span>
            </Command.Item>
            <Command.Item
              className="flex items-center gap-3 px-3 py-2.5 text-xs cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground hover:bg-muted transition-colors rounded-none outline-none mt-1"
            >
              <Star className="w-3.5 h-3.5 opacity-70" />
              <span>Jump to Galactic Core</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
