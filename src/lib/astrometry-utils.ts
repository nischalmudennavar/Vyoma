/**
 * Returns the appropriate moon emoji for a given phase angle (0-360).
 * Phase angles: 0 (New), 90 (First Quarter), 180 (Full), 270 (Last Quarter).
 */
export function getMoonIcon(phaseAngle: number): string {
  if (phaseAngle < 22.5 || phaseAngle >= 337.5) return "🌑";
  if (phaseAngle < 67.5) return "🌒";
  if (phaseAngle < 112.5) return "🌓";
  if (phaseAngle < 157.5) return "🌔";
  if (phaseAngle < 202.5) return "🌕";
  if (phaseAngle < 247.5) return "🌖";
  if (phaseAngle < 292.5) return "🌗";
  return "🌘";
}

/**
 * Converts an azimuth angle (0-360) to a cardinal direction string (e.g., N, NE, E).
 */
export function getCardinalDirection(azimuth: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  // 360 / 16 = 22.5 degrees per sector
  const index = Math.floor((azimuth + 11.25) / 22.5) % 16;
  return directions[index];
}

/**
 * Formats a date to HH:mm string.
 * @param date - The date to format.
 * @returns Formatted time string or --:-- if null.
 */
export function formatTime(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
