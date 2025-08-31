import { useEffect, useState } from "react";
import type { GeoPlace, WeatherResponse, MarineResponse } from "./types";
import SearchBox from "./components/SearchBox";
import DayCard from "./components/DayCard";
import { MapPin, Loader2 } from "lucide-react";
import { fetchWeather, fetchMarine } from "./lib/openMeteo";
import HourlyPreview from "./components/HourlyPreview";
import { surfScore } from "./lib/surf";

const DISPLAY_COUNT = 5;
const MIN_BEST_SCORE = 55; // only show "Best day" when score >= 55

export default function App() {
  const [picked, setPicked] = useState<GeoPlace | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [marine, setMarine] = useState<MarineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // when a place is picked, load data
  useEffect(() => {
    if (!picked) return;
    let alive = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const [w, m] = await Promise.all([
          fetchWeather(picked.latitude, picked.longitude),
          fetchMarine(picked.latitude, picked.longitude),
        ]);
        if (!alive) return;
        setWeather(w);
        setMarine(m);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Fehler beim Laden");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [picked]);

  // normalize & score
  const rawDays = (() => {
    const w = weather?.daily;
    const m = marine?.daily;
    if (!w?.time) return [];

    return w.time.map((date, i) => {
      // marine fallbacks to reduce blanks
      const waveH =
        m?.swell_wave_height_max?.[i] ??
        m?.wave_height_max?.[i] ??
        m?.wind_wave_height_max?.[i] ??
        null;

      const waveP =
        m?.swell_wave_period_max?.[i] ??
        m?.wave_period_max?.[i] ??
        m?.wind_wave_period_max?.[i] ??
        null;

      const day = {
        date,
        wmo: w.weather_code?.[i],
        tmax: w.temperature_2m_max?.[i],
        tmin: w.temperature_2m_min?.[i],
        rain: w.precipitation_sum?.[i],
        wind: w.wind_speed_10m_max?.[i],
        waveH,
        waveP,
      };

      const score = surfScore({ waveHeight: day.waveH, period: day.waveP, wind: day.wind });
      return { ...day, score };
    });
  })();

  // only consider first DISPLAY_COUNT days on screen
  const shown = rawDays.slice(0, DISPLAY_COUNT);

  // find best among shown; show badge only if threshold met
  let bestShownIndex = -1;
  let bestScore = -1;
  shown.forEach((d, i) => {
    if (typeof d.score === "number" && d.score > bestScore) {
      bestScore = d.score;
      bestShownIndex = i;
    }
  });
  if (bestScore < MIN_BEST_SCORE) bestShownIndex = -1;

  const days = shown.map((d, i) => ({
    ...d,
    isBest: i === bestShownIndex,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Surfer Weather</h1>
          <span className="text-xs opacity-60">search → pick → forecast</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <SearchBox onPick={setPicked} />

        {picked && (
          <div className="flex items-center gap-2 opacity-80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>
              {picked.name}
              {picked.admin1 ? `, ${picked.admin1}` : ""}
            </span>
            <span className="opacity-60">
              • {picked.latitude.toFixed(3)}, {picked.longitude.toFixed(3)}
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {!loading && days.length > 0 && (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {days.map((d) => (
              <DayCard key={d.date} {...d} />
            ))}
          </section>
        )}

        {!loading && days.length > 0 && (
          <div className="text-xs opacity-60 space-y-1">
            <p>Surf-Score: combines wave height, period, and wind (lower wind is better).</p>
            {days.every((d) => !d.isBest) && <p>No standout day this window — scores are low.</p>}
          </div>
        )}

        {!loading && (weather?.hourly || marine?.hourly) && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium opacity-80">24-Stunden Vorschau</h2>
            <HourlyPreview weather={weather?.hourly} marine={marine?.hourly} />
          </section>
        )}

        {!picked && (
          <p className="opacity-80">
            Tipp: Suche nach „Sylt“, „Norderney“, „Kiel“, „Warnemünde“…
          </p>
        )}

        {picked && !loading && days.length === 0 && (
          <p className="opacity-80">
            Keine Vorhersage verfügbar (Spot evtl. zu weit im Inland?).
          </p>
        )}

        <footer className="text-xs opacity-60">
          Daten: Open-Meteo Wetter + Marine API — Zeiten: {weather?.timezone ?? "lokal"}
        </footer>
      </main>
    </div>
  );
}
