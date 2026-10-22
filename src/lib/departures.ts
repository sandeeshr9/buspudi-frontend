import type { Departure, LiveBus } from "@/types";
import { ROUTES } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { routePolyline } from "./simulation";
import { parseHHMM } from "./time";

/**
 * DEMO departure boards: scheduled times are derived from each sample route's
 * frequency. "tracked" times come from simulated vehicles; "confirmed" rows are
 * demo departures marked as having left. None of this is operator data.
 */
export function departuresForStop(stopId: string, buses: LiveBus[], now = Date.now(), horizonMins = 90): Departure[] {
  const out: Departure[] = [];
  const stop = STOP_MAP[stopId];
  for (const r of ROUTES) {
    const idx = r.stopIds.indexOf(stopId);
    if (idx === -1) continue;
    const pl = routePolyline(r.id);
    const dirs: (1 | -1)[] = [];
    if (idx < r.stopIds.length - 1) dirs.push(1);
    if (idx > 0) dirs.push(-1);
    for (const dir of dirs) {
      const towards = dir === 1 ? r.stopIds[r.stopIds.length - 1] : r.stopIds[0];
      const offsetMin = ((dir === 1 ? pl.cum[idx] : pl.total - pl.cum[idx]) / r.avgSpeedKmph) * 60;
      // Demo timetables repeat all day so boards match the always-on simulation.
      const first = parseHHMM(r.firstDeparture, new Date(now)) + offsetMin * 60000;
      const f = r.frequencyMins * 60000;
      // Offset reverse direction so departures don't coincide.
      const phase = dir === -1 ? f / 2 : 0;
      let t = first + phase + Math.ceil((now - 15 * 60000 - first - phase) / f) * f;
      let n = 0;
      while (t < now + horizonMins * 60000 && n < 8) {
        {
          const past = t < now;
          out.push({
            id: `${r.id}-${dir}-${t}`,
            routeId: r.id,
            stopId,
            towardsStopId: towards,
            scheduledAt: t,
            kind: past ? "confirmed" : "scheduled",
            bay: stop.bays ? stop.bays[(r.number.charCodeAt(0) + dir + 2) % stop.bays.length] : undefined,
          });
        }
        t += f; n++;
      }
      // Attach simulated vehicles approaching this stop in this direction.
      const approaching = buses
        .filter((b) => b.route.id === r.id && b.state.direction === dir && b.state.status !== "not-in-service")
        .map((b) => ({ b, i: b.tripStops.findIndex((s) => s.id === stopId) }))
        .filter(({ b, i }) => i >= b.nextStopIndex && i !== -1);
      for (const { b } of approaching) {
        const pl2 = routePolyline(r.id);
        const tripCumAt = dir === 1 ? pl2.cum[r.stopIds.indexOf(stopId)] : pl2.total - pl2.cum[r.stopIds.indexOf(stopId)];
        const t0 = b.totalKm - b.remainingKm;
        const eta = ((tripCumAt - t0) / Math.max(8, r.avgSpeedKmph)) * 60;
        const expected = now + Math.max(0, eta) * 60000;
        // Match to the closest upcoming scheduled slot without a vehicle.
        const slot = out
          .filter((d) => d.routeId === r.id && d.towardsStopId === towards && d.kind === "scheduled" && !d.vehicleId)
          .sort((a, c) => Math.abs(a.scheduledAt - expected) - Math.abs(c.scheduledAt - expected))[0];
        if (slot && Math.abs(slot.scheduledAt - expected) < 40 * 60000) {
          slot.kind = "tracked";
          slot.expectedAt = expected;
          slot.vehicleId = b.id;
        }
      }
    }
  }
  return out.sort((a, b) => (a.expectedAt ?? a.scheduledAt) - (b.expectedAt ?? b.scheduledAt));
}

export function routesAtStop(stopId: string) {
  return ROUTES.filter((r) => r.stopIds.includes(stopId));
}
