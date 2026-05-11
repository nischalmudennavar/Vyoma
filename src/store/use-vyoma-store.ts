import { create } from "zustand";
import { useShallow } from "zustand/shallow";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: string;
  cloudCover: number;
  pressure: number;
}

export interface PanelPosition {
  x: number;
  y: number;
}

interface VyomaState {
  viewDate: Date;
  location: { lat: number; lng: number; label: string };
  zoom: number;
  showMoon: boolean;
  uiOpacity: number;
  mapVisibility: number;
  baseFontSize: number;
  weather: WeatherData | null;
  panelPositions: Record<string, PanelPosition>;
  panelsLocked: boolean;
  updateTime: (hours: number, minutes: number) => void;
  updateDate: (date: Date) => void;
  updateLocation: (lat: number, lng: number, label?: string) => void;
  updateZoom: (zoom: number) => void;
  toggleMoon: () => void;
  setUiOpacity: (opacity: number) => void;
  setMapVisibility: (visibility: number) => void;
  setBaseFontSize: (size: number) => void;
  setWeather: (weather: WeatherData | null) => void;
  updatePanelPosition: (id: string, position: PanelPosition) => void;
  setPanelsLocked: (locked: boolean) => void;
}

export const useVyomaStore = create<VyomaState>((set) => ({
  viewDate: new Date(),
  location: { lat: 34.1526, lng: 77.5771, label: "Ladakh, India" }, // Default location: Ladakh
  zoom: 4,
  showMoon: true,
  uiOpacity: 80,
  mapVisibility: 100,
  baseFontSize: 14,
  weather: null,
  panelPositions: {},
  panelsLocked: false,
  updateTime: (hours, minutes) =>
    set((state) => {
      const newDate = new Date(state.viewDate);
      newDate.setHours(hours, minutes, 0, 0);
      return { viewDate: newDate };
    }),
  updateDate: (date) =>
    set((state) => {
      const newDate = new Date(state.viewDate);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return { viewDate: newDate };
    }),
  updateLocation: (lat, lng, label = "") =>
    set({ location: { lat, lng, label } }),
  updateZoom: (zoom) => set({ zoom }),
  toggleMoon: () => set((state) => ({ showMoon: !state.showMoon })),
  setUiOpacity: (opacity) => set({ uiOpacity: opacity }),
  setMapVisibility: (visibility) => set({ mapVisibility: visibility }),
  setBaseFontSize: (size) => set({ baseFontSize: size }),
  setWeather: (weather) => set({ weather }),
  updatePanelPosition: (id, position) =>
    set((state) => ({
      panelPositions: { ...state.panelPositions, [id]: position },
    })),
  setPanelsLocked: (locked) => set({ panelsLocked: locked }),
}));

/** Selector hook - only subscribes to the fields specified via key array. */
export function useVyomaSelector<K extends keyof VyomaState>(
  keys: K[],
): Pick<VyomaState, K> {
  return useVyomaStore(
    useShallow((state) => {
      const result: Pick<VyomaState, K> = {} as Pick<VyomaState, K>;
      for (const key of keys) {
        (result as Record<K, VyomaState[K]>)[key] = state[key];
      }
      return result;
    }),
  );
}
