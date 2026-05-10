# Visual Design Guidelines - Project Vyoma

## Core Aesthetic: Technical Brutalism / Swiss Engineering
Project Vyoma follows a precise, data-driven aesthetic inspired by astronomical instrumentation and Swiss design principles. The interface should feel like a high-precision tool.

### 1. Geometric Precision (No Radius Policy)
- **Zero Radii:** A strict `rounded-none` policy is enforced across the entire application. All containers, buttons, inputs, and overlays must have sharp 90-degree corners.
- **Exception:** Geometric primitives that represent actual physical or mathematical concepts (e.g., the celestial radar circle, planet indicators) may remain circular. However, any UI-level containment or decorative elements must be rectangular.

### 2. Layout & Spacing
- **Floating Overlays:** Use `absolute` positioning with significant padding from viewport edges (e.g., `top-6`, `left-6`).
- **Glassmorphism:** Overlays should utilize `bg-background/80` or `bg-background/50` combined with `backdrop-blur-xl` and `shadow-2xl` for depth.
- **Borders:** Subtle borders using `border-border/50` or `ring-1 ring-foreground/10` to define boundaries without heavy visual weight.

### 3. Typography
- **Monospace Primary:** `font-mono` (Fira Code) is the primary typeface for all data, labels, and UI controls.
- **Hierarchy:** Use uppercase and tracking-widest for secondary labels and metadata (e.g., `text-[10px] uppercase font-black tracking-widest`).

### 4. Color Palette (OKLCH)
- **Background:** Deep space dark (`oklch(0.1188 0.0318 15.2849)`).
- **Foreground:** High-contrast technical white (`oklch(0.9607 0.0154 7.4853)`).
- **Primary:** Neon highlight for active data points (`oklch(0.6122 0.2082 22.241)`).
- **Chart Colors:** Semantic colors for Sun (Gold), Moon (Silver), and Core (Primary).

### 5. Interaction
- **Translucency:** UI components should have adjustable or context-aware opacity (default `80%`) to maintain visibility of the underlying celestial map.
### 6. Implementation Pattern: UI Containers
- **Centralized Opacity:** All floating UI elements must use the `Container` component (`src/components/container.tsx`) with the `applyUiOpacity` prop.
- **Indirect Control:** Direct manipulation of `opacity` or `var(--ui-opacity)` in individual components is discouraged. The `Container` acts as the single point of synchronization with the global settings panel.
