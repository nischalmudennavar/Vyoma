<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Vyoma - Project Standards & Architecture

## Core Mandates

- **Strict Token Adherence:** All styling must strictly utilize the design tokens and utility classes defined in `src/app/globals.css` or provided by Shadcn UI.
- **Prohibition of Arbitrary Values:** Never use hardcoded or "just-in-time" values (e.g., `text-[12px]`, `bg-[#f0f0f0]`, `p-[17px]`). All properties must map to the established theme scale.
- **Theme Scalability:** To ensure the system remains fully adaptable to theme, color, and font changes, use only semantic variables (e.g., `text-foreground`, `bg-background`, `font-mono`). Hardcoded values are strictly forbidden as they compromise architectural maintainability and theme-switching.
- **Geometric Precision:** Adhere to the "Swiss Aesthetic"—zero radii (`rounded-none`), high contrast, and rigorous alignment (standard panel width: `320px`).

## Tech Stack
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS v4
- **State:** Zustand (with Selector Pattern for performance)
- **Celestial Logic:** `astronomy-engine`
- **Mapping:** `maplibre-gl`
- **Weather:** Open-Meteo API (fetched via `src/lib/weather.ts`)

## Architectural Components

### 1. State & Data Sync
- **Zustand Store:** Located in `src/store/use-vyoma-store.ts`. Houses all global UI and celestial state.
- **WeatherSync:** A headless component (`src/components/weather/weather-sync.tsx`) that automatically fetches and updates weather data in the store whenever location changes.

### 2. UI Modularization
- **Panels:** UI is split into modular, standalone panels (`AstronomyDetails`, `WeatherPanel`, `ControlPanel`).
- **Standard Width:** All primary floating panels should maintain a width of `320px` for visual consistency.
- **Dynamic Imports:** Heavy components (Map, Ephemeris) must be dynamically imported to optimize initial load.

### 3. Navigation & Coordinate System
- All components must sync with the `location` and `viewDate` objects in the Zustand store.
- Astronomical calculations must be topocentric (observer-relative) whenever possible.

## Component Quality
Write clean, maintainable, and scalable components with:
- Comprehensive JSDoc documentation.
- Strict TypeScript types for all props and state.
- Semantic HTML and ARIA accessibility where applicable.
