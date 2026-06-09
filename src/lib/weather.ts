import type { WeatherData } from "@/store/use-vyoma-store";

/**
 * Maps WMO Weather interpretation codes to human-readable strings.
 */
export function getWeatherCondition(code: number): string {
  const mapping: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return mapping[code] || "Unknown";
}

const weatherCache = new Map<
  string,
  { data: WeatherData; timestamp: number }
>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchWeather(
  lat: number,
  lng: number,
): Promise<WeatherData | null> {
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather fetch failed");

    const data = await response.json();
    const current = data.current;

    const temp = current.temperature_2m;
    const humid = current.relative_humidity_2m;
    const wind = current.wind_speed_10m;
    const cloud = current.cloud_cover;
    const pressure = current.pressure_msl;

    // Dew Point calculation (Magnus-Tetens approximation)
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * temp) / (b + temp) + Math.log(humid / 100);
    const dewPoint = (b * alpha) / (a - alpha);

    // Transparency Index (1-5)
    let transparency = 1;
    if (humid < 40 && cloud < 10) transparency = 5;
    else if (humid < 60 && cloud < 20) transparency = 4;
    else if (humid < 80 && cloud < 40) transparency = 3;
    else if (humid < 90 && cloud < 70) transparency = 2;

    // Seeing Index (1-5)
    let seeing = 1;
    if (wind < 5 && pressure > 1013) seeing = 5;
    else if (wind < 15 && pressure > 1005) seeing = 4;
    else if (wind < 30) seeing = 3;
    else if (wind < 50) seeing = 2;

    const result: WeatherData = {
      temperature: temp,
      humidity: humid,
      windSpeed: wind,
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      condition: getWeatherCondition(current.weather_code),
      cloudCover: cloud,
      cloudCoverLow: current.cloud_cover_low,
      cloudCoverMid: current.cloud_cover_mid,
      cloudCoverHigh: current.cloud_cover_high,
      pressure: pressure,
      dewPoint,
      seeing,
      transparency,
      bortle: 1, // Placeholder, updated via lookup
    };

    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
