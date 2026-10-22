import type { Journey, JourneyLeg, Route } from "@/types";
import { ROUTES, ROUTE_MAP } from "@/data/routes";
import { routePolyline } from "./simulation";
import { parseHHMM } from "./time";

/**
 * A small local journey planner over the DEMO network.
 * Finds direct, 1-transfer and 2-transfer options. Timetables are derived from
 * each route's first departure + frequency, so results are illustrative only.
 */
const TRANSFER_MINS = 8;

interface Seg { route: Route; from: number; to: number }

/** Segment of a route between two stop indices (either direction). */
function segment(route: Route, fromId: string, toId: string): Seg | null {
  const a = route.stopIds.indexOf(fromId);
  const b = route.stopIds.indexOf(toId);
  if (a === -1 || b === -1 || a === b) return null;
  return { route, from: a, to: b };
}

function segKm(s: Seg) {
  const pl = routePolyline(s.route.id);
  return Math.abs(pl.cum[s.to] - pl.cum[s.from]);
}

function segStops(s: Seg) {
  const ids = s.route.stopIds;
  return s.from < s.to ? ids.slice(s.from, s.to + 1) : ids.slice(s.to, s.from + 1).reverse();
}

/** Next departure of the route from the segment's boarding stop at/after `t`. */
function nextDeparture(s: Seg, t: number) {
  const r = s.route;
  const pl = routePolyline(r.id);
  // minutes from the trip origin to the boarding stop
  const offset = (s.from < s.to ? pl.cum[s.from] : pl.total - pl.cum[s.from]) / r.avgSpeedKmph * 60;
  // Demo timetables run around the clock (matching the always-on simulation);
  // firstDeparture only anchors the phase of the repeating pattern.
  const anchor = parseHHMM(r.firstDeparture, new Date(t)) + offset * 60000;
  const f = r.frequencyMins * 60000;
  return anchor + Math.ceil((t - anchor) / f) * f;
}

function buildLeg(s: Seg, readyAt: number): JourneyLeg {
  const dep = nextDeparture(s, readyAt);
  const km = segKm(s);
  const travel = (km / s.route.avgSpeedKmph) * 60;
  const stopIds = segStops(s);
  return {
    routeId: s.route.id,
    fromStopId: stopIds[0],
    toStopId: stopIds[stopIds.length - 1],
    stopIds,
    departAt: dep,
    arriveAt: dep + (travel + (stopIds.length - 1) * 0.6) * 60000,
    distanceKm: km,
    waitMins: Math.max(0, (dep - readyAt) / 60000),
  };
}

function assemble(fromId: string, toId: string, segs: Seg[], departAt: number): Journey {
  const legs: JourneyLeg[] = [];
  let t = departAt;
  for (const s of segs) {
    const leg = buildLeg(s, t);
    legs.push(leg);
    t = leg.arriveAt + TRANSFER_MINS * 60000;
  }
  const first = legs[0];
  const last = legs[legs.length - 1];
  const fare = legs.reduce<[number, number]>((acc, l) => {
    const r = ROUTE_MAP[l.routeId];
    const pl = routePolyline(r.id);
    const ratio = Math.min(1, l.distanceKm / pl.total + 0.15);
    return [acc[0] + Math.max(r.fareRange[0], Math.round(r.fareRange[1] * ratio * 0.6)), acc[1] + Math.round(r.fareRange[1] * ratio)];
  }, [0, 0]);
  const intercity = legs.some((l) => ROUTE_MAP[l.routeId].intercity);
  return {
    id: `${fromId}-${toId}-${segs.map((s) => s.route.id).join("+")}-${segs.map((s) => s.route.stopIds[s.to]).join("+")}`,
    fromStopId: fromId,
    toStopId: toId,
    legs,
    departAt: first.departAt,
    arriveAt: last.arriveAt,
    durationMins: (last.arriveAt - first.departAt) / 60000,
    transfers: legs.length - 1,
    distanceKm: legs.reduce((a, l) => a + l.distanceKm, 0),
    fareEstimate: fare,
    intercity,
    tags: [],
  };
}

