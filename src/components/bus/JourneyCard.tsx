import { ArrowRight, Bookmark, BookmarkCheck, Footprints, Map as MapIcon, Repeat } from "lucide-react";
import { RouteChip } from "@/components/common/Badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTE_MAP } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { formatDuration, formatTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Journey } from "@/types";

interface Props {
  journey: Journey;
  selected?: boolean;
  saved?: boolean;
  onOpen?: () => void;
  onToggleSave?: () => void;
}

export function JourneyCard({ journey, selected, saved, onOpen, onToggleSave }: Props) {
  return (
    <article className={cn("rounded-xl border bg-card p-4 transition hover:border-brand/40", selected && "border-brand ring-1 ring-brand")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold tabular">
            {formatTime(journey.departAt)} <ArrowRight className="inline h-4 w-4 text-muted-foreground" /> {formatTime(journey.arriveAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDuration(journey.durationMins)} · {journey.transfers === 0 ? "Direct" : `${journey.transfers} transfer${journey.transfers > 1 ? "s" : ""}`} · ₹{journey.fareEstimate[0]}–{journey.fareEstimate[1]} est.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {journey.tags.map((t) => <Badge key={t} variant="brand">{t}</Badge>)}
          {journey.intercity && <Badge variant="outline">City + intercity</Badge>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {journey.legs.map((l, i) => {
          const r = ROUTE_MAP[l.routeId];
          return (
            <span key={i} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground"><Footprints className="h-3 w-3" />{STOP_MAP[l.fromStopId].name.split(" (")[0]}<ArrowRight className="h-3 w-3" /></span>}
              <RouteChip number={r.number} code={r.operator} className="h-6 text-xs" />
            </span>
          );
        })}
      </div>

      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {journey.legs.map((l, i) => {
          const r = ROUTE_MAP[l.routeId];
          return (
            <li key={i} className="flex items-center gap-1.5">
              <Repeat className={cn("h-3 w-3", i === 0 && "invisible")} />
              <span className="truncate"><span className="font-medium text-foreground/80">{r.number}</span> {STOP_MAP[l.fromStopId].name} → {STOP_MAP[l.toStopId].name} · {l.stopIds.length - 1} stop{l.stopIds.length === 2 ? "" : "s"} · departs {formatTime(l.departAt)}{l.waitMins > 1 ? ` (wait ${formatDuration(l.waitMins)})` : ""}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex gap-2">
        <Button size="sm" variant={selected ? "brand" : "outline"} onClick={onOpen} aria-pressed={selected}><MapIcon /> {selected ? "Showing on map" : "View on map"}</Button>
        <Button size="sm" variant="ghost" onClick={onToggleSave} aria-pressed={saved}>
          {saved ? <BookmarkCheck className="text-brand" /> : <Bookmark />} {saved ? "Saved" : "Save"}
        </Button>
      </div>
    </article>
  );
}
