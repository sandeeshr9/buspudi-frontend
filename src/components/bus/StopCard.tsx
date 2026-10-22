import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { RouteChip } from "@/components/common/Badges";
import { useApp } from "@/context/AppContext";
import { routesAtStop } from "@/lib/departures";
import { formatKm } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { Stop } from "@/types";

export function StopCard({ stop, distanceKm, onSelect, selected, className }: { stop: Stop; distanceKm?: number; onSelect?: (id: string) => void; selected?: boolean; className?: string }) {
  const { favouriteStops, toggleFavouriteStop } = useApp();
  const fav = favouriteStops.includes(stop.id);
  const routes = routesAtStop(stop.id);
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border bg-card p-3.5 transition hover:border-brand/40", selected && "border-brand ring-1 ring-brand", className)}>
      <button type="button" onClick={() => onSelect?.(stop.id)} className="flex min-w-0 flex-1 items-start gap-3 text-left focus-visible:outline-none" aria-label={`View stop ${stop.name}`}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><MapPin className="h-4 w-4" /></span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{stop.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {stop.area}{distanceKm != null ? ` · ${formatKm(distanceKm)} away` : ""}{stop.type !== "stop" ? ` · ${stop.type === "terminus" ? "Terminus" : "Depot"}` : ""}
          </span>
          <span className="mt-2 flex flex-wrap gap-1">
            {routes.slice(0, 5).map((r) => <RouteChip key={r.id} number={r.number} code={r.operator} className="h-5 min-w-0 px-1.5 text-[10px]" />)}
            {routes.length > 5 && <span className="text-[11px] text-muted-foreground">+{routes.length - 5}</span>}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => { const added = toggleFavouriteStop(stop.id); toast.success(added ? `${stop.name} added to favourites` : `${stop.name} removed from favourites`); }}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${stop.name} from favourites` : `Add ${stop.name} to favourites`}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md hover:bg-muted"
      >
        <Heart className={cn("h-4 w-4", fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
      </button>
    </div>
  );
}
