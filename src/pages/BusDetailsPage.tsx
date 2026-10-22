import { Accessibility, ArrowLeft, Bookmark, BookmarkCheck, Bus, Clock, Link2, Radar, Snowflake, Star } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { BusCard } from "@/components/bus/BusCard";
import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { ServiceAlertCard } from "@/components/bus/ServiceAlertCard";
import { AccessBadge, DemoBadge, InfoNote, OperatorBadge, RouteChip, StatusPill } from "@/components/common/Badges";
import { OccupancyIndicator } from "@/components/common/OccupancyIndicator";
import { EmptyState, LoadingSkeleton } from "@/components/common/States";
import { BusMap } from "@/components/map/BusMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/misc";
import { useApp } from "@/context/AppContext";
import { useSimulation } from "@/context/SimulationContext";
import { ALERTS } from "@/data/alerts";
import { OPERATORS } from "@/data/operators";
import { useNow } from "@/hooks/useNow";
import { formatKm } from "@/lib/geo";
import { stopEtas } from "@/lib/simulation";
import { formatDuration, formatTime, relativeTime } from "@/lib/time";

export default function BusDetailsPage() {
  const { id = "" } = useParams();
  const { busMap, buses, loading } = useSimulation();
  const { savedBuses, toggleSavedBus, savedRoutes, toggleSavedRoute, pushRecentRoute } = useApp();
  const navigate = useNavigate();
  const now = useNow(1000);
  const bus = busMap[id];

  useEffect(() => { if (bus) pushRecentRoute(bus.route.id); }, [bus?.route.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingSkeleton rows={4} />;
  if (!bus) {
    return (
      <EmptyState icon={Bus} title="Bus not found" description="This demo vehicle doesn't exist or the link is out of date." action={<Button asChild variant="brand"><Link to="/app/track">Go to live tracking</Link></Button>} className="mt-10" />
    );
  }

  const etas = stopEtas(bus);
  const inactive = bus.state.status === "not-in-service";
  const color = OPERATORS[bus.route.operator].color;
  const siblings = buses.filter((b) => b.route.id === bus.route.id && b.id !== bus.id);
  const alerts = ALERTS.filter((a) => a.routeIds.includes(bus.route.id));
  const savedBus = savedBuses.includes(bus.id);
  const savedRoute = savedRoutes.includes(bus.route.id);
  const a = bus.vehicle.accessibility;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link", { description: "Your browser blocked clipboard access." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/app/track"))}><ArrowLeft /> Back</Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}><Link2 /> Copy link</Button>
          <Button variant="outline" size="sm" aria-pressed={savedRoute} onClick={() => toast.success(toggleSavedRoute(bus.route.id) ? `Route ${bus.route.number} saved` : `Route ${bus.route.number} removed`)}>
            <Star className={savedRoute ? "fill-amber-400 text-amber-400" : ""} /> {savedRoute ? "Route saved" : "Save route"}
          </Button>
          <Button variant="brand" size="sm" aria-pressed={savedBus} onClick={() => toast.success(toggleSavedBus(bus.id) ? `Bus ${bus.vehicle.label} saved` : `Bus ${bus.vehicle.label} removed`)}>
            {savedBus ? <BookmarkCheck /> : <Bookmark />} {savedBus ? "Bus saved" : "Save bus"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <RouteChip number={bus.route.number} code={bus.route.operator} className="h-12 min-w-[4.5rem] self-start text-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold sm:text-2xl">{bus.originStop.name} → {bus.destinationStop.name}</h1>
              <DemoBadge />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <OperatorBadge code={bus.route.operator} />
              <span>{OPERATORS[bus.route.operator].name}</span>
              <span>· {bus.route.serviceType}</span>
              <StatusPill status={bus.state.status} delayMins={bus.state.delayMins} />
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:justify-end"><Clock className="h-3.5 w-3.5" /> Last updated</p>
            <p className="text-sm font-semibold tabular">{formatTime(bus.state.lastUpdated)} · {relativeTime(bus.state.lastUpdated, now)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <BusMap className="h-[340px] sm:h-[420px]" buses={[bus]} selectedBusId={bus.id} routeIds={[bus.route.id]} stops={bus.tripStops} highlightStopIds={[bus.nextStop.id]} fitPoints={bus.tripStops.map((s) => [s.lat, s.lng])} follow={false} />
          </Card>

          {!inactive && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Next stop" value={formatDuration(bus.etaNextStopMins)} hint={bus.nextStop.name} />
              <Metric label="Destination ETA" value={formatTime(now + bus.etaDestinationMins * 60000)} hint={formatDuration(bus.etaDestinationMins)} />
              <Metric label="Distance left" value={formatKm(bus.remainingKm)} hint={`of ${formatKm(bus.totalKm)}`} />
              <Metric label="Occupancy (est.)" value={<OccupancyIndicator level={bus.occupancy} compact />} hint={`~${bus.state.occupancyPct}% · demo`} />
            </div>
          )}

          <Card>
            <CardHeader><CardTitle>Route progress</CardTitle></CardHeader>
            <CardContent>
              <Progress value={inactive ? 0 : bus.progressPct} label="Route progress" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{bus.originStop.name}</span><span className="font-medium text-foreground">{inactive ? "Parked" : `${Math.round(bus.progressPct)}% complete`}</span><span>{bus.destinationStop.name}</span></div>
            </CardContent>
          </Card>

          {alerts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold">Alerts affecting this route</h2>
              {alerts.map((al) => <ServiceAlertCard key={al.id} alert={al} />)}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Upcoming stops</CardTitle><p className="text-xs text-muted-foreground">Estimated from simulated position and sample average speed</p></CardHeader>
            <CardContent>
              <RouteTimeline
                color={color}
                onStopClick={(sid) => navigate(`/app/stops?stop=${sid}`)}
                items={etas.map((e) => ({ stop: e.stop, passed: !inactive && e.passed, current: !inactive && e.index === bus.nextStopIndex, etaMins: inactive ? undefined : e.etaMins, time: inactive || e.passed ? undefined : now + e.etaMins * 60000 }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Vehicle</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
                <dt className="text-muted-foreground">Demo vehicle ID</dt><dd className="text-right font-medium">{bus.vehicle.label}</dd>
                <dt className="text-muted-foreground">Vehicle type</dt><dd className="text-right font-medium">{bus.vehicle.vehicleType}</dd>
                <dt className="text-muted-foreground">AC</dt>
                <dd className="text-right font-medium">{bus.vehicle.ac === null ? <span className="text-muted-foreground">Not available</span> : bus.vehicle.ac ? <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400"><Snowflake className="h-3.5 w-3.5" />AC</span> : "Non-AC"}</dd>
                <dt className="text-muted-foreground">Indicative capacity</dt><dd className="text-right font-medium">{bus.vehicle.capacity} (sample)</dd>
                <dt className="text-muted-foreground">Fare range</dt><dd className="text-right font-medium">₹{bus.route.fareRange[0]}–{bus.route.fareRange[1]} (sample)</dd>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Accessibility className="h-4 w-4 text-brand" /> Accessibility</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between"><span>Wheelchair access</span><AccessBadge status={a.wheelchair} /></li>
                <li className="flex items-center justify-between"><span>Low-floor entry</span><AccessBadge status={a.lowFloor} /></li>
                <li className="flex items-center justify-between"><span>Priority seating</span><AccessBadge status={a.prioritySeating} /></li>
                <li className="flex items-center justify-between"><span>Audio announcements</span><AccessBadge status={a.audioAnnouncements} /></li>
              </ul>
              <InfoNote tone="warning">None of these values are verified. They're sample entries for this demo. Confirm with the operator before relying on accessibility features.</InfoNote>
              <Button asChild variant="outline" size="sm" className="w-full"><Link to={`/app/accessibility?bus=${bus.id}`}>Request boarding assistance (demo)</Link></Button>
            </CardContent>
          </Card>

          {siblings.length > 0 && (
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><Radar className="h-4 w-4 text-brand" /> Other buses on {bus.route.number}</h2>
              {siblings.map((s) => <BusCard key={s.id} bus={s} compact onSelect={(sid) => navigate(`/app/bus/${sid}`)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-soft">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 font-display text-lg font-bold tabular">{value}</div>
      {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
