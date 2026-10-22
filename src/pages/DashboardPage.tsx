import { ArrowRight, Bell, Bookmark, Clock, Heart, History, LocateFixed, MapPinned, Radar, Route as RouteIcon, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ServiceAlertCard } from "@/components/bus/ServiceAlertCard";
import { StopCard } from "@/components/bus/StopCard";
import { DemoBadge, RouteChip } from "@/components/common/Badges";
import { EmptyState, LoadingSkeleton } from "@/components/common/States";
import { StopPicker } from "@/components/common/StopPicker";
import { BusMap } from "@/components/map/BusMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { useSimulation } from "@/context/SimulationContext";
import { ALERTS } from "@/data/alerts";
import { ROUTE_MAP } from "@/data/routes";
import { DEMO_LOCATION, STOPS, STOP_MAP } from "@/data/stops";
import { useNow } from "@/hooks/useNow";
import { useUserLocation } from "@/hooks/useUserLocation";
import { departuresForStop } from "@/lib/departures";
import { haversineKm, nearestStops } from "@/lib/geo";
import { formatDuration, formatTime } from "@/lib/time";

export default function DashboardPage() {
  const { profile, t, favouriteStops, savedRoutes, recentRoutes, savedJourneys } = useApp();
  const { buses, loading } = useSimulation();
  const navigate = useNavigate();
  const now = useNow(15000);
  const { location, locate, isDemo, locating } = useUserLocation();
  const [from, setFrom] = useState(profile.homeStopId);
  const [to, setTo] = useState("");
  const [toError, setToError] = useState(false);

  const here: [number, number] = location ?? [DEMO_LOCATION.lat, DEMO_LOCATION.lng];
  const nearby = useMemo(() => nearestStops(STOPS, here, 3), [here[0], here[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  const nearbyBuses = useMemo(() => buses.filter((b) => b.state.status !== "not-in-service" && haversineKm(b.position, here) < 6), [buses, here]);

  const boardStop = favouriteStops[0] ?? nearby[0]?.stop.id;
  // Recompute departures every 15s (not every simulation tick) to keep the list calm.
  const departures = useMemo(() => (boardStop ? departuresForStop(boardStop, buses, now).filter((d) => d.kind !== "confirmed").slice(0, 5) : []), [boardStop, now]); // eslint-disable-line react-hooks/exhaustive-deps

  const hour = new Date().getHours();
  const greet = hour < 5 ? t("goodEvening") : hour < 12 ? t("goodMorning") : hour < 17 ? t("goodAfternoon") : t("goodEvening");
  const firstName = profile.name.split(" ")[0];

  const go = () => {
    if (!to) { setToError(true); return; }
    navigate(`/app/plan?from=${from}&to=${to}`);
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-navy-900 text-white shadow-lift dark:bg-card">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-2"><DemoBadge className="border-teal-300/40 bg-teal-300/10 text-teal-200" /></div>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{greet}, {firstName}</h1>
            <p className="mt-1 text-sm text-white/70">{t("whereTo")}</p>
            <form className="mt-5 grid gap-2 text-foreground sm:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => { e.preventDefault(); go(); }} noValidate>
              <StopPicker label="From" hideLabel value={from} onChange={setFrom} placeholder="From" icon="origin" onLocate={async () => { const p = await locate(); setFrom(nearestStops(STOPS, p, 1)[0].stop.id); }} />
              <div>
                <StopPicker label="To" hideLabel value={to} onChange={(v) => { setTo(v); setToError(false); }} placeholder="Where to?" icon="destination" invalid={toError} />
                {toError && <p className="mt-1 text-xs text-rose-300" role="alert">Choose a destination</p>}
              </div>
              <Button type="submit" variant="brand" className="h-11"><Search /> Plan</Button>
            </form>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { to: "/app/track", icon: Radar, label: "Live tracking" },
                { to: "/app/plan", icon: RouteIcon, label: "Plan journey" },
                { to: "/app/stops", icon: MapPinned, label: "Stops & depots" },
                { to: "/app/alerts", icon: Bell, label: `${ALERTS.length} alerts` },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium transition hover:bg-white/15">
                  <a.icon className="h-4 w-4 text-teal-300" /> {a.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-white/10">
            <BusMap className="absolute inset-0" buses={nearbyBuses} stops={nearby.map((n) => n.stop)} userLocation={here} fitPoints={[here]} interactive={false} showControls={false} onSelectBus={(id) => navigate(`/app/track?bus=${id}`)} initialZoom={13} />
            <div className="absolute bottom-2 left-2 z-[400] rounded-md bg-card/95 px-2 py-1 text-[11px] font-medium text-foreground shadow-soft">{nearbyBuses.length} demo buses within 6 km</div>
            <Button asChild size="sm" variant="secondary" className="absolute right-2 top-2 z-[400]"><Link to="/app/track">Open map <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> Upcoming departures</CardTitle>
              <p className="text-xs text-muted-foreground">From {boardStop ? STOP_MAP[boardStop].name : "—"} · sample timetable</p>
            </div>
            {boardStop && <Button asChild variant="ghost" size="sm"><Link to={`/app/stops?stop=${boardStop}`}>Full board <ArrowRight /></Link></Button>}
          </CardHeader>
          <CardContent>
            {loading ? <LoadingSkeleton rows={3} /> : departures.length === 0 ? (
              <EmptyState icon={Clock} title="No departures in the next 90 minutes" description="Services may have ended for the day in the sample timetable." />
            ) : (
              <ul className="divide-y">
                {departures.map((d) => {
                  const r = ROUTE_MAP[d.routeId];
                  const at = d.expectedAt ?? d.scheduledAt;
                  return (
                    <li key={d.id} className="flex items-center gap-3 py-2.5">
                      <RouteChip number={r.number} code={r.operator} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">to {STOP_MAP[d.towardsStopId].name}</p>
                        <p className="text-xs text-muted-foreground">{d.kind === "tracked" ? "Simulated vehicle approaching" : "Scheduled"}{d.bay ? ` · ${d.bay}` : ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular">{formatDuration((at - Date.now()) / 60000)}</p>
                        <p className="text-[11px] text-muted-foreground tabular">{formatTime(at)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-brand" /> Active alerts</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/app/alerts">All <ArrowRight /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {ALERTS.filter((a) => a.severity !== "low").slice(0, 3).map((a) => <ServiceAlertCard key={a.id} alert={a} compact />)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><LocateFixed className="h-4 w-4 text-brand" /> Nearby stops</CardTitle>
              <p className="text-xs text-muted-foreground">{location && !isDemo ? "Based on your location" : "Near demo location (Guindy)"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={locate} disabled={locating}>{locating ? "Locating…" : "Locate me"}</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {nearby.map(({ stop, km }) => <StopCard key={stop.id} stop={stop} distanceKm={km} onSelect={(id) => navigate(`/app/stops?stop=${id}`)} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4 text-brand" /> Favourite stops & saved routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {favouriteStops.length === 0 && savedRoutes.length === 0 ? (
              <EmptyState icon={Heart} title="Nothing saved yet" description="Tap the heart on any stop or save a route to see it here." />
            ) : (
              <>
                <div className="space-y-2">
                  {favouriteStops.map((id) => STOP_MAP[id] && <StopCard key={id} stop={STOP_MAP[id]} onSelect={(sid) => navigate(`/app/stops?stop=${sid}`)} />)}
                </div>
                {savedRoutes.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Saved routes</p>
                    <div className="flex flex-wrap gap-2">
                      {savedRoutes.map((id) => ROUTE_MAP[id] && (
                        <Link key={id} to={`/app/track?q=${encodeURIComponent(ROUTE_MAP[id].number)}`} className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs hover:bg-muted">
                          <RouteChip number={ROUTE_MAP[id].number} code={ROUTE_MAP[id].operator} className="h-5 min-w-0 px-1.5 text-[10px]" />{ROUTE_MAP[id].name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="h-4 w-4 text-brand" /> Recently viewed routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentRoutes.length === 0 ? (
              <EmptyState icon={History} title="No recent routes" description="Routes you open in live tracking will show up here." />
            ) : recentRoutes.map((id) => {
              const r = ROUTE_MAP[id];
              if (!r) return null;
              const live = buses.filter((b) => b.route.id === id && b.state.status !== "not-in-service").length;
              return (
                <Link key={id} to={`/app/track?q=${encodeURIComponent(r.number)}`} className="flex items-center gap-3 rounded-xl border p-3 transition hover:border-brand/40">
                  <RouteChip number={r.number} code={r.operator} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{live} demo bus{live === 1 ? "" : "es"} running</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
            {savedJourneys.length > 0 && (
              <Link to="/app/saved" className="flex items-center gap-2 pt-1 text-xs font-medium text-brand hover:underline"><Bookmark className="h-3.5 w-3.5" /> {savedJourneys.length} saved journey{savedJourneys.length === 1 ? "" : "s"} available offline</Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
