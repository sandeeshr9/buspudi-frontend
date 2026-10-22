import type { Stop } from "@/types";

const R = 6371;
const toRad = (d: number) => (d * Math.PI) / 180;
/** Straight-line distances are multiplied by this to approximate road distance. */
export const ROAD_FACTOR = 1.25;

export function haversineKm(a: [number, number], b: [number, number]) {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function bearing(a: [number, number], b: [number, number]) {
  const y = Math.sin(toRad(b[1] - a[1])) * Math.cos(toRad(b[0]));
  const x = Math.cos(toRad(a[0])) * Math.sin(toRad(b[0])) - Math.sin(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.cos(toRad(b[1] - a[1]));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export interface Polyline {
  points: [number, number][];
  /** cumulative road km at each point */
  cum: number[];
  total: number;
}

export function buildPolyline(stops: Stop[]): Polyline {
  const points = stops.map((s) => [s.lat, s.lng] as [number, number]);
  const cum = [0];
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + haversineKm(points[i - 1], points[i]) * ROAD_FACTOR);
  return { points, cum, total: cum[cum.length - 1] };
}

/** Position + bearing + segment index at a given distance along the polyline. */
export function pointAlong(pl: Polyline, km: number) {
  const d = Math.max(0, Math.min(pl.total, km));
  let i = 1;
  while (i < pl.cum.length - 1 && pl.cum[i] < d) i++;
  const a = pl.points[i - 1];
  const b = pl.points[i];
  const seg = pl.cum[i] - pl.cum[i - 1] || 1;
  const t = (d - pl.cum[i - 1]) / seg;
  return {
    position: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as [number, number],
    bearing: bearing(a, b),
    segment: i - 1,
  };
}

export function nearestStops(stops: Stop[], from: [number, number], limit = 5) {
  return stops
    .map((s) => ({ stop: s, km: haversineKm(from, [s.lat, s.lng]) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
