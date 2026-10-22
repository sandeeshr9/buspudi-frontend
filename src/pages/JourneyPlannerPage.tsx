import { ArrowDownUp, ArrowRight, Clock, Footprints, Route as RouteIcon, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { JourneyCard } from "@/components/bus/JourneyCard";
import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { DemoBadge, InfoNote, RouteChip } from "@/components/common/Badges";
import { OperatorFilter } from "@/components/common/OperatorFilter";
import { EmptyState, LoadingSkeleton, PageHeader } from "@/components/common/States";
import { StopPicker } from "@/components/common/StopPicker";
import { BusMap, type MapLine } from "@/components/map/BusMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { OPERATORS } from "@/data/operators";
import { ROUTE_MAP } from "@/data/routes";
import { STOPS, STOP_MAP } from "@/data/stops";
import { useUserLocation } from "@/hooks/useUserLocation";
import { formatKm, nearestStops } from "@/lib/geo";
import { journeyInstructions, planJourneys } from "@/lib/planner";
import { formatDuration, formatTime, parseHHMM, toInputTime } from "@/lib/time";
import type { Journey, OperatorCode } from "@/types";

const SUGGESTIONS: [string, string][] = [
  ["ramapuram", "puducherry"],
  ["broadway", "mahabalipuram"],
  ["annanagar", "kanchipuram"],
  ["guindy", "madurai"],
  ["vadapalani", "sholinganallur"],
];

type SortKey = "arrival" | "transfers" | "fare" | "duration";

export default function JourneyPlannerPage() {
  const [params, setParams] = useSearchParams();
  const { saveJourney, removeJourney, isJourneySaved, pushRecentRoute } = useApp();
  const { locate } = useUserLocation();

  const [from, setFrom] = useState(params.get("from") ?? "");
  const [to, setTo] = useState(params.get("to") ?? "");
  const [when, setWhen] = useState<"now" | "at">("now");
  const [time, setTime] = useState(toInputTime(Date.now() + 15 * 60000));
  const [errors, setErrors] = useState<{ from?: string; to?: string; time?: string }>({});
  const [results, setResults] = useState<Journey[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ops, setOps] = useState<OperatorCode[]>([]);
  const [maxTransfers, setMaxTransfers] = useState("any");
  const [sort, setSort] = useState<SortKey>("arrival");

  const run = (f = from, t = to) => {
    const e: typeof errors = {};
    if (!f) e.from = "Choose a starting stop.";
    if (!t) e.to = "Choose a destination.";
    if (f && t && f === t) e.to = "Destination must be different from the start.";
    if (when === "at" && !/^\d{2}:\d{2}$/.test(time)) e.time = "Enter a valid time.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setSelectedId(null);
    setParams({ from: f, to: t }, { replace: true });
    const departAt = when === "now" ? Date.now() : (() => { const d = parseHHMM(time); return d < Date.now() - 60000 ? d + 86400000 : d; })();
    setTimeout(() => {
      const r = planJourneys(f, t, departAt, 8);
      setResults(r);
      setLoading(false);
      if (r[0]) setSelectedId(r[0].id);
    }, 350);
  };

  // Auto-run when arriving with ?from&to
  useEffect(() => {
    if (params.get("from") && params.get("to")) run(params.get("from")!, params.get("to")!);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = useMemo(() => {
    if (!results) return null;
    let list = results.filter((j) => (ops.length ? j.legs.every((l) => ops.includes(ROUTE_MAP[l.routeId].operator)) : true));
    if (maxTransfers !== "any") list = list.filter((j) => j.transfers <= Number(maxTransfers));
    const cmp: Record<SortKey, (a: Journey, b: Journey) => number> = {
      arrival: (a, b) => a.arriveAt - b.arriveAt,
      transfers: (a, b) => a.transfers - b.transfers || a.arriveAt - b.arriveAt,
      fare: (a, b) => a.fareEstimate[0] - b.fareEstimate[0],
      duration: (a, b) => a.durationMins - b.durationMins,
    };
    return [...list].sort(cmp[sort]);
  }, [results, ops, maxTransfers, sort]);

  const selected = shown?.find((j) => j.id === selectedId) ?? shown?.[0];

  const lines: MapLine[] = useMemo(() => (selected ? selected.legs.map((l, i) => ({
    id: `${selected.id}-${i}`,
    points: l.stopIds.map((s) => [STOP_MAP[s].lat, STOP_MAP[s].lng] as [number, number]),
    color: OPERATORS[ROUTE_MAP[l.routeId].operator].color,
    dashed: ROUTE_MAP[l.routeId].intercity,
  })) : []), [selected]);
  const journeyStops = useMemo(() => (selected ? [...new Set(selected.legs.flatMap((l) => l.stopIds))].map((s) => STOP_MAP[s]) : []), [selected]);

  const toggleSave = (j: Journey) => {
    if (isJourneySaved(j.id)) {
      removeJourney(j.id);
      toast("Journey removed from saved");
      return;
    }
    const name = (id: string) => STOP_MAP[id].name;
    saveJourney({
      id: j.id, fromStopId: j.fromStopId, toStopId: j.toStopId, savedAt: Date.now(),
      summary: `${formatDuration(j.durationMins)} · ${j.transfers === 0 ? "Direct" : `${j.transfers} transfer${j.transfers > 1 ? "s" : ""}`}`,
      instructions: journeyInstructions(j, name),
      routeNumbers: j.legs.map((l) => ROUTE_MAP[l.routeId].number),
    });
    j.legs.forEach((l) => pushRecentRoute(l.routeId));
    toast.success("Journey saved", { description: "Instructions are stored in this browser and available offline." });
  };

  const handleLocate = async () => {
    const p = await locate();
    const near = nearestStops(STOPS, p, 1)[0];
    setFrom(near.stop.id);
    toast.success(`Starting from ${near.stop.name}`, { description: `${formatKm(near.km)} from your location` });
  };

  return (
    <div>
      <PageHeader title="Journey planner" description="Plan trips across city and intercity buses. Timings come from sample timetables and are estimates only." badge={<DemoBadge />} />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={(e) => { e.preventDefault(); run(); }} className="grid gap-3 md:grid-cols-[1fr_auto_1fr_200px_auto] md:items-start" noValidate>
            <div>
              <StopPicker label="From" value={from} onChange={(v) => { setFrom(v); setErrors((e) => ({ ...e, from: undefined })); }} placeholder="Starting stop" icon="origin" invalid={!!errors.from} onLocate={handleLocate} />
              {errors.from && <p className="mt-1 text-xs text-destructive" role="alert">{errors.from}</p>}
            </div>
            <Button type="button" variant="outline" size="icon" className="mx-auto md:mt-[22px]" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap start and destination"><ArrowDownUp className="md:rotate-90" /></Button>
            <div>
              <StopPicker label="To" value={to} onChange={(v) => { setTo(v); setErrors((e) => ({ ...e, to: undefined })); }} placeholder="Destination" icon="destination" invalid={!!errors.to} />
              {errors.to && <p className="mt-1 text-xs text-destructive" role="alert">{errors.to}</p>}
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Departure</span>
              <div className="flex gap-2">
                <Select value={when} onValueChange={(v) => setWhen(v as "now" | "at")}>
                  <SelectTrigger className="h-11 w-[100px]" aria-label="Departure option"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="now">Now</SelectItem><SelectItem value="at">Leave at</SelectItem></SelectContent>
                </Select>
                <Input type="time" aria-label="Departure time" value={time} onChange={(e) => setTime(e.target.value)} disabled={when === "now"} className="h-11" aria-invalid={!!errors.time} />
              </div>
              {errors.time && <p className="mt-1 text-xs text-destructive" role="alert">{errors.time}</p>}
            </div>
            <Button type="submit" variant="brand" size="lg" className="h-11 md:mt-[22px]"><Search /> Find buses</Button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {SUGGESTIONS.map(([f, t]) => (
              <button key={f + t} type="button" onClick={() => { setFrom(f); setTo(t); run(f, t); }} className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs hover:border-brand/50 hover:bg-accent">
                {STOP_MAP[f].name.split(" (")[0]} <ArrowRight className="h-3 w-3" /> {STOP_MAP[t].name.split(" (")[0]}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && <div className="mt-6"><LoadingSkeleton rows={3} /></div>}

      {!loading && results === null && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: RouteIcon, t: "City to intercity", d: "Combine MTC city buses with SETC, TNSTC or private coaches in one plan." },
            { icon: Clock, t: "Compare options", d: "See duration, transfers, estimated arrival and an indicative fare range." },
            { icon: Footprints, t: "Clear transfers", d: "Know exactly where to change buses and how long you may wait." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border bg-card p-4">
              <f.icon className="h-5 w-5 text-brand" />
              <p className="mt-2 text-sm font-semibold">{f.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && shown && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{shown.length}</span> option{shown.length === 1 ? "" : "s"} · {STOP_MAP[from]?.name} → {STOP_MAP[to]?.name}</p>
              <div className="flex gap-2">
                <Select value={maxTransfers} onValueChange={setMaxTransfers}>
                  <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Maximum transfers"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="any">Any transfers</SelectItem><SelectItem value="0">Direct only</SelectItem><SelectItem value="1">Max 1 transfer</SelectItem></SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Sort journeys"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="arrival">Earliest arrival</SelectItem><SelectItem value="duration">Shortest</SelectItem><SelectItem value="transfers">Fewest transfers</SelectItem><SelectItem value="fare">Lowest fare</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <OperatorFilter selected={ops} onChange={setOps} />
            {shown.length === 0 ? (
              <EmptyState
                title={results?.length ? "No journeys match these filters" : "No journeys found"}
                description={results?.length ? "Try allowing more transfers or other operators." : "The demo network doesn't connect these stops yet. Try a nearby stop or a major terminus like Koyambedu or Kilambakkam."}
                action={results?.length ? <Button size="sm" variant="outline" onClick={() => { setOps([]); setMaxTransfers("any"); }}>Reset filters</Button> : undefined}
              />
            ) : (
              shown.map((j) => <JourneyCard key={j.id} journey={j} selected={selected?.id === j.id} saved={isJourneySaved(j.id)} onOpen={() => setSelectedId(j.id)} onToggleSave={() => toggleSave(j)} />)
            )}
            <InfoNote>Sample timetables repeat around the clock in this demo and assume an 8-minute transfer. Real timetables and live delays require operator data.</InfoNote>
          </div>

          {selected && (
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <Card className="overflow-hidden">
                <BusMap className="h-[320px] sm:h-[380px]" extraLines={lines} stops={journeyStops} highlightStopIds={[selected.fromStopId, selected.toStopId]} fitPoints={journeyStops.map((s) => [s.lat, s.lng])} />
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Journey details</CardTitle>
                  <p className="text-xs text-muted-foreground">{formatTime(selected.departAt)} – {formatTime(selected.arriveAt)} · {formatDuration(selected.durationMins)} · {formatKm(selected.distanceKm)}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {selected.legs.map((l, i) => {
                    const r = ROUTE_MAP[l.routeId];
                    return (
                      <div key={i}>
                        {i > 0 && (
                          <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-xs">
                            <Footprints className="h-3.5 w-3.5 text-muted-foreground" /> Change at <strong>{STOP_MAP[l.fromStopId].name}</strong> · wait ~{formatDuration(Math.max(l.waitMins, 1))}
                          </div>
                        )}
                        <div className="mb-2 flex items-center gap-2">
                          <RouteChip number={r.number} code={r.operator} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{OPERATORS[r.operator].shortName} · {r.serviceType} · every ~{r.frequencyMins} min</p>
                          </div>
                        </div>
                        <RouteTimeline
                          color={OPERATORS[r.operator].color}
                          items={l.stopIds.map((sid, k) => ({
                            stop: STOP_MAP[sid],
                            passed: false,
                            time: l.departAt + ((l.arriveAt - l.departAt) * k) / Math.max(1, l.stopIds.length - 1),
                            note: k === 0 ? "Board" : k === l.stopIds.length - 1 ? "Get off" : undefined,
                          }))}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
