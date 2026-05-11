"use client";

import { useEffect } from "react";
import { useVyomaStore } from "@/store/use-vyoma-store";
import { fetchWeather } from "@/lib/weather";

/**
 * Headless component that syncs weather data with the current location.
 * Listens to location changes in the store and updates weather state.
 */
export function WeatherSync() {
  const { location, setWeather } = useVyomaStore();

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(async () => {
      const weather = await fetchWeather(location.lat, location.lng);
      if (active) {
        setWeather(weather);
      }
    }, 1000); // Debounce weather fetching to avoid hitting API too frequently on map drag

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [location.lat, location.lng, setWeather]);

  return null;
}
