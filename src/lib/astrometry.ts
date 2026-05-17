import {
  Body,
  Equator,
  Horizon,
  Libration,
  MakeTime,
  MoonPhase,
  Observer,
  SearchAltitude,
} from "astronomy-engine";

// Constants
const GALACTIC_CORE_RA = 17.76; // Hours (266.4 degrees)
const GALACTIC_CORE_DEC = -29.0; // Degrees
const SUN_RADIUS_KM = 695700;
const AU_TO_KM = 149597870.7;

export interface CelestialCoordinates {
  alt: number;
  az: number;
  isAboveHorizon: boolean;
}

export interface TrajectoryPoint extends CelestialCoordinates {
  time: Date;
}

/**
 * Calculates the current position of the Galactic Core.
 */
export function getGalacticCorePosition(
  date: Date,
  lat: number,
  lng: number,
): CelestialCoordinates {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);

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

/**
 * Calculates the current position of the Sun.
 */
export function getSunPosition(
  date: Date,
  lat: number,
  lng: number,
): CelestialCoordinates {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);
  const eq = Equator(Body.Sun, time, observer, true, true);
  const horizon = Horizon(time, observer, eq.ra, eq.dec, "normal");

  return {
    alt: horizon.altitude,
    az: horizon.azimuth,
    isAboveHorizon: horizon.altitude >= 0,
  };
}

/**
 * Calculates the current position of the Moon.
 */
export function getMoonPosition(
  date: Date,
  lat: number,
  lng: number,
): CelestialCoordinates {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);
  const eq = Equator(Body.Moon, time, observer, true, true);
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
  baseDate.setHours(0, 0, 0, 0);
  const time = MakeTime(baseDate);

  const search = (direction: number, altitude: number) => {
    const res = SearchAltitude(
      Body.Sun,
      observer,
      direction,
      time,
      1,
      altitude,
    );
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

  const rise = SearchAltitude(Body.Moon, observer, 1, time, 1, 0);
  const set = SearchAltitude(Body.Moon, observer, -1, time, 1, 0);

  return {
    rise: rise ? rise.date : null,
    set: set ? set.date : null,
  };
}

/**
 * Calculates the azimuth of a body at the moment of rise and set.
 */
export function getRiseSetAzimuths(
  date: Date,
  lat: number,
  lng: number,
  body: "sun" | "moon",
) {
  if (body === "sun") {
    const phases = getTwilightPhases(date, lat, lng);
    return {
      rise: phases.sunrise ? getSunPosition(phases.sunrise, lat, lng).az : null,
      set: phases.sunset ? getSunPosition(phases.sunset, lat, lng).az : null,
    };
  } else {
    const rs = getMoonRiseSet(date, lat, lng);
    return {
      rise: rs.rise ? getMoonPosition(rs.rise, lat, lng).az : null,
      set: rs.set ? getMoonPosition(rs.set, lat, lng).az : null,
    };
  }
}

export function getGalacticCoreVisibility(
  date: Date,
  lat: number,
  lng: number,
): { rise: Date | null; set: Date | null } {
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

export function getMoonPhase(date: Date): {
  phase: number;
  name: string;
  illumination: number;
} {
  const time = MakeTime(date);
  const phase = MoonPhase(time);

  // Illumination calculation based on phase angle
  const illumination = ((1 - Math.cos((phase * Math.PI) / 180)) / 2) * 100;

  let name = "";
  if (phase < 1.0 || phase > 359.0) name = "New Moon";
  else if (phase < 89.0) name = "Waxing Crescent";
  else if (phase < 91.0) name = "First Quarter";
  else if (phase < 179.0) name = "Waxing Gibbous";
  else if (phase < 181.0) name = "Full Moon";
  else if (phase < 269.0) name = "Waning Gibbous";
  else if (phase < 271.0) name = "Last Quarter";
  else name = "Waning Crescent";

  return { phase, name, illumination };
}

/**
 * Calculates Golden Hour (when Sun altitude is between -4 and 6 degrees).
 */
export function getGoldenHour(
  date: Date,
  lat: number,
  lng: number,
): {
  morning: { start: Date | null; end: Date | null };
  evening: { start: Date | null; end: Date | null };
} {
  const observer = new Observer(lat, lng, 0);
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  const time = MakeTime(baseDate);

  const search = (direction: number, altitude: number) => {
    const res = SearchAltitude(
      Body.Sun,
      observer,
      direction,
      time,
      1,
      altitude,
    );
    return res ? res.date : null;
  };

  return {
    morning: {
      start: search(1, -4),
      end: search(1, 6),
    },
    evening: {
      start: search(-1, 6),
      end: search(-1, -4),
    },
  };
}

/**
 * Calculates Angular Diameter of a body.
 */
function calculateAngularDiameter(
  radiusKm: number,
  distanceKm: number,
): number {
  return 2 * Math.atan(radiusKm / distanceKm) * (180 / Math.PI);
}

export function getSunDetails(date: Date, lat: number, lng: number) {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);
  // Using Equator for Sun with the observer to get topocentric distance
  const eq = Equator(Body.Sun, time, observer, true, true);
  const distanceAU = eq.dist;
  const distanceKm = distanceAU * AU_TO_KM;
  const angularDiameter = calculateAngularDiameter(SUN_RADIUS_KM, distanceKm);

  return {
    distanceKm,
    angularDiameter,
  };
}

export function getMoonDetails(date: Date) {
  const time = MakeTime(date);
  // Libration gives distance in km and angular diameter in degrees directly
  const lib = Libration(time);

  return {
    distanceKm: lib.dist_km,
    angularDiameter: lib.diam_deg,
  };
}
