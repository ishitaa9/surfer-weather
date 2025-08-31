// All inputs are optional; returns null if insufficient data.
export function surfScore({
  waveHeight, // meters
  period,     // seconds
  wind,       // km/h (max daily)
}: { waveHeight?: number | null; period?: number | null; wind?: number | null }) {
  if (waveHeight == null || period == null) return null;
  const safeWind = Number.isFinite(wind ?? NaN) ? (wind as number) : 10;
  const raw = waveHeight * 30 + period * 2 - safeWind * 0.8; // ~0..100ish
  const clamped = Math.max(0, Math.min(100, Math.round(raw)));
  return clamped;
}

export function scoreColorClass(score: number) {
  // simple gradient ramp
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-lime-500";
  if (score >= 30) return "bg-yellow-500";
  if (score >= 15) return "bg-orange-500";
  return "bg-red-500";
}

export function scoreLabel(score: number | null) {
  if (score == null) return "—";
  if (score >= 80) return "Epic";
  if (score >= 60) return "Good";
  if (score >= 40) return "Okay";
  if (score >= 20) return "Poor";
  return "Flat/Blown";
}
