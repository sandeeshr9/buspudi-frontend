import { Database, Info, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { DemoBadge, InfoNote, OperatorBadge, RouteChip } from "@/components/common/Badges";
import { OCCUPANCY_META, OccupancyIndicator } from "@/components/common/OccupancyIndicator";
import { OperatorFilter } from "@/components/common/OperatorFilter";
import { EmptyState, PageHeader } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulation } from "@/context/SimulationContext";
import { useNow } from "@/hooks/useNow";
import { formatTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { OccupancyLevel, OperatorCode } from "@/types";

const LEVELS: OccupancyLevel[] = ["available", "moderate", "crowded", "full"];

export default function OccupancyPage() {
  const { buses, lastTick } = useSimulation();
  const navigate = useNavigate();
  useNow(5000);
  const [ops, setOps] = useState<OperatorCode[]>([]);
  const [level, setLevel] = useState<OccupancyLevel | null>(null);

  const active = useMemo(() => buses.filter((b) => b.state.status !== "not-in-service" && (!ops.length || ops.includes(b.route.operator))), [buses, ops]);
  const counts = useMemo(() => Object.fromEntries(LEVELS.map((l) => [l, active.filter((b) => b.occupancy === l).length])) as Record<OccupancyLevel, number>, [active]);
  const rows = useMemo(() => active.filter((b) => !level || b.occupancy === level).sort((a, b) => b.state.occupancyPct - a.state.occupancyPct), [active, level]);

  // Capacity comparison by vehicle type (sample capacities vs. estimated riders).
  const capacityData = useMemo(() => {
    const groups = new Map<string, { type: string; capacity: number; riders: number; n: number }>();
    active.forEach((b) => {
      const g = groups.get(b.vehicle.vehicleType) ?? { type: b.vehicle.vehicleType, capacity: 0, riders: 0, n: 0 };
      g.capacity += b.vehicle.capacity;
      g.riders += (b.vehicle.capacity * b.state.occupancyPct) / 100;
      g.n += 1;
      groups.set(b.vehicle.vehicleType, g);
    });
    return [...groups.values()].map((g) => ({ type: g.type.replace(" coach", "").replace(" (sample)", ""), "Capacity (avg)": Math.round(g.capacity / g.n), "Est. on board (avg)": Math.round(g.riders / g.n) }));
  }, [active]);

  return (
    <div className="space-y-6">
      <PageHeader title="Occupancy estimates" description="How busy buses might be, shown as simple categories." badge={<DemoBadge label="Demo estimates" />} />

      <Card className="border-warning/40">
        <CardContent className="flex gap-3 p-4 text-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="space-y-1">
            <p className="font-semibold">These are demo estimates, not measurements.</p>
            <p className="text-muted-foreground">Real occupancy needs reliable boarding and alighting counts (for example, door sensors or automatic passenger counters) or occupancy data published by the operator. Ticket sales alone don't establish how many people are on board right now, because passengers get off along the way and some travel on passes.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {LEVELS.map((l) => {
          const m = OCCUPANCY_META[l];
          return (
            <button key={l} type="button" onClick={() => setLevel(level === l ? null : l)} aria-pressed={level === l} className={cn("rounded-xl border bg-card p-4 text-left shadow-soft transition hover:border-brand/40", level === l && "border-brand ring-1 ring-brand")}>
              <OccupancyIndicator level={l} />
              <p className="mt-2 font-display text-2xl font-bold tabular">{counts[l]}</p>
              <p className="text-xs text-muted-foreground">buses · {l === "available" ? "< 45%" : l === "moderate" ? "45–74%" : l === "crowded" ? "75–96%" : "≥ 97%"}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${active.length ? (counts[l] / active.length) * 100 : 0}%`, backgroundColor: m.color }} /></div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <OperatorFilter selected={ops} onChange={setOps} />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Database className="h-3.5 w-3.5" /> Source: BusPudi simulation · as of {formatTime(lastTick)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Capacity comparison</CardTitle>
            <p className="text-xs text-muted-foreground">Average sample capacity vs estimated passengers on board, by vehicle type</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            {capacityData.length === 0 ? <EmptyState icon={Users} title="No buses for this filter" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <RTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Capacity (avg)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Est. on board (avg)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Buses {level ? `· ${OCCUPANCY_META[level].label}` : ""}</CardTitle>
            <span className="text-xs text-muted-foreground">{rows.length} shown</span>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? <EmptyState icon={Users} title="No buses in this category" description="Change the category or operator filter." /> : (
              <ul className="max-h-[360px] divide-y overflow-y-auto pr-1 scrollbar-thin">
                {rows.map((b) => (
                  <li key={b.id}>
                    <button type="button" onClick={() => navigate(`/app/bus/${b.id}`)} className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-muted/50">
                      <RouteChip number={b.route.number} code={b.route.operator} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">to {b.destinationStop.name}</p>
                        <p className="flex items-center gap-2 text-xs text-muted-foreground"><OperatorBadge code={b.route.operator} /> {b.vehicle.vehicleType} · cap. {b.vehicle.capacity}</p>
                      </div>
                      <div className="w-28 text-right">
                        <OccupancyIndicator level={b.occupancy} compact />
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${b.state.occupancyPct}%`, backgroundColor: OCCUPANCY_META[b.occupancy].color }} /></div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground tabular">~{b.state.occupancyPct}%</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <InfoNote>Category thresholds used in this demo: Available under 45%, Moderate 45–74%, Crowded 75–96%, Full 97% and above of the sample capacity.</InfoNote>
    </div>
  );
}
