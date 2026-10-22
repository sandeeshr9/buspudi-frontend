import { FlaskConical, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/misc";
import { OPERATORS } from "@/data/operators";
import { cn } from "@/lib/utils";
import type { AccessStatus, BusStatus, OperatorCode } from "@/types";

export function DemoBadge({ className, label = "Demo data" }: { className?: string; label?: string }) {
  return (
    <Tooltip content="Simulated sample information for demonstration. Not real-time operator data.">
      <Badge variant="demo" className={cn("cursor-help", className)} tabIndex={0}>
        <FlaskConical /> {label}
      </Badge>
    </Tooltip>
  );
}

export function OperatorBadge({ code, className }: { code: OperatorCode; className?: string }) {
  const op = OPERATORS[code];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold", className)} style={{ color: op.color, backgroundColor: op.color + "1a" }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: op.color }} />
      {op.shortName}
    </span>
  );
}

export function RouteChip({ number, code, className }: { number: string; code: OperatorCode; className?: string }) {
  return (
    <span className={cn("inline-flex h-7 min-w-[2.75rem] items-center justify-center rounded-md px-2 font-display text-sm font-bold text-white tabular", className)} style={{ backgroundColor: OPERATORS[code].color }}>
      {number}
    </span>
  );
}

const STATUS: Record<BusStatus, { label: string; cls: string; dot: string }> = {
  running: { label: "On the move", cls: "text-success", dot: "bg-success" },
  "at-stop": { label: "At stop", cls: "text-brand", dot: "bg-brand" },
  delayed: { label: "Delayed", cls: "text-warning", dot: "bg-warning" },
  "not-in-service": { label: "Not in service", cls: "text-muted-foreground", dot: "bg-muted-foreground" },
};

export function StatusPill({ status, delayMins }: { status: BusStatus; delayMins?: number }) {
  const s = STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", s.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot, status !== "not-in-service" && "animate-pulse2")} />
      {s.label}
      {status === "delayed" && delayMins ? ` · +${delayMins} min` : ""}
    </span>
  );
}

const ACCESS: Record<AccessStatus, { label: string; variant: "success" | "warning" | "secondary" | "outline" }> = {
  verified: { label: "Verified", variant: "success" },
  demo: { label: "Demo · not verified", variant: "warning" },
  unknown: { label: "Unknown", variant: "secondary" },
  "not-available": { label: "Not available", variant: "outline" },
};

export function AccessBadge({ status }: { status: AccessStatus }) {
  const a = ACCESS[status];
  return <Badge variant={a.variant}>{a.label}</Badge>;
}

export function InfoNote({ children, className, tone = "info" }: { children: React.ReactNode; className?: string; tone?: "info" | "warning" }) {
  return (
    <div className={cn("flex gap-2.5 rounded-lg border px-3 py-2.5 text-xs leading-relaxed", tone === "info" ? "border-brand/25 bg-accent/60 text-accent-foreground" : "border-warning/30 bg-warning/10 text-foreground", className)}>
      <Info className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", tone === "warning" && "text-warning")} />
      <div>{children}</div>
    </div>
  );
}
