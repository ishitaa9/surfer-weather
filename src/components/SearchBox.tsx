import { useEffect, useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import type { GeoPlace } from "../types";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { searchPlacesDE } from "../lib/openMeteo";

export default function SearchBox({ onPick }: { onPick: (p: GeoPlace) => void }) {
  const [q, setQ] = useState("");
  const deb = useDebouncedValue(q, 350);
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setError(null);
      if (!deb || deb.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const out = await searchPlacesDE(deb);
        if (alive) setResults(out);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Search failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [deb]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
        <Search className="w-5 h-5 opacity-60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Spot in Deutschland suchen (z. B. Sylt, Norderney, Kiel…)"
          className="bg-transparent outline-none w-72 sm:w-96"
        />
        {loading ? <Loader2 className="w-4 h-4 animate-spin opacity-60" /> : null}
      </div>

      {(results.length > 0 || error) && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {error && <div className="px-3 py-2 text-sm text-red-600">{error}</div>}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-3"
            >
              <MapPin className="w-4 h-4 opacity-60" />
              <div>
                <div className="font-medium leading-tight">
                  {p.name}{p.admin1 ? <span className="opacity-70">, {p.admin1}</span> : null}
                </div>
                <div className="text-xs opacity-70">
                  {p.country} • {p.latitude.toFixed(3)}, {p.longitude.toFixed(3)}
                </div>
              </div>
            </button>
          ))}
          {results.length === 0 && !error && (
            <div className="px-3 py-2 text-sm opacity-70">Keine Treffer</div>
          )}
        </div>
      )}
    </div>
  );
}
