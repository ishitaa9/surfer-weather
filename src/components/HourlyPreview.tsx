import { useMemo } from "react";
import type { HourlyWeather, HourlyMarine } from "../types";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function HourlyPreview({
  weather, marine,
}: { weather?: HourlyWeather; marine?: HourlyMarine }) {

  const windData = useMemo(() => {
    if (!weather?.time?.length) return [];
    return weather.time.map((iso, i) => ({
      time: new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      wind: weather.wind_speed_10m?.[i] ?? null,
      gust: weather.wind_gusts_10m?.[i] ?? null,
    }));
  }, [weather]);

  const waveData = useMemo(() => {
    if (!marine?.time?.length) return [];
    return marine.time.map((iso, i) => ({
      time: new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      wave: marine.wave_height?.[i] ?? null,
      period: marine.wave_period?.[i] ?? null,
    }));
  }, [marine]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl p-4 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="text-sm font-medium mb-2">Nächste 24h — Wind</div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={windData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" minTickGap={20} />
              <YAxis unit=" km/h" allowDecimals={false} />
              <Tooltip formatter={(v: any) => `${Math.round(Number(v))} km/h`} />
              <Line type="monotone" dataKey="wind" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="gust" dot={false} strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="text-sm font-medium mb-2">Nächste 24h — Wellen</div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" minTickGap={20} />
              <YAxis yAxisId="left" unit=" m" allowDecimals />
              <YAxis yAxisId="right" orientation="right" unit=" s" allowDecimals />
              <Tooltip formatter={(v: any, name: string) => (name === "period" ? `${v} s` : `${v} m`)} />
              <Area yAxisId="left" type="monotone" dataKey="wave" strokeWidth={2} fillOpacity={0.2} />
              <Line yAxisId="right" type="monotone" dataKey="period" dot={false} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
