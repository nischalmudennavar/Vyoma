import {
  getGalacticCorePosition,
  getGalacticCoreTrajectory,
  getGalacticCoreVisibility,
  getGoldenHour,
  getMoonDetails,
  getMoonFreeWindow,
  getMoonPhase,
  getMoonRiseSet,
  getMoonTrajectory,
  getSunDetails,
  getSunTrajectory,
  getTwilightPhases,
} from "./astrometry";

/**
 * Celestial Web Worker
 * Offloads astronomy-engine calculations to a background thread.
 */

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;
  const { date, lat, lng } = payload;
  const viewDate = new Date(date);

  try {
    let result: Record<string, unknown> | null = null;
    const { durationHours = 24 } = payload;

    switch (type) {
      case "CALCULATE_ALL":
        result = {
          gcPos: getGalacticCorePosition(viewDate, lat, lng),
          gcVis: getGalacticCoreVisibility(viewDate, lat, lng),
          sunPhases: getTwilightPhases(viewDate, lat, lng),
          moonRiseSet: getMoonRiseSet(viewDate, lat, lng),
          moonFreeWindow: getMoonFreeWindow(viewDate, lat, lng),
          goldenHour: getGoldenHour(viewDate, lat, lng),
          sunDetails: getSunDetails(viewDate, lat, lng),
          moonDetails: getMoonDetails(viewDate),
          moonPhase: getMoonPhase(viewDate),
        };
        break;

      case "CALCULATE_TRAJECTORIES":
        result = {
          gcTrajectory: getGalacticCoreTrajectory(
            viewDate,
            lat,
            lng,
            durationHours,
          ),
          sunTrajectory: getSunTrajectory(viewDate, lat, lng, durationHours),
          moonTrajectory: getMoonTrajectory(viewDate, lat, lng, durationHours),
        };
        break;

      case "CALCULATE_EPHEMERIS": {
        // This is a specialized call for the EphemerisOverlay
        // It starts 24 hours before the viewDate for the trajectory buffer
        const bufferStartDate = new Date(viewDate);
        bufferStartDate.setHours(0, 0, 0, 0);
        bufferStartDate.setDate(bufferStartDate.getDate() - 1);

        result = {
          trajectories: {
            gc: getGalacticCoreTrajectory(bufferStartDate, lat, lng, 72),
            sun: getSunTrajectory(bufferStartDate, lat, lng, 72),
            moon: getMoonTrajectory(bufferStartDate, lat, lng, 72),
          },
          twilightPhases: getTwilightPhases(viewDate, lat, lng),
        };
        break;
      }

      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }

    self.postMessage({ type: `${type}_SUCCESS`, payload: result });
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      payload: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
