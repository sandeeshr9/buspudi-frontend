import { BellRing, BellOff } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ALERT_TYPE_META, ServiceAlertCard } from "@/components/bus/ServiceAlertCard";
import { DemoBadge, InfoNote } from "@/components/common/Badges";
import { OperatorFilter } from "@/components/common/OperatorFilter";
import { SearchBar } from "@/components/common/SearchBar";
import { EmptyState, PageHeader, StatCard } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { ALERTS } from "@/data/alerts";
import { ROUTE_MAP } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { useNow } from "@/hooks/useNow";
import type { AlertSeverity, AlertType, OperatorCode } from "@/types";
import { AlertTriangle, Ban, Clock3, Route as RouteIcon } from "lucide-react";

const SEV_RANK: Record<AlertSeverity, number> = { high: 0, medium: 1, low: 2 };

export default function AlertsPage() {
  const { settings, updateSettings, savedRoutes } = useApp();
  const now = useNow(30000);
  const [type, setType] = useState<"all" | AlertType>("all");
  const [sev, setSev] = useState<"all" | AlertSeverity>("all");
  const [ops, setOps] = useState<OperatorCode[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"severity" | "recent">("severity");
  const [mineOnly, setMineOnly] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALERTS.filter((a) =>
      (type === "all" || a.type === type) &&
      (sev === "all" || a.severity === sev) &&
      (!ops.length || ops.includes(a.operator)) &&
      (!mineOnly || a.routeIds.some((r) => savedRoutes.includes(r))) &&
      (!q || [a.title, a.description, ...a.routeIds.map((r) => ROUTE_MAP[r].number), ...a.stopIds.map((s) => STOP_MAP[s].name)].some((v) => v.toLowerCase().includes(q)))
    ).sort((a, b) => (sort === "severity" ? SEV_RANK[a.severity] - SEV_RANK[b.severity] || b.updatedAt - a.updatedAt : b.updatedAt - a.updatedAt));
  }, [type, sev, ops, query, sort, mineOnly, savedRoutes]);

  const by = (t: AlertType) => ALERTS.filter((a) => a.type === t).length;
  const subscribed = settings.notifications.serviceAlerts;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service alerts"
        description="Delays, diversions, cancellations and stop changes across operators."
        badge={<DemoBadge label="Demonstration alerts" />}
        actions={
          <Button variant={subscribed ? "outline" : "brand"} onClick={() => { updateSettings({ notifications: { ...settings.notifications, serviceAlerts: !subscribed } }); toast.success(subscribed ? "Alert notifications turned off" : "Alert notifications turned on", { description: "Preference saved in this browser. No notifications are actually sent in the demo." }); }}>
            {subscribed ? <BellOff /> : <BellRing />} {subscribed ? "Mute alert notifications" : "Notify me of alerts"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Clock3} label="Delays" value={by("delay")} tone="warning" />
        <StatCard icon={RouteIcon} label="Diversions" value={by("diversion")} tone="brand" />
        <StatCard icon={Ban} label="Cancellations" value={by("cancellation")} tone="destructive" />
        <StatCard icon={AlertTriangle} label="High severity" value={ALERTS.filter((a) => a.severity === "high").length} tone="destructive" />
      </div>

      <div className="space-y-3">
        <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="all">All · {ALERTS.length}</TabsTrigger>
            {(Object.keys(ALERT_TYPE_META) as AlertType[]).map((t) => <TabsTrigger key={t} value={t}>{ALERT_TYPE_META[t].label} · {by(t)}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <SearchBar value={query} onChange={setQuery} placeholder="Search route, stop or keyword" label="Search alerts" />
          <Select value={sev} onValueChange={(v) => setSev(v as typeof sev)}>
            <SelectTrigger className="md:w-[160px]" aria-label="Severity"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All severities</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="md:w-[160px]" aria-label="Sort"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="severity">Most severe first</SelectItem><SelectItem value="recent">Recently updated</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <OperatorFilter selected={ops} onChange={setOps} />
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--brand))]" /> Only my saved routes
          </label>
        </div>
      </div>

      <div className="space-y-3" aria-live="polite">
        {list.length === 0 ? (
          <EmptyState
            title={mineOnly && savedRoutes.length === 0 ? "You haven't saved any routes" : "No alerts match"}
            description={mineOnly && savedRoutes.length === 0 ? <>Save a route from a <Link to="/app/track" className="text-brand underline">bus details page</Link> to filter alerts by it.</> : "Good news — nothing matches these filters right now."}
            action={<Button variant="outline" size="sm" onClick={() => { setType("all"); setSev("all"); setOps([]); setQuery(""); setMineOnly(false); }}>Reset filters</Button>}
          />
        ) : list.map((a) => <ServiceAlertCard key={a.id} alert={a} now={now} />)}
      </div>
      <InfoNote>All alerts on this page are fictional and shown for demonstration. Real alerts would come from operator feeds such as GTFS-Realtime service alerts.</InfoNote>
    </div>
  );
}