export function planJourneys(fromId: string, toId: string, departAt: number, maxResults = 6): Journey[] {
  if (!fromId || !toId || fromId === toId) return [];
  const results: Journey[] = [];
  const seen = new Set<string>();
  const push = (segs: Seg[]) => {
    const j = assemble(fromId, toId, segs, departAt);
    if (!seen.has(j.id)) { seen.add(j.id); results.push(j); }
  };

  // direct
  for (const r of ROUTES) { const s = segment(r, fromId, toId); if (s) push([s]); }

  // 1 transfer
  for (const a of ROUTES) {
    if (!a.stopIds.includes(fromId)) continue;
    for (const b of ROUTES) {
      if (a.id === b.id || !b.stopIds.includes(toId)) continue;
      for (const x of a.stopIds) {
        if (x === fromId || x === toId || !b.stopIds.includes(x)) continue;
        const s1 = segment(a, fromId, x); const s2 = segment(b, x, toId);
        if (s1 && s2) push([s1, s2]);
      }
    }
  }

  // 2 transfers (only if few options so far)
  if (results.length < 3) {
    for (const a of ROUTES) {
      if (!a.stopIds.includes(fromId)) continue;
      for (const c of ROUTES) {
        if (!c.stopIds.includes(toId) || c.id === a.id) continue;
        for (const b of ROUTES) {
          if (b.id === a.id || b.id === c.id) continue;
          for (const x of a.stopIds) {
            if (x === fromId || !b.stopIds.includes(x)) continue;
            for (const y of b.stopIds) {
              if (y === x || y === toId || !c.stopIds.includes(y)) continue;
              const s1 = segment(a, fromId, x), s2 = segment(b, x, y), s3 = segment(c, y, toId);
              if (s1 && s2 && s3) push([s1, s2, s3]);
            }
          }
        }
      }
    }
  }

  // Remove journeys that are pointless detours (> 2.2x the best distance).
  const bestKm = Math.min(...results.map((j) => j.distanceKm));
  const filtered = results.filter((j) => j.distanceKm <= bestKm * 2.2 + 3);
  filtered.sort((a, b) => a.arriveAt - b.arriveAt || a.transfers - b.transfers);
  const top = filtered.slice(0, maxResults);
  if (top.length) {
    const fastest = top.reduce((a, b) => (b.arriveAt < a.arriveAt ? b : a));
    fastest.tags.push("Fastest");
    const fewest = Math.min(...top.map((j) => j.transfers));
    top.find((j) => j.transfers === fewest && !j.tags.includes("Fastest"))?.tags.push("Fewest transfers");
    const cheapest = top.reduce((a, b) => (b.fareEstimate[0] < a.fareEstimate[0] ? b : a));
    if (!cheapest.tags.length) cheapest.tags.push("Lowest fare");
  }
  return top;
}

export function journeyInstructions(j: Journey, stopName: (id: string) => string): string[] {
  const out: string[] = [];
  j.legs.forEach((l, i) => {
    const r = ROUTE_MAP[l.routeId];
    const fi = r.stopIds.indexOf(l.fromStopId);
    const ti = r.stopIds.indexOf(l.toStopId);
    const towards = ti > fi ? r.stopIds[r.stopIds.length - 1] : r.stopIds[0];
    const label = r.operator === "PRIVATE" ? r.number : `${r.operator} ${r.number}`;
    out.push(`${i === 0 ? "Board" : "Change to"} ${label} at ${stopName(l.fromStopId)} towards ${stopName(towards)}.`);
    out.push(`Ride ${l.stopIds.length - 1} stop${l.stopIds.length - 1 === 1 ? "" : "s"} and get off at ${stopName(l.toStopId)}.`);
  });
  out.push(`Arrive at ${stopName(j.toStopId)}.`);
  return out;
}
