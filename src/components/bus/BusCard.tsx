import { ChevronRight, Clock, Snowflake } from "lucide-react";
import { OccupancyIndicator } from "@/components/common/OccupancyIndicator";
import { OperatorBadge, RouteChip, StatusPill } from "@/components/common/Badges";
import { formatKm } from "@/lib/geo";
import { formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { LiveBus } from "@/types";

interface Props {
  bus: LiveBus;
  selected?: boolean;
  onSelect?: (id: string) => void;
  compact?: boolean;
  className?: string;
}

export function BusCard({ bus, selected, onSelect, compact, className }: Props) {
  const inactive = bus.state.status === "not-in-service";
  return (
    <button
      type="button"
      onClick={() => onSelect?.(bus.id)}
      aria-pressed={selected}
      aria-label={`Bus ${bus.route.number} to ${bus.destinationStop.name}, next stop ${bus.nextStop.name}`}
      className={cn(
        "group w-full rounded-xl border bg-card p-3.5 text-left transition hover:border-brand/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-brand ring-1 ring-brand",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <RouteChip number={bus.route.number} code={bus.route.operator} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">to {bus.destinationStop.name}</p>
            {bus.vehicle.ac && <Snowflake className="h-3.5 w-3.5 shrink-0 text-sky-500" aria-label="AC" />}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {inactive ? "Parked" : <>Next: <span className="text-foreground/80">{bus.nextStop.name}</span></>}
          </p>
        </div>
        <div className="text-right">
          {inactive ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : (
            <>
              <p className="font-display text-base font-bold leading-tight tabular">{formatDuration(bus.etaNextStopMins)}</p>
              <p className="text-[11px] text-muted-foreground">to next stop</p>
            </>
          )}
        </div>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <OperatorBadge code={bus.route.operator} />
          <StatusPill status={bus.state.status} delayMins={bus.state.delayMins} />
          {!inactive && <OccupancyIndicator level={bus.occupancy} compact />}
          {!inactive && (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> {formatKm(bus.remainingKm)} left
              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      )}
    </button>
  );
}
