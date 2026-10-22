import L, { type LatLngBoundsExpression, type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, Layers, LocateFixed, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";
import { useApp } from "@/context/AppContext";
import { OPERATORS } from "@/data/operators";
import { ROUTE_MAP } from "@/data/routes";
import { CHENNAI_CENTER } from "@/data/stops";
import { routePolyline } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import type { LiveBus, Stop } from "@/types";
import { BusMarker } from "./BusMarker";

export interface MapLine {
  id: string;
  points: [number, number][];
  color: string;
  dashed?: boolean;
  weight?: number;
}

interface Props {
  buses?: LiveBus[];
  selectedBusId?: string | null;
  onSelectBus?: (id: string) => void;
  /** Routes whose geometry should be drawn. */
  routeIds?: string[];
  highlightRouteId?: string | null;
  extraLines?: MapLine[];
  stops?: Stop[];
  highlightStopIds?: string[];
  onSelectStop?: (id: string) => void;
  /** Bounds to fit when they change (and when recentering). */
  fitPoints?: [number, number][];
  userLocation?: [number, number] | null;
  onLocate?: () => void;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
  initialZoom?: number;
  children?: ReactNode;
  /** When true, the map pans to follow the selected bus. */
  follow?: boolean;
}

const TILES = {
  light: { url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' },
  dark: { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' },
  osm: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
};

export function BusMap({
  buses = [], selectedBusId, onSelectBus, routeIds = [], highlightRouteId, extraLines = [], stops = [], highlightStopIds = [],
  onSelectStop, fitPoints, userLocation, onLocate, className, interactive = true, showControls = true, initialZoom = 12, children, follow,
}: Props) {
  const { resolvedTheme, settings } = useApp();
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [layer, setLayer] = useState<"auto" | "osm">(settings.accessibility.highContrastMap ? "osm" : "auto");
  useEffect(() => setLayer(settings.accessibility.highContrastMap ? "osm" : "auto"), [settings.accessibility.highContrastMap]);
  const tiles = layer === "osm" ? TILES.osm : TILES[resolvedTheme];

  const fitKey = fitPoints?.map((p) => p.join(",")).join("|") ?? "";
  const bounds = useMemo<LatLngBoundsExpression | null>(() => (fitPoints && fitPoints.length > 1 ? L.latLngBounds(fitPoints) : null), [fitKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Leaflet can't animate while its container is hidden (size 0) — it produces
  // NaN coordinates. Defer such moves until the map becomes visible again.
  const pending = useRef<(() => void) | null>(null);
  const run = (fn: () => void) => {
    if (!map) return;
    const size = map.getSize();
    if (!size.x || !size.y) { pending.current = fn; return; }
    try { fn(); } catch { /* ignore transient Leaflet animation errors */ }
  };

  const fitView = (animate: boolean) => run(() => {
    if (!map) return;
    if (bounds) animate ? map.flyToBounds(bounds, { padding: [40, 40], duration: 0.6, maxZoom: 14 }) : map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    else if (fitPoints?.length === 1) animate ? map.flyTo(fitPoints[0], 14, { duration: 0.6 }) : map.setView(fitPoints[0], 14);
  });

  const recenter = () => {
    if (bounds || fitPoints?.length === 1) fitView(true);
    else run(() => map?.flyTo(CHENNAI_CENTER, initialZoom, { duration: 0.6 }));
  };

  useEffect(() => { if (bounds || fitPoints?.length === 1) fitView(true); }, [map, fitKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = selectedBusId ? buses.find((b) => b.id === selectedBusId) : undefined;
  useEffect(() => {
    if (!map || !follow || !selected) return;
    const size = map.getSize();
    if (!size.x || !size.y) return;
    if (!map.getBounds().pad(-0.15).contains(selected.position)) run(() => map.panTo(selected.position, { animate: true, duration: 0.8 }));
  }, [map, follow, selected?.position[0], selected?.position[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!map) return;
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
      const size = map.getSize();
      if (size.x && size.y && pending.current) {
        const fn = pending.current;
        pending.current = null;
        try { fn(); } catch { /* ignore */ }
      }
    });
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);

  const highlightSet = new Set(highlightStopIds);

  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <MapContainer
        ref={setMap}
        center={CHENNAI_CENTER}
        zoom={initialZoom}
        zoomControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        keyboard={interactive}
        className="h-full w-full"
        attributionControl
      >
        <TileLayer key={tiles.url} url={tiles.url} attribution={tiles.attr} subdomains={layer === "osm" ? "abc" : "abcd"} maxZoom={19} />

        {routeIds.map((rid) => {
          const r = ROUTE_MAP[rid];
          if (!r) return null;
          const hl = !highlightRouteId || highlightRouteId === rid;
          return (
            <Polyline
              key={rid + (hl ? "-hl" : "")}
              positions={routePolyline(rid).points}
              pathOptions={{ color: OPERATORS[r.operator].color, weight: highlightRouteId === rid ? 5 : 3.5, opacity: hl ? 0.85 : 0.18, lineCap: "round", lineJoin: "round", dashArray: r.intercity ? "8 6" : undefined }}
            />
          );
        })}
        {extraLines.map((l) => (
          <Polyline key={l.id} positions={l.points} pathOptions={{ color: l.color, weight: l.weight ?? 5, opacity: 0.9, dashArray: l.dashed ? "6 8" : undefined, lineCap: "round" }} />
        ))}

        {stops.map((s) => {
          const hl = highlightSet.has(s.id);
          return (
            <CircleMarker
              key={s.id + (hl ? "-h" : "")}
              center={[s.lat, s.lng]}
              radius={hl ? 7 : s.type === "stop" ? 4.5 : 6}
              pathOptions={{ color: hl ? "#0d9488" : "#0b1b3a", weight: hl ? 3 : 2, fillColor: "#fff", fillOpacity: 1 }}
              eventHandlers={onSelectStop ? { click: () => onSelectStop(s.id) } : undefined}
            >
              <Tooltip direction="top" offset={[0, -6]} className="bp-tip">
                <strong>{s.name}</strong>
                {s.type !== "stop" && <span style={{ opacity: 0.7 }}> · {s.type === "terminus" ? "Terminus" : "Depot"}</span>}
              </Tooltip>
            </CircleMarker>
          );
        })}

        {userLocation && (
          <>
            <CircleMarker center={userLocation} radius={16} pathOptions={{ color: "#2563eb", weight: 0, fillColor: "#3b82f6", fillOpacity: 0.15 }} />
            <CircleMarker center={userLocation} radius={6} pathOptions={{ color: "#fff", weight: 2.5, fillColor: "#2563eb", fillOpacity: 1 }}>
              <Tooltip direction="top" className="bp-tip">Your location</Tooltip>
            </CircleMarker>
          </>
        )}

        {buses.map((b) => (
          <BusMarker key={b.id} bus={b} selected={b.id === selectedBusId} dimmed={!!highlightRouteId && b.route.id !== highlightRouteId} onSelect={onSelectBus} />
        ))}
      </MapContainer>

      {showControls && (
        <div className="absolute right-3 top-3 z-[400] flex flex-col gap-1.5">
          <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-soft">
            <button type="button" onClick={() => map?.zoomIn()} className="grid h-9 w-9 place-items-center hover:bg-muted" aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
            <span className="h-px bg-border" />
            <button type="button" onClick={() => map?.zoomOut()} className="grid h-9 w-9 place-items-center hover:bg-muted" aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
          </div>
          <button type="button" onClick={recenter} className="grid h-9 w-9 place-items-center rounded-lg border bg-card shadow-soft hover:bg-muted" aria-label="Recenter map" title="Recenter"><Crosshair className="h-4 w-4" /></button>
          {onLocate && <button type="button" onClick={onLocate} className="grid h-9 w-9 place-items-center rounded-lg border bg-card shadow-soft hover:bg-muted" aria-label="Show my location" title="My location"><LocateFixed className="h-4 w-4" /></button>}
          <button type="button" onClick={() => setLayer((l) => (l === "osm" ? "auto" : "osm"))} aria-pressed={layer === "osm"} className={cn("grid h-9 w-9 place-items-center rounded-lg border bg-card shadow-soft hover:bg-muted", layer === "osm" && "text-brand")} aria-label="Toggle detailed map style" title={layer === "osm" ? "Switch to clean map" : "Switch to detailed OSM map"}><Layers className="h-4 w-4" /></button>
        </div>
      )}
      {children}
    </div>
  );
}
