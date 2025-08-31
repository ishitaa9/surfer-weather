export type GeoPlace = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
};

export type GeocodingResponse = {
  results?: GeoPlace[];
};

// --- Weather ---
export type DailyWeather = {
  time: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_sum?: number[];
  uv_index_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  wind_direction_10m_dominant?: number[];
};

export type HourlyWeather = {
  time: string[];
  wind_speed_10m?: number[];
  wind_gusts_10m?: number[];
};

export type WeatherResponse = {
  timezone: string;
  daily_units?: Record<string, string>;
  daily: DailyWeather;
  hourly?: HourlyWeather;
};

// --- Marine ---
export type DailyMarine = {
  time: string[];
  wave_height_max?: number[];
  wave_period_max?: number[];
  wave_direction_dominant?: number[];
  wind_wave_height_max?: number[];
  swell_wave_height_max?: number[];
};

export type HourlyMarine = {
  time: string[];
  wave_height?: number[];
  wave_period?: number[];
};

export type MarineResponse = {
  timezone: string;
  daily_units?: Record<string, string>;
  daily?: DailyMarine;
  hourly?: HourlyMarine;
};
