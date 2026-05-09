import {
  Equator,
  Horizon,
  MakeTime,
  Observer,
  SearchAltitude,
} from "astronomy-engine";

// Sagittarius A* Coordinates
const GALACTIC_CORE_RA = 17.76; // Hours (266.4 degrees)
const GALACTIC_CORE_DEC = -29.0; // Degrees

export interface CelestialCoordinates {
  alt: number;
  az: number;
  isAboveHorizon: boolean;
}

export interface TrajectoryPoint extends CelestialCoordinates {
  time: Date;
}

export function getGalacticCorePosition(
  date: Date,
  lat: number,
  lng: number,
): CelestialCoordinates {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);

  // The Galactic Core's RA is 17.76h. astronomy-engine Horizon expects RA in hours.
  // dec is in degrees.
  const horizon = Horizon(
    time,
    observer,
    GALACTIC_CORE_RA,
    GALACTIC_CORE_DEC,
    "normal",
  );

  return {
    alt: horizon.altitude,
    az: horizon.azimuth,
    isAboveHorizon: horizon.altitude >= 0,
  };
}

export function getSunPosition(
  date: Date,
  lat: number,
  lng: number,
): CelestialCoordinates {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);
  const eq = Equator("Sun", time, observer, true, true);
  const horizon = Horizon(time, observer, eq.ra, eq.dec, "normal");

  return {
    alt: horizon.altitude,
    az: horizon.azimuth,
    isAboveHorizon: horizon.altitude >= 0,
  };
}

export function getMoonPosition(
  date: Date,
  lat: number,
  lng: number,
): CelestialCoordinates {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);
  const eq = Equator("Moon", time, observer, true, true);
  const horizon = Horizon(time, observer, eq.ra, eq.dec, "normal");

  return {
    alt: horizon.altitude,
    az: horizon.azimuth,
    isAboveHorizon: horizon.altitude >= 0,
  };
}

function generateTrajectory(
  date: Date,
  lat: number,
  lng: number,
  positionFn: (d: Date, lat: number, lng: number) => CelestialCoordinates,
  durationHours = 24,
): TrajectoryPoint[] {
  const trajectory: TrajectoryPoint[] = [];
  const baseDate = new Date(date);

  // Start of the currently selected day
  baseDate.setHours(0, 0, 0, 0);

  // Calculate position every 15 minutes
  const totalPoints = (durationHours * 60) / 15;
  for (let i = 0; i <= totalPoints; i++) {
    const timePoint = new Date(baseDate.getTime() + i * 15 * 60 * 1000);
    const pos = positionFn(timePoint, lat, lng);
    trajectory.push({ ...pos, time: timePoint });
  }

  return trajectory;
}

export function getGalacticCoreTrajectory(
  date: Date,
  lat: number,
  lng: number,
  durationHours = 24,
) {
  return generateTrajectory(
    date,
    lat,
    lng,
    getGalacticCorePosition,
    durationHours,
  );
}

export function getSunTrajectory(
  date: Date,
  lat: number,
  lng: number,
  durationHours = 24,
) {
  return generateTrajectory(date, lat, lng, getSunPosition, durationHours);
}

export function getMoonTrajectory(
  date: Date,
  lat: number,
  lng: number,
  durationHours = 24,
) {
  return generateTrajectory(date, lat, lng, getMoonPosition, durationHours);
}

export interface TwilightPhases {
  sunrise: Date | null;
  sunset: Date | null;
  civilDawn: Date | null;
  civilDusk: Date | null;
  nauticalDawn: Date | null;
  nauticalDusk: Date | null;
  astronomicalDawn: Date | null;
  astronomicalDusk: Date | null;
}

export function getTwilightPhases(
  date: Date,
  lat: number,
  lng: number,
): TwilightPhases {
  const observer = new Observer(lat, lng, 0);
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0); // Start of day
  const time = MakeTime(baseDate);

  const search = (direction: number, altitude: number) => {
    const res = SearchAltitude("Sun", observer, direction, time, 1, altitude);
    return res ? res.date : null;
  };

  return {
    astronomicalDawn: search(1, -18),
    nauticalDawn: search(1, -12),
    civilDawn: search(1, -6),
    sunrise: search(1, 0),
    sunset: search(-1, 0),
    civilDusk: search(-1, -6),
    nauticalDusk: search(-1, -12),
    astronomicalDusk: search(-1, -18),
  };
}

export function getMoonRiseSet(
  date: Date,
  lat: number,
  lng: number,
): { rise: Date | null; set: Date | null } {
  const observer = new Observer(lat, lng, 0);
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  const time = MakeTime(baseDate);

  const rise = SearchAltitude("Moon", observer, 1, time, 1, 0);
  const set = SearchAltitude("Moon", observer, -1, time, 1, 0);

  return {
    rise: rise ? rise.date : null,
    set: set ? set.date : null,
  };
}

export function getGalacticCoreVisibility(
  date: Date,
  lat: number,
  lng: number,
): { rise: Date | null; set: Date | null } {
  // astronomy-engine doesn't have a named "GalacticCore" for SearchAltitude,
  // but we can use SearchAltitude with a custom function if needed,
  // or just approximate from the trajectory if it's too complex.
  // Actually, SearchAltitude only takes body names.
  // We can use Search for a fixed point by creating a custom search or using trajectory.
  // For now, let's use the trajectory to find transitions as it's already implemented.
  const traj = getGalacticCoreTrajectory(date, lat, lng);
  let rise: Date | null = null;
  let set: Date | null = null;

  for (let i = 0; i < traj.length - 1; i++) {
    if (traj[i].alt < 0 && traj[i + 1].alt >= 0) {
      rise = traj[i + 1].time;
    } else if (traj[i].alt >= 0 && traj[i + 1].alt < 0) {
      set = traj[i + 1].time;
    }
  }

  return { rise, set };
}

import { MoonPhase } from "astronomy-engine";

export function getMoonPhase(date: Date): { phase: number; name: string } {
  const time = MakeTime(date);
  const phase = MoonPhase(time);

  let name = "";
  if (phase < 1.0 || phase > 359.0) name = "New Moon";
  else if (phase < 89.0) name = "Waxing Crescent";
  else if (phase < 91.0) name = "First Quarter";
  else if (phase < 179.0) name = "Waxing Gibbous";
  else if (phase < 181.0) name = "Full Moon";
  else if (phase < 269.0) name = "Waning Gibbous";
  else if (phase < 271.0) name = "Last Quarter";
  else name = "Waning Crescent";

  return { phase, name };
}
