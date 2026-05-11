"use client";

import { useEffect } from "react";
import { useVyomaStore } from "@/store/use-vyoma-store";

/**
 * Custom hook to register global keyboard shortcuts.
 */
export function useHotkeys() {
  const { viewDate, updateTime } = useVyomaStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const isMod = e.metaKey || e.ctrlKey;

      // Time Step: Cmd/Ctrl + ArrowRight (Forward 15m)
      if (isMod && e.key === "ArrowRight") {
        e.preventDefault();
        const newDate = new Date(viewDate.getTime() + 15 * 60 * 1000);
        updateTime(newDate.getHours(), newDate.getMinutes());
      }

      // Time Step: Cmd/Ctrl + ArrowLeft (Backward 15m)
      if (isMod && e.key === "ArrowLeft") {
        e.preventDefault();
        const newDate = new Date(viewDate.getTime() - 15 * 60 * 1000);
        updateTime(newDate.getHours(), newDate.getMinutes());
      }

      // Time Step: Shift + Cmd/Ctrl + ArrowRight (Forward 1h)
      if (isMod && e.shiftKey && e.key === "ArrowRight") {
        e.preventDefault();
        const newDate = new Date(viewDate.getTime() + 60 * 60 * 1000);
        updateTime(newDate.getHours(), newDate.getMinutes());
      }

      // Time Step: Shift + Cmd/Ctrl + ArrowLeft (Backward 1h)
      if (isMod && e.shiftKey && e.key === "ArrowLeft") {
        e.preventDefault();
        const newDate = new Date(viewDate.getTime() - 60 * 60 * 1000);
        updateTime(newDate.getHours(), newDate.getMinutes());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewDate, updateTime]);
}
