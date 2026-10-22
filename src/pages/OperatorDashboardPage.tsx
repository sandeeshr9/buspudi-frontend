import { Activity, AlertTriangle, ArrowLeft, Bus, CircleSlash, Clock, FlaskConical, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { ServiceAlertCard } from "@/components/bus/ServiceAlertCard";
import { RouteChip, StatusPill } from "@/components/common/Badges";
import { Logo } from "@/components/common/Logo";
import { OCCUPANCY_META, OccupancyIndicator } from "@/components/common/OccupancyIndicator";
import { SearchBar } from "@/components/common/SearchBar";
import { EmptyState, StatCard } from "@/components/common/States";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BusMap } from "@/components/map/BusMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulation } from "@/context/SimulationContext";
import { ALERTS } from "@/data/alerts";
import { OPERATORS, OPERATOR_LIST } from "@/data/operators";
import { ROUTES, ROUTE_MAP } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { useNow } from "@/hooks/useNow";
import { departuresForStop } from "@/lib/departures";
import { formatTime, relativeTime } from "@/lib/time";
import type { OccupancyLevel, OperatorCode } from "@/types";

const TERMINI = ["cmbt", "kilambakkam", "broadway", "tambaram", "tnagar"];
const tooltipStyle = { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

export default function OperatorDashboardPage() {
  const { buses, lastTick } = useSimulation();
  const now = useNow(5000);
  const [op, setOp] = useState<"ALL" | OperatorCode>("ALL");
  const [statusTab, setStatusTab] = useState<"all" | "active" | "delayed" | "inactive">("all");
  const [query, setQuery] = useState("");
  const [terminus, setTerminus] = useState("cmbt");

  const fleet = useMemo(() => buses.filter((b) => op === "ALL" || b.route.operator === op), [buses, op]);
  const active = fleet.filter((b) => b.state.status !== "not-in-service");
  const inactive = fleet.length - active.length;
  const delayed = active.filter((b) => b.state.delayMins > 0);
  const onTimePct = active.length ? Math.round(((active.length - delayed.length) / active.length) * 100) : 0;
  const avgOcc = active.length ? Math.round(active.reduce((a, b) => a + b.state.occupancyPct, 0) / active.length) : 0;
  const alerts = ALERTS.filter((a) => op === "ALL" || a.operator === op);

  const byOperator = OPERATOR_LIST.filter((o) => op === "ALL" || o.code === op).map((o) => {
    const f = buses.filter((b) => b.route.operator === o.code);
    return {
      name: o.shortName,
      "On time": f.filter((b) => b.state.status !== "not-in-service" && b.state.delayMins === 0).length,
      Delayed: f.filter((b) => b.state.status !== "not-in-service" && b.state.delayMins > 0).length,
      Inactive: f.filter((b) => b.state.status === "not-in-service").length,
    };
  });
  const occData = (["available", "moderate", "crowded", "full"] as OccupancyLevel[]).map((l) => ({ name: OCCUPANCY_META[l].label, value: active.filter((b) => b.occupancy === l).length, color: OCCUPANCY_META[l].color }));

  const routeStatus = ROUTES.filter((r) => op === "ALL" || r.operator === op).map((r) => {
    const rb = buses.filter((b) => b.route.id === r.id);
    const act = rb.filter((b) => b.state.status !== "not-in-service");
    const avgDelay = act.length ? Math.round(act.reduce((a, b) => a + b.state.delayMins, 0) / act.length) : 0;
    const hasHigh = ALERTS.some((a) => a.routeIds.includes(r.id) && a.severity === "high");
    const status = hasHigh ? "Disrupted" : avgDelay > 4 ? "Delays" : act.length === 0 ? "No service" : "Normal";
    return { r, total: rb.length, active: act.length, avgDelay, status };
  });

  const table = fleet.filter((b) => {
    if (statusTab === "active" && b.state.status === "not-in-service") return false;
    if (statusTab === "delayed" && !(b.state.delayMins > 0 && b.state.status !== "not-in-service")) return false;
    if (statusTab === "inactive" && b.state.status !== "not-in-service") return false;
    const q = query.trim().toLowerCase();
    return !q || [b.vehicle.label, b.route.number, b.route.name].some((v) => v.toLowerCase().includes(q));
  });

  const deps = useMemo(() => departuresForStop(terminus, buses, now, 60).filter((d) => d.kind !== "confirmed" && (op === "ALL" || ROUTE_MAP[d.routeId].operator === op)).slice(0, 8), [terminus, now, op]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-[500] border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Logo to="/" />
          <Badge variant="outline" className="hidden sm:inline-flex">Operator console · Preview</Badge>
          <div className="ml-auto flex items-center gap-2">
            <Select value={op} onValueChange={(v) => setOp(v as typeof op)}>
              <SelectTrigger className="h-9 w-[150px] sm:w-[190px]" aria-label="Operator"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All operators</SelectItem>
                {OPERATOR_LIST.map((o) => <SelectItem key={o.code} value={o.code}>{o.shortName} fleet</SelectItem>)}
              </SelectContent>
            </Select>
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex"><Link to="/app"><ArrowLeft /> Passenger app</Link></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fleet overview</h1>
            <p className="text-sm text-muted-foreground">{op === "ALL" ? "All operator categories" : OPERATORS[op].name} · updated {relativeTime(lastTick, now)}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-warning/50 bg-warning/10 px-3 py-2 text-xs">
            <FlaskConical className="h-4 w-4 text-warning" /> Visual demonstration with mock data — not a fleet management system.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard icon={Activity} label="Active buses" value={active.length} hint={`of ${fleet.length} in fleet`} tone="success" />
          <StatCard icon={CircleSlash} label="Inactive" value={inactive} hint="Parked / not in service" tone="muted" />
          <StatCard icon={Clock} label="On time" value={`${onTimePct}%`} hint={`${delayed.length} delayed`} tone={onTimePct > 80 ? "brand" : "warning"} />
          <StatCard icon={Users} label="Avg occupancy" value={`${avgOcc}%`} hint="Demo estimate" tone="brand" />
          <StatCard icon={AlertTriangle} label="Active alerts" value={alerts.length} hint={`${alerts.filter((a) => a.severity === "high").length} high severity`} tone="destructive" className="col-span-2 md:col-span-1" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between"><CardTitle>Live fleet map</CardTitle><Badge variant="demo">Simulated</Badge></CardHeader>
            <BusMap className="h-[360px]" buses={fleet} routeIds={[...new Set(fleet.map((b) => b.route.id))]} />
          </Card>
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>Fleet status by operator</CardTitle></CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byOperator} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <RTooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="On time" stackId="a" fill="#0d9488" />
                    <Bar dataKey="Delayed" stackId="a" fill="#d97706" />
                    <Bar dataKey="Inactive" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Occupancy overview</CardTitle></CardHeader>
              <CardContent className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occData} layout="vertical" margin={{ left: 10, right: 16 }}>
                    <XAxis type="number" allowDecimals={false} hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <RTooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} formatter={(v) => [`${v} buses`, "Count"]} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}>
                      {occData.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Route status</CardTitle></CardHeader>
            <CardContent>
              <ul className="max-h-[340px] divide-y overflow-y-auto pr-1 scrollbar-thin">
                {routeStatus.map(({ r, total, active: a, avgDelay, status }) => (
                  <li key={r.id} className="flex items-center gap-3 py-2.5">
                    <RouteChip number={r.number} code={r.operator} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{a}/{total} running · avg delay {avgDelay} min · every {r.frequencyMins} min</p>
                    </div>
                    <Badge variant={status === "Normal" ? "success" : status === "Delays" ? "warning" : status === "Disrupted" ? "destructive" : "secondary"}>{status}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
              <CardTitle>Scheduled departures</CardTitle>
              <Select value={terminus} onValueChange={setTerminus}>
                <SelectTrigger className="h-8 w-[190px] text-xs" aria-label="Terminus"><SelectValue /></SelectTrigger>
                <SelectContent>{TERMINI.map((t) => <SelectItem key={t} value={t}>{STOP_MAP[t].name}</SelectItem>)}</SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {deps.length === 0 ? <EmptyState icon={Clock} title="No departures in the next hour" /> : (
                <ul className="divide-y">
                  {deps.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <span className="w-16 font-semibold tabular">{formatTime(d.scheduledAt)}</span>
                      <RouteChip number={ROUTE_MAP[d.routeId].number} code={ROUTE_MAP[d.routeId].operator} className="h-6 text-xs" />
                      <span className="min-w-0 flex-1 truncate">to {STOP_MAP[d.towardsStopId].name}</span>
                      <span className="text-xs text-muted-foreground">{d.bay ?? ""}</span>
                      <Badge variant={d.kind === "tracked" ? "brand" : "secondary"}>{d.kind === "tracked" ? "Vehicle assigned" : "Scheduled"}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2"><Bus className="h-4 w-4 text-brand" /> Vehicles</CardTitle>
              <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
                <TabsList className="h-9">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                  <TabsTrigger value="delayed" className="text-xs">Delayed</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-xs">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <SearchBar value={query} onChange={setQuery} placeholder="Search vehicle ID or route" label="Search vehicles" className="max-w-sm" />
          </CardHeader>
          <CardContent>
            {table.length === 0 ? <EmptyState icon={Bus} title="No vehicles match" /> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead><tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Vehicle (demo)</th><th className="py-2 pr-3 font-medium">Route</th><th className="py-2 pr-3 font-medium">Status</th><th className="py-2 pr-3 font-medium">Next stop</th><th className="py-2 pr-3 font-medium">Occupancy</th><th className="py-2 font-medium">Last report</th>
                  </tr></thead>
                  <tbody>
                    {table.map((b) => (
                      <tr key={b.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-3"><Link to={`/app/bus/${b.id}`} className="font-medium hover:text-brand hover:underline">{b.vehicle.label}</Link><p className="text-[11px] text-muted-foreground">{b.vehicle.vehicleType}</p></td>
                        <td className="py-2.5 pr-3"><span className="flex items-center gap-2"><RouteChip number={b.route.number} code={b.route.operator} className="h-6 text-xs" /><span className="hidden truncate text-xs text-muted-foreground xl:inline">{b.route.name}</span></span></td>
                        <td className="py-2.5 pr-3"><StatusPill status={b.state.status} delayMins={b.state.delayMins} /></td>
                        <td className="py-2.5 pr-3">{b.state.status === "not-in-service" ? "—" : b.nextStop.name}</td>
                        <td className="py-2.5 pr-3">{b.state.status === "not-in-service" ? "—" : <OccupancyIndicator level={b.occupancy} pct={b.state.occupancyPct} />}</td>
                        <td className="py-2.5 text-xs text-muted-foreground tabular">{relativeTime(b.state.lastUpdated, now)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-lg font-bold">Service alerts</h2>
          <div className="grid gap-3 md:grid-cols-2">{alerts.length ? alerts.map((a) => <ServiceAlertCard key={a.id} alert={a} now={now} />) : <EmptyState title="No alerts for this operator" />}</div>
        </div>
      </main>
    </div>
  );
}
