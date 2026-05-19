# Vyoma Project Journal

A timestamped summary of the development journey for Vyoma, a modern celestial navigation and astronomical observation platform.

---

### **2026-05-09: Foundation & Initial Setup**
- **Project Genesis:** Initialized the project using Next.js 16 (React 19).
- **Core Infrastructure:** Established the foundational architecture, including the Zustand store (`use-vyoma-store.ts`) and basic project structure.
- **Mapping & Location:** Integrated MapLibre GL for the map view and implemented location autocomplete functionality.
- **UI Shell:** Created the floating left pane and initial map controls.

### **2026-05-10: Celestial Logic & UI Overlays**
- **Astrometry Engine:** Implemented the core `astrometry.ts` library for topocentric celestial calculations (Sun, Moon, Galactic Core, Twilight phases).
- **Ephemeris UI:** Added ephemeris overlays and the celestial timeline for visualizing astronomical events over time.
- **Dashboard & Details:** Developed the `AstronomyDetails` panel and a dashboard for centralized data visualization.
- **Refinement:** Refactored the MapView and store for better performance; added map visibility controls and SVG overlays.

### **2026-05-11: "Swiss Aesthetic" & Architectural Maturity**
- **Design Overhaul:** Transitioned to a "Brutalist/Swiss" UI aesthetic with high contrast, zero-radius corners (`rounded-none`), and rigorous alignment.
- **Modular Controls:** Refactored settings into a dialog-based system and added a global settings toggle.
- **Celestial Refinement:** Replaced the `CelestialRadar` with a more precise `MapCelestialOverlay`, synchronized with geographical coordinates.
- **Component Reorganization:** Categorized components into `layout`, `celestial`, `weather`, and `shared` directories for better maintainability.
- **Weather Integration:** Integrated the Open-Meteo API via `WeatherSync` for real-time environmental data syncing.

### **2026-05-12: Quality of Life & Interaction**
- **Interaction Layer:** Added comprehensive keyboard shortcuts (`use-hotkeys.ts`) and a custom joystick component for intuitive map/date manipulation.
- **UI Polish:** Implemented skeleton loaders for weather and celestial data to improve perceived performance.
- **Milestone Merge:** Merged major features including the weather system and detailed timeline into the main development branch.

---

### **2026-05-16: High-Performance Offline Light Pollution Engine**
Implemented a fully offline, microsecond-fast light pollution lookup engine by converting massive scientific datasets into a compressed binary format processed via WebAssembly.

#### **Phase 1: Sourcing the Ground Truth Data**
- **The Dataset:** Utilized the **Falchi 2016 World Atlas of Artificial Night Sky Brightness**.
- **The Metric:** Focused on *Artificial Sky Brightness*, translating scientific measurements (`mcd/m2`) to the visual 1–9 Bortle Scale.
- **The Raw Format:** Started with an 840+ MB GeoTIFF of raw scientific data.

#### **Phase 2: The Python Compression Pipeline**
- **Downsampling:** Reduced resolution to ~10% using Nearest Neighbor resampling to maintain city boundary accuracy.
- **Data Sanitization:** Handled missing data (oceans/unmapped areas) by converting `NaN` and `NoData` to zero.
- **Bortle Mapping:** Bucketed raw values into 9 discrete Bortle classes.
- **Binary Serialization:** Optimized storage by forcing values into 8-bit unsigned integers (`uint8`), resulting in a flat, 1D binary file (`light_pollution.bin`).
- **Metadata Extraction:** Captured geographic boundaries and scaling factors in `metadata.json`.
- **Result:** Crushed 840MB of scientific data into a ~10MB efficient static asset.

#### **Phase 3: The WebAssembly (WASM) Core**
- **Rust Engine:** Built a custom Rust crate (`vyoma-core`) compiled to WASM for high-speed binary parsing.
- **Optimized Math:** Implemented coordinate-to-offset translation, allowing the engine to jump directly to the correct byte in the 10MB buffer.
- **Performance Fix (Memory Management):** Discovered a critical bottleneck where passing binary data by value in a tight loop caused massive memory copying. Refactored to a stateful `PollutionEngine` struct that loads data once into WASM memory, enabling $O(1)$ lookups with zero overhead.
- **Visual Engine:** Implemented a low-resolution Canvas overlay with CSS smoothing and `requestAnimationFrame` debouncing to maintain 60FPS even during map movements.

---

### **2026-05-17: Runtime Migration & Performance Optimization**
- **Bun Adoption:** Migrated the entire development and build pipeline to **Bun (v1.3.9)**. This transition significantly reduced install times and improved the responsiveness of the development environment.
- **Workflow Streamlining:** Replaced `npm`/`yarn` scripts with Bun's native runner, ensuring a more cohesive and faster development experience across the team.
- **Tooling Consolidation:** Aligned with the project's performance-first philosophy by leveraging Bun's unified toolkit for package management and script execution.

---

### **2026-05-19: UI Consolidation & Ergonomics**
- **Panel Consolidation:** Resolved vertical UI bloat by refactoring four dense floating panels (`UtilsPane`, `ControlPanel`, `AstronomyDetails`, `WeatherPanel`) into a single, comprehensive `LeftPane`.
- **Accordion Integration:** Implemented a robust accordion system (via Radix UI) within the `LeftPane` to allow users to toggle sections (Geospatial & Time, System Parameters, Celestial Metrics, Meteorological), significantly reducing control fatigue.
- **Keyboard Ergonomics:** Extracted keyboard shortcuts from the persistent control panel into a dedicated, accessible `KeyboardShortcutsModal`, further cleaning up the primary interface while maintaining discoverability.
- **Aesthetic Enforcement:** Ensured all new components strictly adhere to the project's "Technical Brutalism" standard (zero-radii, high contrast, semantic tokens).

---

## **Current Project State (May 19, 2026)**
The project has evolved into a sophisticated celestial navigation tool. Key strengths include:
- **Offline Intelligence:** High-performance light pollution and celestial data available without connectivity.
- **High-Precision Astrometry:** Worker-based calculations for smooth performance.
- **Modern Infrastructure:** Powered by Next.js 16, React 19, and Bun for a cutting-edge development experience.
- **Rigorous Design System:** Strict adherence to the Swiss Aesthetic and semantic tokens.
- **Real-time Synchronization:** Seamless integration of time, location, and weather data.

*Next focus: UI integration of light pollution metrics and further refinement of the "Swiss Aesthetic" controls.*
