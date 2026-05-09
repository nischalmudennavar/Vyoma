"use client";

import { Circle, Moon, MoonStar, Star, Sun } from "lucide-react";
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
        "flex flex-col w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 bg-[#050505] text-white font-sans",
        className,
      )}
    >
      <div className="relative pl-12 sm:pl-16">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-neutral-800" />

        {/* Timeline events */}
        <div className="space-y-10">
          {sortedEvents.map((event) => (
            <div key={event.id} className="relative flex items-start group">
              {/* Icon Node */}
              <div
                className={cn(
                  "absolute left-0 top-1 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#050505] border transition-colors shrink-0",
                  event.type === "galactic"
                    ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    : "border-neutral-700 group-hover:border-neutral-500",
                )}
              >
                {event.icon || <DefaultIcon type={event.type} />}
              </div>

              {/* Time + Content */}
              <div className="ml-14 sm:ml-16 flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 tabular-nums">
                    {event.timestamp
                      .toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .toLowerCase()}
                  </span>
                  <h3
                    className={cn(
                      "text-base font-semibold tracking-tight transition-colors",
                      event.type === "galactic"
                        ? "text-primary"
                        : "text-neutral-100",
                    )}
                  >
                    {event.title}
                  </h3>
                </div>
                {event.subtitle && (
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {event.subtitle}
                  </p>
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
      return <Circle className="w-3 h-3 fill-neutral-700 stroke-none" />;
  }
}
