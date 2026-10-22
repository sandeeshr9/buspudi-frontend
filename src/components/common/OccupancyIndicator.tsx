import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OccupancyLevel } from "@/types";

export const OCCUPANCY_META: Record<OccupancyLevel, { label: string; color: string; bars: number; text: string }> = {
  available: { label: "Seats available", color: "#16a34a", bars: 1, text: "text-success" },
  moderate: { label: "Moderate", color: "#0d9488", bars: 2, text: "text-brand" },
  crowded: { label: "Crowded", color: "#d97706", bars: 3, text: "text-warning" },
  full: { label: "Full", color: "#dc2626", bars: 4, text: "text-destructive" },
};

export function OccupancyIndicator({ level, pct, compact, className }: { level: OccupancyLevel; pct?: number; compact?: boolean; className?: string }) {
  const m = OCCUPANCY_META[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", m.text, className)} aria-label={`Estimated occupancy: ${m.label}${pct != null ? `, about ${pct}%` : ""} (demo estimate)`}>
      <Users className="h-3.5 w-3.5" aria-hidden />
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4].map((b) => (
          <span key={b} className="w-[3px] rounded-sm" style={{ height: 4 + b * 2.5, backgroundColor: b <= m.bars ? m.color : "hsl(var(--border))" }} />
        ))}
      </span>
      {!compact && <span>{m.label}</span>}
      {!compact && pct != null && <span className="text-muted-foreground tabular">~{pct}%</span>}
    </span>
  );
}
