const geocodeCache = new Map<string, string>();

/**
 * Performs reverse geocoding with a simple in-memory cache.
 */
export async function getReverseGeocode(
  lat: number,
  lng: number,
): Promise<string> {
  const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`; // ~110m precision
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "Vyoma/1.0", // Nominatim requires a user-agent
        },
      },
    );
    const data = await res.json();
    const result = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    geocodeCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("[Geocoding] Reverse geocoding failed:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
