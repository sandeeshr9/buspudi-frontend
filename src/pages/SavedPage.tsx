import { ArrowRight, Bookmark, ChevronDown, CloudOff, Heart, MapPin, Route as RouteIcon, Trash2, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { InfoNote, RouteChip } from "@/components/common/Badges";
import { EmptyState, PageHeader } from "@/components/common/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { ROUTE_MAP } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { routesAtStop } from "@/lib/departures";
import { relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export default function SavedPage() {
  const online = useOnlineStatus();
  const { savedJourneys, removeJourney, favouriteStops, toggleFavouriteStop, savedRoutes, toggleSavedRoute } = useApp();
  const [open, setOpen] = useState<string | null>(savedJourneys[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved & offline"
        description="Journeys, stops and routes you've saved are kept in this browser so you can open them without a connection."
        badge={
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", online ? "bg-success/10 text-success" : "bg-warning/15 text-warning")} role="status">
            {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />} {online ? "Online" : "Offline"}
          </span>
        }
      />

      <InfoNote>
        Saved journey instructions and stop details can be viewed offline. <strong>Live bus positions, departure updates and new service alerts need an internet connection</strong>, so check again before you travel. In this demo, data is stored with your browser's local storage.
      </InfoNote>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Bookmark className="h-4 w-4 text-brand" /> Saved journeys</CardTitle>
          <Badge variant="secondary">{savedJourneys.length}</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          {savedJourneys.length === 0 ? (
            <EmptyState icon={Bookmark} title="No saved journeys" description="Plan a journey and tap Save to keep its step-by-step instructions here." action={<Button asChild variant="brand" size="sm"><Link to="/app/plan">Plan a journey</Link></Button>} />
          ) : savedJourneys.map((j) => {
            const expanded = open === j.id;
            return (
              <div key={j.id} className="rounded-xl border">
                <button type="button" onClick={() => setOpen(expanded ? null : j.id)} aria-expanded={expanded} className="flex w-full items-center gap-3 p-3.5 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{STOP_MAP[j.fromStopId]?.name} <ArrowRight className="inline h-3.5 w-3.5 text-muted-foreground" /> {STOP_MAP[j.toStopId]?.name}</p>
                    <p className="text-xs text-muted-foreground">{j.summary} · saved {relativeTime(j.savedAt)}</p>
                  </div>
                  <div className="hidden gap-1 sm:flex">{j.routeNumbers.map((n, i) => <Badge key={i} variant="outline">{n}</Badge>)}</div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-success"><CloudOff className="h-3 w-3" /> Offline</span>
                  <ChevronDown className={cn("h-4 w-4 transition", expanded && "rotate-180")} />
                </button>
                {expanded && (
                  <div className="border-t p-4">
                    <ol className="space-y-2">
                      {j.instructions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">{i + 1}</span>
                          <span className="pt-0.5">{s}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="brand" disabled={!online}><Link to={`/app/plan?from=${j.fromStopId}&to=${j.toStopId}`}>Check live times</Link></Button>
                      <Button size="sm" variant="ghost" onClick={() => { removeJourney(j.id); toast("Journey removed"); }}><Trash2 /> Remove</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4 text-brand" /> Saved stops</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {favouriteStops.length === 0 ? <EmptyState icon={MapPin} title="No saved stops" description="Tap the heart on a stop to save it." /> : favouriteStops.map((id) => {
              const s = STOP_MAP[id];
              if (!s) return null;
              return (
                <div key={id} className="rounded-xl border p-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-brand" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/app/stops?stop=${id}`} className="text-sm font-semibold hover:underline">{s.name}</Link>
                      <p className="text-xs text-muted-foreground">{s.area}{s.bays ? ` · ${s.bays.length} bays` : ""}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">{routesAtStop(id).map((r) => <RouteChip key={r.id} number={r.number} code={r.operator} className="h-5 min-w-0 px-1.5 text-[10px]" />)}</div>
                    </div>
                    <Button size="icon-sm" variant="ghost" aria-label={`Remove ${s.name}`} onClick={() => toggleFavouriteStop(id)}><Trash2 /></Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><RouteIcon className="h-4 w-4 text-brand" /> Saved routes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {savedRoutes.length === 0 ? <EmptyState icon={RouteIcon} title="No saved routes" description="Save a route from any bus details page." /> : savedRoutes.map((id) => {
              const r = ROUTE_MAP[id];
              if (!r) return null;
              return (
                <div key={id} className="flex items-center gap-3 rounded-xl border p-3">
                  <RouteChip number={r.number} code={r.operator} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.stopIds.map((s) => STOP_MAP[s].name.split(" (")[0]).join(" · ")}</p>
                  </div>
                  <Button size="icon-sm" variant="ghost" aria-label={`Remove route ${r.number}`} onClick={() => toggleSavedRoute(id)}><Trash2 /></Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
