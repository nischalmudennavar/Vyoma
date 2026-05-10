"use client";

import { Circle, Moon, MoonStar, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CelestialEventType =
  | "sun"
  | "moon"
  | "galactic"
  | "phase"
  | "day-marker";

export interface CelestialEvent {
  id: string;
  timestamp: Date;
  title: string;
  subtitle?: string;
  description?: string;
  type: CelestialEventType;
  icon?: ReactNode;
}

interface CelestialTimelineProps {
  events: CelestialEvent[];
  className?: string;
}

export function CelestialTimeline({
  events,
  className,
}: CelestialTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  if (sortedEvents.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-3xl mx-auto py-8 px-4 sm:px-8 font-sans text-white",
        className,
      )}
    >
      <div className="relative">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[19px] top-6 bottom-0 w-px bg-gradient-to-b from-neutral-800 via-neutral-800 to-transparent" />

        {/* Timeline events */}
        <div className="space-y-10">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="relative flex gap-6 sm:gap-8 items-start group"
            >
              {/* Icon Node */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-none bg-[#050505] border transition-all duration-300 shrink-0",
                  event.type === "galactic"
                    ? "border-primary text-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] group-hover:scale-110"
                    : "border-neutral-800 text-neutral-400 group-hover:border-neutral-500 group-hover:text-neutral-200 group-hover:scale-110 group-hover:bg-neutral-900",
                )}
              >
                {event.icon || <DefaultIcon type={event.type} />}
              </div>

              {/* Time + Content */}
              <div className="flex flex-col gap-1.5 pt-1 pb-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                  <time className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 tabular-nums shrink-0">
                    {event.timestamp.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </time>
                  <div className="hidden sm:block w-1.5 h-1.5 rounded-none bg-neutral-800" />
                  <h3
                    className={cn(
                      "text-lg font-semibold tracking-tight transition-colors",
                      event.type === "galactic"
                        ? "text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        : "text-neutral-100 group-hover:text-white",
                    )}
                  >
                    {event.title}
                  </h3>
                </div>

                {event.subtitle && (
                  <p className="text-sm font-medium text-neutral-400">
                    {event.subtitle}
                  </p>
                )}

                {event.description && (
                  <div className="mt-3 bg-neutral-900/30 border border-neutral-800/50 rounded-none p-4 transition-all duration-300 group-hover:bg-neutral-900/60 group-hover:border-neutral-700/60">
                    <p className="text-[13px] sm:text-sm text-neutral-400 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefaultIcon({ type }: { type: CelestialEventType }) {
  switch (type) {
    case "sun":
      return <Sun className="w-5 h-5" />;
    case "moon":
      return <Moon className="w-5 h-5" />;
    case "galactic":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 10 57"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <title>Galactic Center Event</title>
          <circle cx="5" cy="2" r="2" fill="currentColor" />
          <circle cx="5" cy="9" r="3" fill="currentColor" />
          <circle cx="5" cy="18" r="4" fill="currentColor" />
          <circle cx="5" cy="29" r="5" fill="currentColor" />
          <circle cx="5" cy="40" r="4" fill="currentColor" />
          <ellipse cx="5" cy="48.5" rx="3" ry="2.5" fill="currentColor" />
          <circle cx="5" cy="55" r="2" fill="currentColor" />
        </svg>
      );
    case "phase":
      return <MoonStar className="w-5 h-5" />;
    default:
      return <Circle className="w-3 h-3 fill-currentColor stroke-none" />;
  }
}
