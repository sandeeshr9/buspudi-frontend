import { Accessibility, ArrowUpDown, Bus, FlaskConical, List, Map as MapIcon, MapPin, Radar, Snowflake, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BusCard } from "@/components/bus/BusCard";
import { BusDetailsPanel } from "@/components/bus/BusDetailsPanel";
import { DemoBadge, OperatorBadge, RouteChip } from "@/components/common/Badges";
import { OperatorFilter } from "@/components/common/OperatorFilter";
import { SearchBar } from "@/components/common/SearchBar";
import { EmptyState, LoadingSkeleton } from "@/components/common/States";
import { BusMap } from "@/components/map/BusMap";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { useSimulation } from "@/context/SimulationContext";
import { OPERATOR_CODES } from "@/data/operators";
import { ROUTES } from "@/data/routes";
import { STOPS, STOP_MAP } from "@/data/stops";
import { useDebounce } from "@/hooks/useDebounce";
import { useNow } from "@/hooks/useNow";
import { useUserLocation } from "@/hooks/useUserLocation";
import { formatKm, nearestStops } from "@/lib/geo";
import { routesAtStop } from "@/lib/departures";
import { SIM_SPEEDUP, stopEtas } from "@/lib/simulation";
import { formatDuration, relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { LiveBus, OperatorCode } from "@/types";

type SortKey = "eta" | "route" | "occupancy";

function matches(bus: LiveBus, q: string) {
  if (!q) return true;
  const s = q.toLowerCase();
  return [bus.route.number, bus.route.name, bus.destinationStop.name, bus.originStop.name, bus.route.operator, bus.vehicle.label, ...bus.tripStops.map((t) => t.name)]
    .some((v) => v.toLowerCase().includes(s));
}

export default function LiveTrackingPage() {
  const { buses, busMap, loading, lastTick } = useSimulation();
  const { settings, pushRecentRoute } = useApp();
  const [params, setParams] = useSearchParams();
  const now = useNow(1000);
  const { location, locate, isDemo } = useUserLocation();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const q = useDebounce(query, 150);
  const [ops, setOps] = useState<OperatorCode[]>(() => {
    const p = params.get("op")?.toUpperCase() as OperatorCode | undefined;
    if (p && OPERATOR_CODES.includes(p)) return [p];
    return settings.preferredOperators.length < 4 ? settings.preferredOperators : [];
  });
  const [acOnly, setAcOnly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(settings.accessibility.accessibleFirst);
  const [showParked, setShowParked] = useState(false);
  const [sort, setSort] = useState<SortKey>("eta");
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [tab, setTab] = useState<"buses" | "stops">(params.get("stop") ? "stops" : "buses");
  const [focus, setFocus] = useState<[number, number][] | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedId = params.get("bus");
  const stopId = params.get("stop");
  const selected = selectedId ? busMap[selectedId] : undefined;
  const selectedStop = stopId ? STOP_MAP[stopId] : undefined;

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };

  const selectBus = (id: string | null) => {
    setParam("bus", id);
    if (id && busMap[id]) {
      setFocus([busMap[id].position]);
      pushRecentRoute(busMap[id].route.id);
      if (window.matchMedia("(max-width: 1023px)").matches) setSheetOpen(true);
    }
  };

  const selectStop = (id: string | null) => {
    setParam("stop", id);
    if (id) { setFocus([[STOP_MAP[id].lat, STOP_MAP[id].lng]]); setTab("stops"); }
  };

  useEffect(() => { if (selectedId && !busMap[selectedId]) setParam("bus", null); }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (selected) setFocus([selected.position]); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopRouteIds = useMemo(() => new Set(selectedStop ? routesAtStop(selectedStop.id).map((r) => r.id) : []), [selectedStop]);

  const filtered = useMemo(() => {
    const list = buses.filter((b) => {
      if (!showParked && b.state.status === "not-in-service") return false;
      if (ops.length && !ops.includes(b.route.operator)) return false;
      if (acOnly && b.vehicle.ac !== true) return false;
      if (accessibleOnly && !["verified", "demo"].includes(b.vehicle.accessibility.wheelchair)) return false;
      if (selectedStop) {
        if (!stopRouteIds.has(b.route.id)) return false;
        const idx = b.tripStops.findIndex((s) => s.id === selectedStop.id);
        if (idx < b.nextStopIndex) return false;
      }
      return matches(b, q);
    });
    const etaTo = (b: LiveBus) => (selectedStop ? stopEtas(b).find((e) => e.stop.id === selectedStop.id)?.etaMins ?? 999 : b.etaNextStopMins);
    return list.sort((a, b) =>
      sort === "route" ? a.route.number.localeCompare(b.route.number, undefined, { numeric: true }) : sort === "occupancy" ? a.state.occupancyPct - b.state.occupancyPct : etaTo(a) - etaTo(b)
    );
  }, [buses, ops, acOnly, accessibleOnly, showParked, q, sort, selectedStop, stopRouteIds]);

  const counts = useMemo(() => {
    const c: Partial<Record<OperatorCode, number>> = {};
    buses.forEach((b) => { if (b.state.status !== "not-in-service" && matches(b, q)) c[b.route.operator] = (c[b.route.operator] ?? 0) + 1; });
    return c;
  }, [buses, q]);

  const routeIds = useMemo(() => {
    if (selected) return [selected.route.id];
    const ids = new Set(filtered.map((b) => b.route.id));
    return ROUTES.filter((r) => ids.has(r.id)).map((r) => r.id);
  }, [filtered, selected]);

  const nearby = useMemo(() => nearestStops(STOPS, location ?? [13.0101, 80.2161], 8), [location]);

  const activeFilters = ops.length + (acOnly ? 1 : 0) + (accessibleOnly ? 1 : 0) + (showParked ? 1 : 0) + (q ? 1 : 0) + (selectedStop ? 1 : 0);
  const clearAll = () => { setQuery(""); setOps([]); setAcOnly(false); setAccessibleOnly(false); setShowParked(false); selectStop(null); };

  const toggles = (
    <div className="flex flex-wrap items-center gap-1.5">
      <ToggleChip on={acOnly} onClick={() => setAcOnly((v) => !v)} icon={<Snowflake className="h-3.5 w-3.5" />}>AC</ToggleChip>
      <ToggleChip on={accessibleOnly} onClick={() => setAccessibleOnly((v) => !v)} icon={<Accessibility className="h-3.5 w-3.5" />}>Wheelchair (demo)</ToggleChip>
      <ToggleChip on={showParked} onClick={() => setShowParked((v) => !v)} icon={<Bus className="h-3.5 w-3.5" />}>Parked</ToggleChip>
      <button type="button" onClick={() => setSort((s) => (s === "eta" ? "route" : s === "route" ? "occupancy" : "eta"))} className="ml-auto inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted" aria-label={`Sort by ${sort}. Click to change.`}>
        <ArrowUpDown className="h-3.5 w-3.5" /> {sort === "eta" ? "Soonest" : sort === "route" ? "Route" : "Least crowded"}
      </button>
    </div>
  );

  const busList = (
    <div className="space-y-2">
      {selectedStop && (
        <div className="flex items-center justify-between rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
          <span className="truncate">Buses heading to <strong>{selectedStop.name}</strong></span>
          <button type="button" onClick={() => selectStop(null)} className="ml-2 inline-flex items-center gap-1 font-medium hover:underline"><X className="h-3 w-3" />Clear</button>
        </div>
      )}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No buses match"
          description={selectedStop ? `No simulated buses are approaching ${selectedStop.name} with these filters.` : "Try another bus number, destination or operator, or clear your filters."}
          action={activeFilters ? <Button variant="outline" size="sm" onClick={clearAll}>Clear filters</Button> : undefined}
        />
      ) : (
        filtered.map((b) => (
          <div key={b.id}>
            <BusCard bus={b} selected={b.id === selectedId} onSelect={(id) => selectBus(id === selectedId ? null : id)} />
            {selectedStop && (
              <p className="px-1 pt-1 text-[11px] text-muted-foreground">
                Reaches {selectedStop.name} in <span className="font-semibold text-foreground">{formatDuration(stopEtas(b).find((e) => e.stop.id === selectedStop.id)?.etaMins ?? 0)}</span>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );

  const stopsList = (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{location ? (isDemo ? "Near demo location" : "Near you") : "Near Guindy (demo location)"}</span>
        <Button variant="link" size="sm" className="text-xs" onClick={() => locate().then((p) => setFocus([p]))}>Use my location</Button>
      </div>
      {nearby.map(({ stop, km }) => {
        const rs = routesAtStop(stop.id);
        return (
          <button
            key={stop.id}
            type="button"
            onClick={() => { selectStop(stop.id === stopId ? null : stop.id); setTab("buses"); }}
            className={cn("w-full rounded-xl border bg-card p-3 text-left transition hover:border-brand/40", stop.id === stopId && "border-brand ring-1 ring-brand")}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              <span className="flex-1 truncate text-sm font-semibold">{stop.name}</span>
              <span className="text-xs text-muted-foreground tabular">{formatKm(km)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {rs.map((r) => <RouteChip key={r.id} number={r.number} code={r.operator} className="h-5 min-w-0 px-1.5 text-[10px]" />)}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{rs.length} service{rs.length === 1 ? "" : "s"} · tap to see approaching buses</p>
          </button>
        );
      })}
    </div>
  );

  const updatedLabel = `Updated ${relativeTime(lastTick, now)}`;

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem-4rem)] flex-col lg:h-[calc(100vh-4rem)] lg:flex-row">
      {/* Left panel */}
      <section aria-label="Bus search and results" className={cn("flex w-full flex-col border-r bg-card lg:w-[380px] lg:shrink-0", mobileView === "map" ? "max-lg:hidden" : "max-lg:flex-1 max-lg:min-h-0")}>
        <div className="space-y-3 border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-lg font-bold"><Radar className="h-5 w-5 text-brand" /> Live tracking</h1>
            <DemoBadge />
          </div>
          <SearchBar value={query} onChange={setQuery} placeholder="Bus no., route, destination, operator" label="Search buses" />
          <OperatorFilter selected={ops} onChange={setOps} counts={counts} />
          {toggles}
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-4 pt-3">
            <TabsList className="h-9">
              <TabsTrigger value="buses" className="text-xs">Buses <span className="ml-1 rounded bg-muted px-1 tabular text-[10px]">{filtered.length}</span></TabsTrigger>
              <TabsTrigger value="stops" className="text-xs">Nearby stops</TabsTrigger>
            </TabsList>
            <span className="text-[11px] text-muted-foreground tabular" aria-live="polite">{updatedLabel}</span>
          </div>
          <TabsContent value="buses" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4 pt-3 scrollbar-thin">{busList}</TabsContent>
          <TabsContent value="stops" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4 pt-3 scrollbar-thin">{stopsList}</TabsContent>
        </Tabs>
      </section>

      {/* Map */}
      <section aria-label="Map" className={cn("relative min-h-0 flex-1", mobileView === "list" && "max-lg:hidden")}>
        {/* Mobile search overlay */}
        <div className="absolute inset-x-3 top-3 z-[450] space-y-2 pr-12 lg:hidden">
          <SearchBar value={query} onChange={setQuery} placeholder="Search bus or destination" label="Search buses" className="shadow-soft" />
          <div className="-mx-1 overflow-x-auto px-1 pb-1"><OperatorFilter selected={ops} onChange={setOps} className="flex-nowrap" /></div>
        </div>
        <BusMap
          className="h-full w-full"
          buses={filtered.concat(selected && !filtered.includes(selected) ? [selected] : [])}
          selectedBusId={selectedId}
          onSelectBus={(id) => selectBus(id)}
          routeIds={routeIds}
          highlightRouteId={selected?.route.id}
          stops={STOPS}
          highlightStopIds={selected ? selected.tripStops.map((s) => s.id) : selectedStop ? [selectedStop.id] : []}
          onSelectStop={(id) => selectStop(id)}
          fitPoints={focus}
          userLocation={location}
          onLocate={() => locate().then((p) => setFocus([p]))}
          follow={!!selected}
        >
          <div className="pointer-events-none absolute left-3 top-[108px] z-[400] lg:top-3">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border bg-card/95 px-3 py-1.5 text-[11px] font-medium shadow-soft backdrop-blur">
              <FlaskConical className="h-3.5 w-3.5 text-warning" />
              <span>Demo data · simulated positions · {SIM_SPEEDUP}× speed</span>
            </div>
          </div>
          <MapLegend />
          {/* Mobile selected-bus peek */}
          {selected && (
            <div className="absolute inset-x-3 bottom-3 z-[450] lg:hidden">
              <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-lift">
                <RouteChip number={selected.route.number} code={selected.route.operator} />
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setSheetOpen(true)}>
                  <p className="truncate text-sm font-semibold">to {selected.destinationStop.name}</p>
                  <p className="truncate text-xs text-muted-foreground">Next {selected.nextStop.name} · {formatDuration(selected.etaNextStopMins)}</p>
                </button>
                <Button size="sm" variant="brand" onClick={() => setSheetOpen(true)}>Details</Button>
                <Button size="icon-sm" variant="ghost" onClick={() => selectBus(null)} aria-label="Deselect bus"><X /></Button>
              </div>
            </div>
          )}
        </BusMap>
      </section>

      {/* Desktop details panel */}
      {selected && (
        <aside aria-label="Selected bus details" className="hidden w-[360px] shrink-0 border-l bg-card xl:block">
          <BusDetailsPanel bus={selected} onClose={() => selectBus(null)} onStopClick={(id) => selectStop(id)} />
        </aside>
      )}
      {selected && (
        <div className="absolute bottom-6 right-6 z-[450] hidden w-[340px] overflow-hidden rounded-xl border bg-card shadow-lift lg:block xl:hidden" style={{ maxHeight: "calc(100vh - 8rem)" }}>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto"><BusDetailsPanel bus={selected} onClose={() => selectBus(null)} onStopClick={(id) => selectStop(id)} /></div>
        </div>
      )}

      {/* Mobile view toggle */}
      <div className="fixed bottom-[4.75rem] left-1/2 z-[550] -translate-x-1/2 lg:hidden" style={{ display: selected && mobileView === "map" ? "none" : undefined }}>
        <div className="flex rounded-full border bg-card p-1 shadow-lift">
          <button type="button" onClick={() => setMobileView("map")} aria-pressed={mobileView === "map"} className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold", mobileView === "map" && "bg-primary text-primary-foreground")}><MapIcon className="h-3.5 w-3.5" />Map</button>
          <button type="button" onClick={() => setMobileView("list")} aria-pressed={mobileView === "list"} className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold", mobileView === "list" && "bg-primary text-primary-foreground")}><List className="h-3.5 w-3.5" />List · {filtered.length}</button>
        </div>
      </div>

      <Dialog open={sheetOpen && !!selected} onOpenChange={setSheetOpen}>
        <DialogContent side="bottom" className="p-0 lg:hidden">
          <DialogTitle className="sr-only">Bus details</DialogTitle>
          <DialogDescription className="sr-only">Simulated details for the selected bus</DialogDescription>
          {selected && <BusDetailsPanel bus={selected} onStopClick={(id) => { setSheetOpen(false); selectStop(id); }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToggleChip({ on, onClick, icon, children }: { on: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium transition", on ? "border-brand bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:bg-muted")}>
      {icon}{children}
    </button>
  );
}

function MapLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute bottom-6 right-3 z-[400] max-lg:hidden">
      {open ? (
        <div className="w-52 rounded-xl border bg-card p-3 text-xs shadow-lift">
          <div className="mb-2 flex items-center justify-between font-semibold">Legend <button type="button" onClick={() => setOpen(false)} aria-label="Hide legend"><X className="h-3.5 w-3.5" /></button></div>
          <div className="space-y-1.5">
            {OPERATOR_CODES.map((c) => <div key={c}><OperatorBadge code={c} /></div>)}
            <div className="flex items-center gap-2 pt-1 text-muted-foreground"><span className="h-0 w-6 border-t-[3px]" /> City route</div>
            <div className="flex items-center gap-2 text-muted-foreground"><span className="h-0 w-6 border-t-[3px] border-dashed" /> Intercity route</div>
            <div className="flex items-center gap-2 text-muted-foreground"><span className="h-3 w-3 rounded-full border-2 border-navy-900 bg-white dark:border-slate-300" /> Bus stop</div>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="shadow-soft">Legend</Button>
      )}
    </div>
  );
}
