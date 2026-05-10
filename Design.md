# Visual Design Guidelines - Project Vyoma

## Core Aesthetic: Modern Swiss & Analog Instrumentation
Project Vyoma follows a clean, minimalist, and data-driven aesthetic inspired by high-end Swiss watchmaking, vintage camera mechanics, and precise astronomical charts. The interface should feel like a "living" instrument—functional, elegant, and mechanically precise.

### 1. Geometric Precision (No Radius Policy)
- **Zero Radii:** A strict `rounded-none` policy is enforced across the entire application for UI containers.
- **Instrument Primitives:** Circular shapes are reserved for mechanical pivots, watch-like dials, and celestial bodies.
- **Swiss Layout:** Use generous white space (or dark space) and clear grid alignments.

### 2. Layout & Spacing
- **Floating Overlays:** Positioned with precision (e.g., `top-6`, `left-6`).
- **Analog Glass:** Overlays use `bg-background/80` or `bg-background/50` with `backdrop-blur-xl` and `shadow-2xl` to mimic etched focusing glass.
- **Fine Lines:** Use 1px borders (`border-border/40`) and "etched" markings to define areas.

### 3. Typography
- **Monospace Precision:** `font-mono` (Fira Code) for technical data and metadata.
- **Swiss Sans:** Clean, high-legibility sans-serif for primary navigation (if any).
- **Metadata:** Small, crisp caps with wide tracking (`text-[10px] uppercase font-bold tracking-widest`) for a "technical manual" feel.

### 4. Color Palette (OKLCH)
- **Base:** Deep space dark (`oklch(0.1188 0.0318 15.2849)`).
- **Markings:** Highly transparent white/grey lines for "etched" reticles.
- **Ephemeris Tones:** 
  - Sun: Muted warm amber (Rise) and burnt orange (Set).
  - Moon: Cool ice blue or silver.
  - Core: Neon primary highlight.

### 5. Instrumentation (The Celestial Overlay)
- **The Reticle:** Concentric 1px circles representing distance or elevation, centered on a metallic/brass pivot.
- **Variable Trajectories:** The Galactic Arc uses dots that grow in size and opacity as the core rises in the sky, adding a sense of Z-axis depth.
- **Visibility Wedge:** A precise, frosted-glass "cone" showing the optimal FOV or visibility window.

### 6. Implementation Pattern: UI Containers
- **Centralized Opacity:** All floating UI elements use the `Container` component with the `applyUiOpacity` prop.
- **Indirect Control:** The `Container` acts as the single point of synchronization with the global settings panel.
