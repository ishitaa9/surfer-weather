import { Wind, Droplets, Sun, Award } from "lucide-react";
import { scoreColorClass, scoreLabel } from "../lib/surf";

function codeToEmoji(wmo?: number) {
  const map: Record<string, string> = {
    "0": "☀️","1": "🌤️","2": "⛅","3": "☁️","45": "🌫️","48": "🌫️",
    "51": "🌦️","53": "🌦️","55": "🌧️","61": "🌧️","63": "🌧️","65": "🌧️",
    "71": "🌨️","73": "🌨️","75": "❄️","80": "🌧️","81": "🌧️","82": "⛈️",
    "95": "⛈️","96": "⛈️","99": "⛈️",
  };
  return map[String(wmo ?? "")] ?? "❓";
}

export default function DayCard(props: {
  date: string;
  wmo?: number;
  tmax?: number;
  tmin?: number;
  rain?: number;
  wind?: number;
  waveH?: number | null;
  waveP?: number | null;
  score?: number | null;
  isBest?: boolean;
}) {
  const d = new Date(props.date + "T00:00:00");
  const nice = d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });

  return (
    <div className="rounded-2xl p-4 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-70">{nice}</div>
        <div className="flex items-center gap-2">
          {props.isBest && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Award className="w-3 h-3" /> Best day
            </span>
          )}
          <div className="text-2xl" title={`WMO ${props.wmo}`}>{codeToEmoji(props.wmo)}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2"><Sun className="w-4 h-4"/><b>Temp</b>: {Math.round(props.tmax ?? NaN)}° / {Math.round(props.tmin ?? NaN)}°</div>
        <div className="flex items-center gap-2"><Droplets className="w-4 h-4"/><b>Regen</b>: {Math.round(props.rain ?? 0)} mm</div>
        <div className="flex items-center gap-2"><Wind className="w-4 h-4"/><b>Wind</b>: {Math.round(props.wind ?? 0)} km/h</div>
        <div className="flex items-center gap-2"><b>Welle</b>: {props.waveH != null ? `${props.waveH.toFixed(1)} m` : "—"}</div>
        <div className="flex items-center gap-2"><b>Periode</b>: {props.waveP != null ? `${Math.round(props.waveP)} s` : "—"}</div>
      </div>

      {/* Surf-score bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs opacity-70 mb-1">
          <span>Surf-Score</span>
          <span>{props.score != null ? `${props.score}/100 • ${scoreLabel(props.score)}` : "—"}</span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${props.score != null ? scoreColorClass(props.score) : "bg-zinc-400"}`}
            style={{ width: `${props.score ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
