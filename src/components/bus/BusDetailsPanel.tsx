import { ArrowRight, Bookmark, BookmarkCheck, Clock, ExternalLink, Gauge, MapPin, Navigation, Snowflake, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DemoBadge, OperatorBadge, RouteChip, StatusPill } from "@/components/common/Badges";
import { OccupancyIndicator } from "@/components/common/OccupancyIndicator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/misc";
import { useApp } from "@/context/AppContext";
import { OPERATORS } from "@/data/operators";
import { useNow } from "@/hooks/useNow";
import { formatKm } from "@/lib/geo";
import { stopEtas } from "@/lib/simulation";
import { formatDuration, formatTime, relativeTime } from "@/lib/time";
import type { LiveBus } from "@/types";
import { RouteTimeline } from "./RouteTimeline";

export function BusDetailsPanel({ bus, onClose, onStopClick }: { bus: LiveBus; onClose?: () => void; onStopClick?: (id: string) => void }) {
  const { savedBuses, toggleSavedBus } = useApp();
  const now = useNow(1000);
  const saved = savedBuses.includes(bus.id);
  const etas = stopEtas(bus);
  const inactive = bus.state.status === "not-in-service";
  const upcoming = etas.filter((e) => !e.passed);
  const color = OPERATORS[bus.route.operator].color;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-start gap-3">
          <RouteChip number={bus.route.number} code={bus.route.operator} className="h-9 min-w-[3.25rem] text-base" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold">{bus.originStop.name} <ArrowRight className="inline h-3.5 w-3.5 text-muted-foreground" /> {bus.destinationStop.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <OperatorBadge code={bus.route.operator} />
              <span className="text-xs text-muted-foreground">{bus.route.serviceType}</span>
              {bus.vehicle.ac === true && <span className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400"><Snowflake className="h-3 w-3" />AC</span>}
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close bus details"><X /></Button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <StatusPill status={bus.state.status} delayMins={bus.state.delayMins} />
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> Updated {relativeTime(bus.state.lastUpdated, now)} · <DemoBadge label="Simulated" /></span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
        {!inactive ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-muted/60 p-2.5">
                <p className="text-[11px] text-muted-foreground">Next stop</p>
                <p className="font-display text-lg font-bold tabular">{formatDuration(bus.etaNextStopMins, true)}</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-2.5">
                <p className="text-[11px] text-muted-foreground">Destination</p>
                <p className="font-display text-lg font-bold tabular">{formatDuration(bus.etaDestinationMins, true)}</p>
              </div>
              <div className="rounded-lg bg-muted/60 p-2.5">
                <p className="text-[11px] text-muted-foreground">Distance left</p>
                <p className="font-display text-lg font-bold tabular">{formatKm(bus.remainingKm)}</p>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Route progress</span>
                <span className="font-medium tabular">{Math.round(bus.progressPct)}%</span>
              </div>
              <Progress value={bus.progressPct} label="Route progress" indicatorClassName="" />
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{bus.originStop.name}</span><span>{bus.destinationStop.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-xs text-muted-foreground">Estimated occupancy</p>
                <OccupancyIndicator level={bus.occupancy} pct={bus.state.occupancyPct} className="mt-1" />
              </div>
              <Link to="/app/occupancy" className="text-xs font-medium text-brand hover:underline">How is this estimated?</Link>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">This demo vehicle is parked and not in service. No live trip information.</div>
        )}

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Navigation className="h-3.5 w-3.5" /> Upcoming stops</p>
          <RouteTimeline
            color={color}
            onStopClick={onStopClick}
            items={(inactive ? etas : upcoming).map((e) => ({ stop: e.stop, current: !inactive && e.index === bus.nextStopIndex, etaMins: inactive ? undefined : e.etaMins, time: inactive ? undefined : now + e.etaMins * 60000 }))}
          />
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg border p-3 text-xs">
          <dt className="text-muted-foreground">Vehicle</dt><dd className="text-right font-medium">{bus.vehicle.label}</dd>
          <dt className="text-muted-foreground">Type</dt><dd className="text-right font-medium">{bus.vehicle.vehicleType}</dd>
          <dt className="text-muted-foreground">Speed (sim.)</dt><dd className="text-right font-medium tabular"><Gauge className="mr-1 inline h-3 w-3" />{inactive ? 0 : Math.round(bus.state.speedKmph)} km/h</dd>
          <dt className="text-muted-foreground">Last report</dt><dd className="text-right font-medium tabular">{formatTime(bus.state.lastUpdated)}</dd>
        </dl>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t p-3">
        <Button
          variant="outline"
          onClick={() => {
            const added = toggleSavedBus(bus.id);
            toast.success(added ? `Saved ${bus.route.number}` : `Removed ${bus.route.number}`, { description: added ? "Find it in Profile → Saved buses." : undefined });
          }}
          aria-pressed={saved}
        >
          {saved ? <BookmarkCheck className="text-brand" /> : <Bookmark />} {saved ? "Saved" : "Save bus"}
        </Button>
        <Button asChild variant="brand">
          <Link to={`/app/bus/${bus.id}`}><ExternalLink /> Full details</Link>
        </Button>
      </div>
      <p className="flex items-center justify-center gap-1 border-t px-3 py-2 text-center text-[10px] text-muted-foreground"><MapPin className="h-3 w-3" /> Position is simulated sample data, not operator GPS.</p>
    </div>
  );
}
