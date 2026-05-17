"use client";

import { useEffect } from "react";
import { WeatherSync } from "@/components/weather/weather-sync";
import { useVyomaSelector } from "@/store/use-vyoma-store";

/**
 * Client-side component that synchronizes global UI settings from the Zustand store
 * to CSS variables on the document root.
 */
export function UIRootProvider({ children }: { children: React.ReactNode }) {
  const { uiOpacity, baseFontSize } = useVyomaSelector([
    "uiOpacity",
    "baseFontSize",
  ]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ui-opacity", (uiOpacity / 100).toString());
    root.style.setProperty("--base-font-size", `${baseFontSize}px`);
  }, [uiOpacity, baseFontSize]);

  return (
    <>
      <WeatherSync />
      {children}
    </>
  );
}
