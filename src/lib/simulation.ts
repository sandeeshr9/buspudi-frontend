import type { BusState, LiveBus, OccupancyLevel, Route, Stop } from "@/types";
import { ROUTES, ROUTE_MAP } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { VEHICLES, VEHICLE_MAP } from "@/data/vehicles";
import { buildPolyline, pointAlong, type Polyline } from "./geo";
import { clamp, seeded } from "./utils";

/**
 * Simulation engine for DEMO bus movement.
 * Nothing here reflects real operator positions. Movement is time-accelerated
 * so changes are visible on the map during a demo.
 */
export const SIM_SPEEDUP = 8;
export const SIM_TICK_MS = 1000;

/** Vehicles shown as parked / not in service in the demo. */
export const INACTIVE_VEHICLES = new Set(["mtc-21g-4", "mtc-570-3", "tnstc-76c-2", "mtc-88-3"]);

const polyCache = new Map<string, Polyline>();
export function routeStops(route: Route): Stop[] {
  return route.stopIds.map((id) => STOP_MAP[id]);
}
export function routePolyline(routeId: string): Polyline {
  let pl = polyCache.get(routeId);
  if (!pl) {
    pl = buildPolyline(routeStops(ROUTE_MAP[routeId]));
    polyCache.set(routeId, pl);
  }
  return pl;
}

export function occupancyLevel(pct: number): OccupancyLevel {
  if (pct < 45) return "available";
  if (pct < 75) return "moderate";
  if (pct < 97) return "crowded";
  return "full";
}

export function initialStates(seed = Date.now()): BusState[] {
  const rnd = seeded(Math.floor(seed / 60000));
  const now = Date.now();
  return VEHICLES.map((v) => {
    const route = ROUTE_MAP[v.routeId];
    const pl = routePolyline(route.id);
    const inactive = INACTIVE_VEHICLES.has(v.id);
    const delayed = !inactive && rnd() < 0.18;
    return {
      vehicleId: v.id,
      routeId: route.id,
      progressKm: inactive ? 0 : rnd() * pl.total,
      direction: rnd() < 0.5 ? 1 : -1,
      speedKmph: route.avgSpeedKmph * (0.8 + rnd() * 0.4),
      status: inactive ? "not-in-service" : delayed ? "delayed" : "running",
      delayMins: delayed ? Math.round(5 + rnd() * 18) : 0,
      occupancyPct: inactive ? 0 : Math.round(15 + rnd() * 85),
      lastUpdated: now - Math.round(rnd() * 20000),
      reportEvery: 1 + Math.floor(rnd() * 3),
    } satisfies BusState;
  });
}

export function stepStates(states: BusState[], tick: number, now = Date.now()): BusState[] {
  const rnd = seeded(tick * 7919 + 13);
  return states.map((s) => {
    if (s.status === "not-in-service") return s;
    const reports = tick % (s.reportEvery ?? 1) === 0;
    if (s.dwellUntil && s.dwellUntil > now) {
      return reports ? { ...s, status: s.delayMins > 0 ? "delayed" : "at-stop", lastUpdated: now } : s;
    }
    const pl = routePolyline(s.routeId);
    const dKm = (s.speedKmph * SIM_SPEEDUP * SIM_TICK_MS) / 3_600_000;
    let progress = s.progressKm + s.direction * dKm;
    let direction = s.direction;
    let dwellUntil: number | undefined;
    let occupancy = s.occupancyPct + (rnd() - 0.5) * 3;

    // Crossed a stop? dwell briefly and change occupancy.
    for (const c of pl.cum) {
      const crossed = direction === 1 ? s.progressKm < c && progress >= c : s.progressKm > c && progress <= c;
      if (crossed) {
        progress = c;
        dwellUntil = now + 3000 + rnd() * 3000;
        occupancy += (rnd() - 0.45) * 22;
        break;
      }
    }
    if (progress >= pl.total) {
      progress = pl.total; direction = -1; dwellUntil = now + 8000; occupancy = 20 + rnd() * 30;
    } else if (progress <= 0) {
      progress = 0; direction = 1; dwellUntil = now + 8000; occupancy = 20 + rnd() * 30;
    }
    // Delays drift slowly.
    let delay = s.delayMins;
    if (rnd() < 0.01) delay = Math.max(0, delay + (rnd() < 0.5 ? -2 : 3));
    const status = delay > 0 ? "delayed" : dwellUntil ? "at-stop" : "running";
    return {
      ...s,
      progressKm: progress,
      direction,
      dwellUntil,
      delayMins: delay,
      status,
      occupancyPct: Math.round(clamp(occupancy, 5, 100)),
      lastUpdated: reports ? now : s.lastUpdated,
    };
  });
}

export function resolveBus(state: BusState): LiveBus {
  const vehicle = VEHICLE_MAP[state.vehicleId];
  const route = ROUTE_MAP[state.routeId];
  const stops = routeStops(route);
  const pl = routePolyline(route.id);
  const forward = state.direction === 1;
  const tripStops = forward ? stops : [...stops].reverse();
  const tripCum = forward ? pl.cum : [...pl.cum].reverse().map((c) => pl.total - c);
  const t = forward ? state.progressKm : pl.total - state.progressKm;
  const { position, bearing } = pointAlong(pl, state.progressKm);
  let next = tripCum.findIndex((c) => c > t + 0.02);
  if (next === -1) next = tripStops.length - 1;
  const speed = Math.max(8, route.avgSpeedKmph);
  return {
    id: vehicle.id,
    vehicle,
    route,
    state,
    position,
    bearing: forward ? bearing : (bearing + 180) % 360,
    originStop: tripStops[0],
    destinationStop: tripStops[tripStops.length - 1],
    nextStop: tripStops[next],
    nextStopIndex: next,
    tripStops,
    remainingKm: pl.total - t,
    totalKm: pl.total,
    progressPct: pl.total ? (t / pl.total) * 100 : 0,
    etaNextStopMins: ((tripCum[next] - t) / speed) * 60,
    etaDestinationMins: ((pl.total - t) / speed) * 60,
    occupancy: occupancyLevel(state.occupancyPct),
  };
}

/** ETA (mins) from the bus's current position to each remaining stop in trip order. */
export function stopEtas(bus: LiveBus) {
  const pl = routePolyline(bus.route.id);
  const forward = bus.state.direction === 1;
  const tripCum = forward ? pl.cum : [...pl.cum].reverse().map((c) => pl.total - c);
  const t = bus.totalKm - bus.remainingKm;
  const speed = Math.max(8, bus.route.avgSpeedKmph);
  return bus.tripStops.map((stop, i) => ({
    stop,
    index: i,
    passed: i < bus.nextStopIndex,
    etaMins: Math.max(0, ((tripCum[i] - t) / speed) * 60),
    distanceKm: Math.max(0, tripCum[i] - t),
  }));
}

export const ALL_ROUTES = ROUTES;
