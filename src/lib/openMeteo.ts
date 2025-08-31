import type { GeocodingResponse, GeoPlace, WeatherResponse, MarineResponse } from "../types";

export async function searchPlacesDE(q: string): Promise<GeoPlace[]> {
  if (!q || q.trim().length < 2) return [];
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q.trim());
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "de");
  url.searchParams.set("countryCode", "DE");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Geocoding failed");
  const data: GeocodingResponse = await res.json();
  return data.results ?? [];
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("timezone", "Europe/Berlin");
  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "uv_index_max",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
    ].join(",")
  );
  url.searchParams.set("hourly", ["wind_speed_10m", "wind_gusts_10m"].join(","));
  url.searchParams.set("forecast_hours", "24");
  url.searchParams.set("wind_speed_unit", "kmh");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

export async function fetchMarine(lat: number, lon: number): Promise<MarineResponse> {
  const url = new URL("https://marine-api.open-meteo.com/v1/marine");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("timezone", "Europe/Berlin");
  url.searchParams.set("length_unit", "metric");
  url.searchParams.set("forecast_hours", "24");
  url.searchParams.set("cell_selection", "sea");
  url.searchParams.set(
    "daily",
    [
      "wave_height_max",
      "wave_period_max",
      "wave_direction_dominant",
      "swell_wave_height_max",
      "swell_wave_period_max",
      "swell_wave_direction_dominant",
      "wind_wave_height_max",
      "wind_wave_period_max",
    ].join(",")
  );
  url.searchParams.set("hourly", ["wave_height", "wave_period"].join(","));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Marine fetch failed");
  return res.json();
}
