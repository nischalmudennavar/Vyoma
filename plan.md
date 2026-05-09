Project Vyom
1. Product Requirements Document (PRD)VisionTo provide astrophotographers with a "Digital Twin" of the night sky, allowing for precise pre-visualization of the Galactic Core's position relative to topography and light pollution.Target AudienceTrek-based Photographers: Users planning shots in remote, high-altitude regions (e.g., Sikkim, Ladakh).Urban Astronomers: Users looking for the nearest "Dark Sky" pockets using light pollution data.Functional Requirements (FRs)Interactive 3D Celestial Dome: A 360° unlocked viewport showing the star field and the Milky Way band.Galactic Core Tracking: Real-time calculation of Altitude and Azimuth for Sagittarius A*.Temporal Controls: Dual-slider system for "Day of Year" and "Time of Day" with high-frequency updates.Spatial Controls: Search-based location setting and coordinate input.Telemetry Readout: Precise numerical display of celestial coordinates and Bortle Scale ratings.Tactile UI: An industrial, skeuomorphic control deck optimized for desktop precision.Non-Functional Requirements (NFRs)Precision: Celestial calculations must align with standard astronomical ephemeris (within 0.1° accuracy).Performance: The 3D render loop must maintain 60 FPS during slider interaction.Responsiveness: Minimalist "Swiss" typography must remain legible at various screen scales.2. High-Level Design (HLD)The system follows a Unidirectional Data Flow architecture. The state acts as the "Single Source of Truth," driving both the 2D UI and the 3D WebGL/WebGPU context.System Architecture DiagramCode snippetgraph TD
    subgraph "UI Layer (DOM)"
        A[Search & Location Panel]
        B[Tactile Control Dock]
        C[Telemetry Sidebar]
    end

    subgraph "State Management"
        D[Zustand Store]
    end

    subgraph "Logic Engine (TypeScript)"
        E[Astrometry Engine]
        F[GIS / Light Pollution Processor]
    end

    subgraph "Visual Engine (Three.js)"
        G[R3F Canvas]
        H[Celestial Dome]
        I[Ground Plane/Grid]
    end

    %% Flow
    B -->|Update Time/Day| D
    A -->|Update Lat/Lng| D
    D -->|State Subscription| E
    E -->|Calculated Coords| H
    D -->|Coord Update| F
    F -->|Bortle Data| C
    H -->|Position Data| C
Tech StackFramework: Next.js 15 (App Router).3D Library: React Three Fiber (R3F) + Three.js.Math: astronomy-engine (VSOP87 implementation).State: Zustand (Atomic state management).Styling: Tailwind CSS (Modern Swiss aesthetics).3. Low-Level Design (LLD)A. State Schema (Zustand)The store is designed to minimize re-renders by allowing components to subscribe only to specific slices of data.TypeScriptinterface VyomaState {
  // Inputs
  viewDate: Date;
  location: { lat: number; lng: number; label: string };
  
  // Computed (Read-only for UI)
  coreCoords: { alt: number; az: number };
  bortleValue: number;

  // Setters
  updateTime: (hours: number) => void;
  updateDate: (dayOfYear: number) => void;
  updateLocation: (lat: number, lng: number, label: string) => void;
}
B. The Astrometry Hook (useAstrometry)This hook acts as the bridge between the temporal state and the 3D objects.Input: viewDate, location.Process:Convert viewDate to UTC.Instantiate Astronomy.Observer(lat, lng, elevation).Calculate Horizon coordinates for RA: 17.76h, Dec: -29.00°.Output: Returns altitude and azimuth.C. Component Breakdown1. <CelestialDome/> (3D)Logic: Uses useFrame (the R3F render loop).Representation:Milky Way Band: A custom TorusGeometry or TubeGeometry mapped to a semi-transparent noise texture.The Core: A SphereGeometry with a MeshBasicMaterial (Emissive) at the calculated Alt/Az vector.Math: Conversion from Spherical $(Alt, Az)$ to Cartesian $(X, Y, Z)$ using:$x = r \cdot \cos(alt) \cdot \sin(az)$$y = r \cdot \sin(alt)$$z = r \cdot \cos(alt) \cdot \cos(az)$2. <ControlDock/> (UI)Style: Industrial Skeuomorphism.Elements:Day Slider: Range 1-365.Time Slider: Range 0-24 (Step 0.01 for smooth "scrubbing").Visuals: Deep charcoal backgrounds (#121212), knurled textures, and amber LED-style text for the time readout.3. <TelemetrySidebar/> (UI)Style: Modern Swiss.Elements:Large, bold coordinate readouts (Helvetica/Inter).Real-time "Dark Sky" status (e.g., "BORTLE 2 - EXCELLENT").Location breadcrumbs.D. Location Search LogicIntegration with a Geocoding API (e.g., Mapbox or OpenStreetMap).On selection, the camera in the 3D scene smoothly interpolates (pans) to the new "Ground Plane" coordinates.
