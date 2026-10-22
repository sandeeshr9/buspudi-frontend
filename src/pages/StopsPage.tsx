import { CalendarClock, CheckCircle2, Heart, MapPin, Radio, Signpost } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { StopCard } from "@/components/bus/StopCard";
import { DemoBadge, InfoNote, RouteChip } from "@/components/common/Badges";
import { SearchBar } from "@/components/common/SearchBar";
import { EmptyState, PageHeader } from "@/components/common/States";
import { BusMap } from "@/components/map/BusMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { useSimulation } from "@/context/SimulationContext";
import { ROUTE_MAP } from "@/data/routes";
import { DEMO_LOCATION, STOPS, STOP_MAP } from "@/data/stops";
import { useDebounce } from "@/hooks/useDebounce";
import { useNow } from "@/hooks/useNow";
import { departuresForStop, routesAtStop } from "@/lib/departures";
import { haversineKm } from "@/lib/geo";
import { formatDuration, formatTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Departure, StopType } from "@/types";

const TYPES: { v: "all" | StopType; label: string }[] = [
  { v: "all", label: "All" },
  { v: "terminus", label: "Termini" },
  { v: "depot", label: "Depots" },
  { v: "stop", label: "Stops" },
];

export default function StopsPage() {
  const [params, setParams] = useSearchParams();
  const { favouriteStops, toggleFavouriteStop } = useApp();
  const { buses } = useSimulation();
  const now = useNow(10000);
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 150);
  const [type, setType] = useState<"all" | StopType>("all");
  const [favOnly, setFavOnly] = useState(false);
  const stopId = params.get("stop") ?? favouriteStops[0] ?? "guindy";
  const stop = STOP_MAP[stopId] ?? STOP_MAP.guindy;

  const here: [number, number] = [DEMO_LOCATION.lat, DEMO_LOCATION.lng];
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return STOPS
      .filter((st) => (type === "all" || st.type === type) && (!favOnly || favouriteStops.includes(st.id)))
      .filter((st) => !s || st.name.toLowerCase().includes(s) || st.area.toLowerCase().includes(s) || routesAtStop(st.id).some((r) => r.number.toLowerCase().includes(s)))
      .map((st) => ({ st, km: haversineKm(here, [st.lat, st.lng]) }))
      .sort((a, b) => a.km - b.km);
  }, [q, type, favOnly, favouriteStops]); // eslint-disable-line react-hooks/exhaustive-deps

  const deps = useMemo(() => departuresForStop(stop.id, buses, now, 120), [stop.id, now]); // eslint-disable-line react-hooks/exhaustive-deps
  const upcoming = deps.filter((d) => d.kind !== "confirmed");
  const recent = deps.filter((d) => d.kind === "confirmed").reverse();
  const routes = routesAtStop(stop.id);
  const fav = favouriteStops.includes(stop.id);

  const select = (id: string) => {
    setParams({ stop: id }, { replace: true });
    if (window.matchMedia("(max-width: 1023px)").matches) document.getElementById("stop-detail")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader title="Stops & depots" description="Find stops, see which services call there and check sample departure boards." badge={<DemoBadge />} />
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Stop name, area or route number" label="Search stops" />
          <div className="flex flex-wrap items-center gap-1.5">
            {TYPES.map((t) => (
              <button key={t.v} type="button" aria-pressed={type === t.v} onClick={() => setType(t.v)} className={cn("h-8 rounded-full border px-3 text-xs font-medium", type === t.v ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>{t.label}</button>
            ))}
            <button type="button" aria-pressed={favOnly} onClick={() => setFavOnly((v) => !v)} className={cn("inline-flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-medium", favOnly ? "border-rose-500 bg-rose-500 text-white" : "bg-card hover:bg-muted")}><Heart className="h-3 w-3" /> Favourites</button>
          </div>
          <p className="text-xs text-muted-foreground">{list.length} stop{list.length === 1 ? "" : "s"} · sorted by distance from demo location</p>
          <div className="space-y-2 lg:max-h-[calc(100vh-17rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin">
            {list.length === 0 ? (
              <EmptyState icon={MapPin} title="No stops found" description={favOnly ? "You haven't added any favourites that match." : "Try a different name or area."} />
            ) : list.map(({ st, km }) => <StopCard key={st.id} stop={st} distanceKm={km} selected={st.id === stop.id} onSelect={select} />)}
          </div>
        </div>

        <div id="stop-detail" className="scroll-mt-20 space-y-6">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[1fr_260px]">
              <BusMap className="h-[260px] md:h-full md:min-h-[280px]" stops={[stop]} highlightStopIds={[stop.id]} routeIds={routes.map((r) => r.id)} fitPoints={[[stop.lat, stop.lng]]} buses={buses.filter((b) => routes.some((r) => r.id === b.route.id) && haversineKm(b.position, [stop.lat, stop.lng]) < 8)} showControls={false} />
              <div className="space-y-3 p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold leading-tight">{stop.name}</h2>
                    <Button variant="ghost" size="icon-sm" aria-pressed={fav} aria-label={fav ? "Remove from favourites" : "Add to favourites"} onClick={() => toast.success(toggleFavouriteStop(stop.id) ? "Added to favourites" : "Removed from favourites")}>
                      <Heart className={fav ? "fill-rose-500 text-rose-500" : ""} />
                    </Button>
                  </div>
                  {stop.tamilName && <p className="text-sm text-muted-foreground" lang="ta">{stop.tamilName}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{stop.area} · {stop.type === "terminus" ? "Bus terminus" : stop.type === "depot" ? "Depot" : "Bus stop"}</p>
                </div>
                {stop.bays && (
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Bays / platforms (sample)</p>
                    <div className="flex flex-wrap gap-1">{stop.bays.map((b) => <Badge key={b} variant="secondary">{b}</Badge>)}</div>
                  </div>
                )}
                {stop.amenities && (
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Facilities (sample)</p>
                    <div className="flex flex-wrap gap-1">{stop.amenities.map((b) => <Badge key={b} variant="outline">{b}</Badge>)}</div>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Services</p>
                  <div className="flex flex-wrap gap-1">{routes.map((r) => <Link key={r.id} to={`/app/track?q=${encodeURIComponent(r.number)}`} title={r.name}><RouteChip number={r.number} code={r.operator} className="h-6 text-xs" /></Link>)}</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm" variant="brand"><Link to={`/app/track?stop=${stop.id}`}><Radio /> Live buses</Link></Button>
                  <Button asChild size="sm" variant="outline"><Link to={`/app/plan?from=${stop.id}`}>Plan from here</Link></Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Departure board</CardTitle>
                <p className="text-xs text-muted-foreground">Sample timetable · refreshed {formatTime(now)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1"><CalendarClock className="h-3 w-3" /> Scheduled</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-accent-foreground"><Radio className="h-3 w-3" /> Tracked (simulated)</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-success"><CheckCircle2 className="h-3 w-3" /> Confirmed departed (demo)</span>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList><TabsTrigger value="upcoming">Upcoming · {upcoming.length}</TabsTrigger><TabsTrigger value="recent">Recent · {recent.length}</TabsTrigger></TabsList>
                <TabsContent value="upcoming"><DepartureTable rows={upcoming} now={now} empty="No more departures in the next two hours in the sample timetable." /></TabsContent>
                <TabsContent value="recent"><DepartureTable rows={recent} now={now} empty="No departures in the last 15 minutes." /></TabsContent>
              </Tabs>
              <InfoNote className="mt-4">
                <strong>Scheduled</strong> times come from a sample timetable and are not a guarantee a bus will run. <strong>Tracked</strong> rows have a simulated vehicle matched to the slot. <strong>Confirmed</strong> means the demo marked the trip as departed — real confirmation would need operator data.
              </InfoNote>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DepartureTable({ rows, now, empty }: { rows: Departure[]; now: number; empty: string }) {
  if (rows.length === 0) return <EmptyState icon={Signpost} title="Nothing to show" description={empty} />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3 font-medium">Route</th>
            <th className="py-2 pr-3 font-medium">Towards</th>
            <th className="py-2 pr-3 font-medium">Bay</th>
            <th className="py-2 pr-3 font-medium">Scheduled</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            <th className="py-2 text-right font-medium">Due</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 14).map((d) => {
            const r = ROUTE_MAP[d.routeId];
            const at = d.expectedAt ?? d.scheduledAt;
            const diff = d.expectedAt ? Math.round((d.expectedAt - d.scheduledAt) / 60000) : 0;
            return (
              <tr key={d.id} className="border-b last:border-0">
                <td className="py-2.5 pr-3"><RouteChip number={r.number} code={r.operator} className="h-6 text-xs" /></td>
                <td className="py-2.5 pr-3 font-medium">{STOP_MAP[d.towardsStopId].name}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{d.bay ?? "—"}</td>
                <td className="py-2.5 pr-3 tabular">{formatTime(d.scheduledAt)}</td>
                <td className="py-2.5 pr-3">
                  {d.kind === "scheduled" && <Badge variant="secondary"><CalendarClock /> Scheduled</Badge>}
                  {d.kind === "tracked" && <Badge variant="brand"><Radio /> Tracked{diff > 2 ? ` · +${diff}m` : diff < -2 ? ` · ${diff}m` : ""}</Badge>}
                  {d.kind === "confirmed" && <Badge variant="success"><CheckCircle2 /> Departed</Badge>}
                </td>
                <td className="py-2.5 text-right font-semibold tabular">
                  {d.kind === "confirmed" ? <span className="text-muted-foreground">{formatTime(d.scheduledAt)}</span> : d.vehicleId ? <Link to={`/app/bus/${d.vehicleId}`} className="hover:text-brand hover:underline">{formatDuration((at - now) / 60000)}</Link> : formatDuration((at - now) / 60000)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
