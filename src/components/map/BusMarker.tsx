import L from "leaflet";
import { memo, useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { OPERATORS } from "@/data/operators";
import type { LiveBus } from "@/types";

interface Props {
  bus: LiveBus;
  selected?: boolean;
  dimmed?: boolean;
  onSelect?: (id: string) => void;
}

function iconHtml(num: string, color: string, bearing: number, selected: boolean, inactive: boolean, dimmed: boolean) {
  const c = inactive ? "#94a3b8" : color;
  const ring = selected ? `<span style="position:absolute;inset:-6px;border-radius:999px;border:2px solid ${c};opacity:.5" class="animate-ping2"></span>` : "";
  return `
  <div class="bm" style="position:relative;display:flex;align-items:center;gap:0;opacity:${dimmed ? 0.35 : 1};filter:drop-shadow(0 2px 4px rgba(11,27,58,.25))">
    <div style="position:relative;width:26px;height:26px">
      ${ring}
      <div style="position:absolute;inset:0;border-radius:999px;background:${c};border:2.5px solid #fff;display:grid;place-items:center">
        <svg width="12" height="12" viewBox="0 0 24 24" style="transform:rotate(${bearing}deg)"><path d="M12 3l7 17-7-4-7 4z" fill="#fff"/></svg>
      </div>
    </div>
    <div style="margin-left:-4px;padding:1px 6px 1px 8px;border-radius:0 6px 6px 0;background:${selected ? c : "#fff"};color:${selected ? "#fff" : c};font:700 11px/16px 'Plus Jakarta Sans',Inter,sans-serif;white-space:nowrap;border:1.5px solid ${c}">${num}</div>
  </div>`;
}

export const BusMarker = memo(function BusMarker({ bus, selected = false, dimmed = false, onSelect }: Props) {
  const color = OPERATORS[bus.route.operator].color;
  const inactive = bus.state.status === "not-in-service";
  const b = Math.round(bus.bearing / 15) * 15;
  const icon = useMemo(
    () => L.divIcon({ className: "bus-marker", html: iconHtml(bus.route.number, color, b, selected, inactive, dimmed), iconSize: [72, 26], iconAnchor: [13, 13] }),
    [bus.route.number, color, b, selected, inactive, dimmed]
  );
  return (
    <Marker
      position={bus.position}
      icon={icon}
      zIndexOffset={selected ? 1000 : dimmed ? -500 : 0}
      keyboard
      title={`Bus ${bus.route.number} to ${bus.destinationStop.name}`}
      alt={`Bus ${bus.route.number}`}
      eventHandlers={{ click: () => onSelect?.(bus.id), keypress: (e) => { if ((e.originalEvent as KeyboardEvent).key === "Enter") onSelect?.(bus.id); } }}
    >
      <Tooltip direction="top" offset={[0, -14]} className="bp-tip">
        <strong>{bus.route.number}</strong> → {bus.destinationStop.name}
        <br />
        <span style={{ opacity: 0.7 }}>Demo position · next: {bus.nextStop.name}</span>
      </Tooltip>
    </Marker>
  );
});
