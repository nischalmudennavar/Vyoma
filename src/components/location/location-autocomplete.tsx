"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { cn } from "@/lib/utils";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  className?: string;
  hideLabel?: boolean;
  placeholder?: string;
}

export function LocationAutocomplete({ 
  className, 
  hideLabel = false,
  placeholder = "e.g., Ladakh, India"
}: LocationAutocompleteProps) {
  const { location, updateLocation } = useVyomaStore();
  const [query, setQuery] = useState(location.label);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal query with external location if it changes from map drag
  useEffect(() => {
    setQuery(location.label);
  }, [location.label]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchResults = async () => {
      // Don't search if query is empty or matches the currently selected location label
      if (!query || query === location.label) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}&format=json&limit=5`,
        );
        const data = await res.json();
        if (active) {
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    // Debounce by 400ms
    const timer = setTimeout(() => {
      fetchResults();
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, location.label]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {!hideLabel && <Label htmlFor="location-search">Search</Label>}
      <Input
        id="location-search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        autoComplete="off"
        className={cn(className)}
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-none border border-input bg-popover p-1 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results.map((result) => (
            <li
              key={result.place_id}
              className="relative flex w-full cursor-pointer select-none items-center rounded-none py-1.5 px-2 text-xs outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={() => {
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                updateLocation(lat, lng, result.display_name);
                setQuery(result.display_name);
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const lat = parseFloat(result.lat);
                  const lng = parseFloat(result.lon);
                  updateLocation(lat, lng, result.display_name);
                  setQuery(result.display_name);
                  setIsOpen(false);
                }
              }}
            >
              <span className="truncate">{result.display_name}</span>
            </li>
          ))}
        </ul>
      )}
      {isOpen && isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 flex items-center justify-center rounded-none border border-input bg-popover p-2 text-xs text-muted-foreground shadow-md">
          Searching...
        </div>
      )}
    </div>
  );
}
