import { cn } from "@/lib/utils";
import { formatDuration, formatTime } from "@/lib/time";
import type { Stop } from "@/types";

export interface TimelineItem {
  stop: Stop;
  passed?: boolean;
  current?: boolean;
  etaMins?: number;
  time?: number;
  note?: string;
}

/** Vertical list of stops with progress state. */
export function RouteTimeline({ items, color = "hsl(var(--brand))", onStopClick, className }: { items: TimelineItem[]; color?: string; onStopClick?: (id: string) => void; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const first = i === 0;
        return (
          <li key={it.stop.id + i} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                className="absolute left-[9px] top-5 w-[3px] rounded-full"
                style={{ bottom: -2, backgroundColor: it.passed ? color : "hsl(var(--border))" }}
                aria-hidden
              />
            )}
            <span
              className={cn("relative z-[1] mt-0.5 grid h-[21px] w-[21px] shrink-0 place-items-center rounded-full border-[3px] bg-card", it.current && "ring-4 ring-brand/20")}
              style={{ borderColor: it.passed || it.current || first || last ? color : "hsl(var(--border))" }}
              aria-hidden
            >
              {(it.current || last) && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />}
            </span>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
              <div className="min-w-0">
                {onStopClick ? (
                  <button type="button" onClick={() => onStopClick(it.stop.id)} className={cn("truncate text-left text-sm font-medium hover:text-brand hover:underline", it.passed && "text-muted-foreground")}>
                    {it.stop.name}
                  </button>
                ) : (
                  <p className={cn("truncate text-sm font-medium", it.passed && "text-muted-foreground")}>{it.stop.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {it.current ? <span className="font-medium text-brand">Next stop</span> : it.passed ? "Passed" : it.stop.area}
                  {it.note ? ` · ${it.note}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {it.etaMins != null && !it.passed && <p className="text-sm font-semibold tabular">{formatDuration(it.etaMins)}</p>}
                {it.time != null && <p className="text-xs text-muted-foreground tabular">{formatTime(it.time)}</p>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
