import { create } from "zustand";

interface VyomaState {
  viewDate: Date;
  location: { lat: number; lng: number; label: string };
  updateTime: (hours: number, minutes: number) => void;
  updateDate: (date: Date) => void;
  updateLocation: (lat: number, lng: number, label?: string) => void;
}

export const useVyomaStore = create<VyomaState>((set) => ({
  viewDate: new Date(),
  location: { lat: 34.1526, lng: 77.5771, label: "Ladakh, India" }, // Default location: Ladakh
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
}));
