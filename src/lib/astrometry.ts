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
