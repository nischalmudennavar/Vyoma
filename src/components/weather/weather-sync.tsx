"use client";

import { useEffect } from "react";
import { fetchWeather } from "@/lib/weather";
import { useVyomaStore } from "@/store/use-vyoma-store";

/**
 * Headless component that syncs weather data with the current location.
 * Listens to location changes in the store and updates weather state.
 * Debounced by 5000ms to prevent excessive API calls during interaction.
 */
export function WeatherSync() {
  const { location, setWeather, setWeatherLoading } = useVyomaStore();

  useEffect(() => {
    let active = true;

    // Immediately indicate loading when location starts changing
    setWeatherLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const weather = await fetchWeather(location.lat, location.lng);
        if (active) {
          setWeather(weather);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        if (active) {
          setWeatherLoading(false);
        }
      }
    }, 1500);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [location.lat, location.lng, setWeather, setWeatherLoading]);

  return null;
}
