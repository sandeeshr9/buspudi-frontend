import { AlertTriangle, Ban, CircleAlert, Clock3, Route as RouteIcon, Signpost } from "lucide-react";
import { Link } from "react-router-dom";
import { OperatorBadge, RouteChip } from "@/components/common/Badges";
import { Badge } from "@/components/ui/badge";
import { ROUTE_MAP } from "@/data/routes";
import { relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { AlertType, ServiceAlert } from "@/types";

export const ALERT_TYPE_META: Record<AlertType, { label: string; icon: typeof Ban }> = {
  delay: { label: "Delay", icon: Clock3 },
  diversion: { label: "Diversion", icon: RouteIcon },
  cancellation: { label: "Cancelled", icon: Ban },
  "stop-change": { label: "Stop change", icon: Signpost },
};

const SEV = {
  high: { label: "High", cls: "border-l-destructive", badge: "destructive" as const, icon: AlertTriangle },
  medium: { label: "Medium", cls: "border-l-warning", badge: "warning" as const, icon: CircleAlert },
  low: { label: "Low", cls: "border-l-brand", badge: "brand" as const, icon: CircleAlert },
};

export function ServiceAlertCard({ alert, compact, now = Date.now() }: { alert: ServiceAlert; compact?: boolean; now?: number }) {
  const t = ALERT_TYPE_META[alert.type];
  const s = SEV[alert.severity];
  const Icon = t.icon;
  return (
    <article className={cn("rounded-xl border border-l-4 bg-card p-4", s.cls)}>
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={s.badge}>{s.label} severity</Badge>
            <Badge variant="secondary">{t.label}</Badge>
            <OperatorBadge code={alert.operator} />
          </div>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug">{alert.title}</h3>
          {!compact && <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {alert.routeIds.map((rid) => <RouteChip key={rid} number={ROUTE_MAP[rid].number} code={ROUTE_MAP[rid].operator} className="h-5 min-w-0 px-1.5 text-[10px]" />)}
            <span className="text-[11px] text-muted-foreground">Started {relativeTime(alert.startsAt, now)} · Updated {relativeTime(alert.updatedAt, now)}</span>
          </div>
          {!compact && alert.alternatives.length > 0 && (
            <div className="mt-3 rounded-lg bg-muted/60 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Suggested alternative</p>
              {alert.alternatives.map((a, i) => (
                <div key={i} className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span>{a.label}</span>
                  {a.from && a.to && <Link to={`/app/plan?from=${a.from}&to=${a.to}`} className="text-xs font-medium text-brand hover:underline">Plan this journey →</Link>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
