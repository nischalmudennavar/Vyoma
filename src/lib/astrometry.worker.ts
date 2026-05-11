import {
  getGalacticCorePosition,
  getGalacticCoreTrajectory,
  getSunPosition,
  getSunTrajectory,
  getMoonPosition,
  getMoonTrajectory,
  getTwilightPhases,
  getMoonRiseSet,
  getMoonPhase,
  getGoldenHour,
  getSunDetails,
  getMoonDetails,
  getGalacticCoreVisibility,
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
    let result;

    switch (type) {
      case "CALCULATE_ALL":
        result = {
          gcPos: getGalacticCorePosition(viewDate, lat, lng),
          gcVis: getGalacticCoreVisibility(viewDate, lat, lng),
          sunPhases: getTwilightPhases(viewDate, lat, lng),
          moonRiseSet: getMoonRiseSet(viewDate, lat, lng),
          goldenHour: getGoldenHour(viewDate, lat, lng),
          sunDetails: getSunDetails(viewDate, lat, lng),
          moonDetails: getMoonDetails(viewDate),
          moonPhase: getMoonPhase(viewDate),
        };
        break;
      
      case "CALCULATE_TRAJECTORIES":
        result = {
          gcTrajectory: getGalacticCoreTrajectory(viewDate, lat, lng),
          sunTrajectory: getSunTrajectory(viewDate, lat, lng),
          moonTrajectory: getMoonTrajectory(viewDate, lat, lng),
        };
        break;

      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }

    self.postMessage({ type: `${type}_SUCCESS`, payload: result });
  } catch (error) {
    self.postMessage({ 
      type: "ERROR", 
      payload: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};
