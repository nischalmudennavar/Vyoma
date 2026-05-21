import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: string;
  cloudCover: number;
  cloudCoverHigh: number;
  cloudCoverMid: number;
  cloudCoverLow: number;
  pressure: number;
  dewPoint: number;
  seeing: number; // 1-5
  transparency: number; // 1-5
  bortle: number; // 1-9
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
  lpOpacity: number;
  baseFontSize: number;
  weather: WeatherData | null;
  isWeatherLoading: boolean;
  bortle: number; // Single source of truth for Bortle class
  panelPositions: Record<string, PanelPosition>;
  panelsLocked: boolean;
  showSettings: boolean;
  showLightPollution: boolean;
  updateTime: (hours: number, minutes: number) => void;
  updateDate: (date: Date) => void;
  updateLocation: (lat: number, lng: number, label?: string) => void;
  updateZoom: (zoom: number) => void;
  toggleMoon: () => void;
  toggleLightPollution: () => void;
  setUiOpacity: (opacity: number) => void;
  setMapVisibility: (visibility: number) => void;
  setLpOpacity: (opacity: number) => void;
  setBaseFontSize: (size: number) => void;
  setWeather: (weather: WeatherData | null) => void;
  setWeatherLoading: (loading: boolean) => void;
  setBortle: (bortle: number) => void;
  updatePanelPosition: (id: string, position: PanelPosition) => void;
  setPanelsLocked: (locked: boolean) => void;
  toggleSettings: () => void;
}

export const useVyomaStore = create<VyomaState>()(
  subscribeWithSelector((set) => ({
    viewDate: new Date(),
    location: { lat: 34.1526, lng: 77.5771, label: "Ladakh, India" }, // Default location: Ladakh
    zoom: 4,
    showMoon: true,
    uiOpacity: 80,
    mapVisibility: 100,
    lpOpacity: 70,
    baseFontSize: 14,
    weather: null,
    isWeatherLoading: false,
    bortle: 1, // Default Bortle
    panelPositions: {},
    panelsLocked: false,
    showSettings: false,
    showLightPollution: false,
    updateTime: (hours, minutes) =>
      set((state) => {
        const newDate = new Date(state.viewDate);
        newDate.setHours(hours, minutes, 0, 0);
        return { viewDate: newDate };
      }),
    updateDate: (date) =>
      set((state) => {
        const newDate = new Date(state.viewDate);
        newDate.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        return { viewDate: newDate };
      }),
    updateLocation: (lat, lng, label = "") =>
      set({ location: { lat, lng, label } }),
    updateZoom: (zoom) => set({ zoom }),
    toggleMoon: () => set((state) => ({ showMoon: !state.showMoon })),
    toggleLightPollution: () =>
      set((state) => ({ showLightPollution: !state.showLightPollution })),
    setUiOpacity: (opacity) => set({ uiOpacity: opacity }),
    setMapVisibility: (visibility) => set({ mapVisibility: visibility }),
    setLpOpacity: (opacity) => set({ lpOpacity: opacity }),
    setBaseFontSize: (size) => set({ baseFontSize: size }),
    setWeather: (weather) => set({ weather }),
    setWeatherLoading: (loading) => set({ isWeatherLoading: loading }),
    setBortle: (bortle) => set({ bortle }),
    updatePanelPosition: (id, position) =>
      set((state) => ({
        panelPositions: { ...state.panelPositions, [id]: position },
      })),
    setPanelsLocked: (locked) => set({ panelsLocked: locked }),
    toggleSettings: () =>
      set((state) => ({ showSettings: !state.showSettings })),
  })),
);

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
