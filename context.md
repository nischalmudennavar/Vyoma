# Project Vyoma - Current Implementation Context

This document provides a comprehensive summary of the architecture, features, and components implemented so far in Project Vyoma, a celestial navigation and visualization tool built with Next.js, MapLibre, and `astronomy-engine`.

## 1. Global State Management (`src/store/use-vyoma-store.ts`)
The application relies on a central Zustand store as its single source of truth.
- **State variables:** `viewDate` (Date), `location` (lat, lng, and label).
- **Actions:** `updateTime(hours, minutes)`, `updateDate(date)`, and `updateLocation(lat, lng, label)`.
- All major components subscribe to this store to ensure the UI, Map, Celestial Radar, and Ephemeris Timeline are perfectly synchronized.

## 2. Core Astrometry Engine (`src/lib/astrometry.ts`)
A dedicated library wrapping `astronomy-engine` for high-precision celestial calculations.
- **Position Calculation:** Functions to compute the Equatorial and Horizontal coordinates (Altitude and Azimuth) for the **Galactic Core (Sagittarius A*)**, **Sun**, and **Moon** (`getGalacticCorePosition`, `getSunPosition`, `getMoonPosition`).
- **Trajectory Generation:** Generates arrays of position data over a given time duration (e.g., a 72-hour sliding window with 15-minute intervals) to draw smooth trajectory curves.
- **Twilight Phases:** Calculates exact times for various phases of light (Sunrise, Sunset, Civil/Nautical/Astronomical Dawn & Dusk) relative to the observer's location and date.

## 3. UI and Navigation

### Left Pane & Controls (`src/components/control-panel/left-pane.tsx`)
- A floating, glassmorphism sidebar positioned on the left side.
- Contains controls to update the global `location`, `date`, and `time` states.
- Integrates `LocationAutocomplete` (`src/components/control-panel/location-autocomplete.tsx`), which performs debounced (400ms) geocoding against the OpenStreetMap Nominatim API. Selecting a location smoothly pans the map and updates the entire astrometry math context.

### The Map View (`src/components/map-view.tsx` & `src/components/ui/map.tsx`)
- A full-screen interactive MapLibre map component acting as the base layer.
- Incorporates `MapControls` (Zoom, Compass, Locate, Fullscreen) adhering to the project's styling.
- Features a draggable `MapMarker` that binds two-way state updates between the map and the global location store.

## 4. Visualization Overlays

### Geographically-synced Celestial Overlay (`src/components/control-panel/map-celestial-overlay.tsx`)
- An SVG overlay sitting directly on the map view, synced to the coordinate system.
- Follows a Modern Swiss and Analog Instrument aesthetic.
- Renders:
  - Concentric reticle rings (etched glass look) for distance/elevation.
  - Precise ephemeris lines for Sun and Moon Rise/Set azimuths.
  - A dynamic dotted Galactic Arc that scales based on core elevation.
  - A subtle FOV/Visibility Wedge with a frosted-glass gradient.
  - A mechanical-watch-inspired center pivot at the observer's location.

### Ephemeris Timeline (`src/components/control-panel/ephemeris-timeline.tsx` & `src/components/control-panel/ephemeris-overlay.tsx`)
- A continuous, infinitely-pannable 2D Cartesian timeline acting as an interactive time scrubber, located at the bottom of the screen.
- **Backdrop (Twilight Map):** Renders colored SVG blocks for twilight phases (Night, Blue Hour, Golden Hour, Day) computed dynamically.
- **Curves:** Plots smooth, color-coded altitude curves for the Sun, Moon, and Galactic Core over a 72-hour rolling buffer window.
- **Playhead:** A fixed center playhead that intersections with the Galactic Core trajectory. Dragging the timeline horizontally smoothly scrubs the application's global `viewDate` and time forward and backward, immediately driving animations across the map and celestial radar.

## 5. Styling and Theming
- Strict adherence to CSS variables and design tokens (`src/app/globals.css`).
- Consistent use of `foreground/10`, `primary`, and semantic color spaces.
- Floating overlay aesthetics employ `backdrop-blur-xl`, `shadow-2xl`, and rounded corners to deliver a high-quality "Swiss" design feel.
