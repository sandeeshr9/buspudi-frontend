import { Check, LocateFixed, MapPin } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { STOPS, STOP_MAP } from "@/data/stops";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  label: string;
  icon?: "origin" | "destination";
  invalid?: boolean;
  onLocate?: () => void;
  className?: string;
  hideLabel?: boolean;
}

/** Accessible combobox for picking a stop from the demo network. */
export function StopPicker({ value, onChange, placeholder = "Search a stop", label, icon = "origin", invalid, onLocate, className, hideLabel }: Props) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = value ? STOP_MAP[value] : undefined;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? STOPS.filter((s) => s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q) || s.tamilName?.includes(query.trim())) : STOPS;
    return list.slice(0, 8);
  }, [query]);

  const pick = (sid: string) => {
    onChange(sid);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className={cn("mb-1.5 block text-xs font-medium text-muted-foreground", hideLabel && "sr-only")}>{label}</label>
      <div className="relative">
        <span className={cn("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2", icon === "origin" ? "text-brand" : "text-destructive")}>
          {icon === "origin" ? <span className="block h-2.5 w-2.5 rounded-full border-[2.5px] border-current" /> : <MapPin className="h-4 w-4" />}
        </span>
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-invalid={invalid || undefined}
          autoComplete="off"
          value={open ? query : selected?.name ?? ""}
          placeholder={selected ? selected.name : placeholder}
          onFocus={() => { setOpen(true); setActive(0); }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
            else if (e.key === "Enter" && open && results[active]) { e.preventDefault(); pick(results[active].id); inputRef.current?.blur(); }
            else if (e.key === "Escape") { setOpen(false); }
          }}
          className={cn("h-11 w-full rounded-lg border border-input bg-card pl-9 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive", onLocate ? "pr-10" : "pr-3")}
        />
        {onLocate && (
          <button type="button" onClick={onLocate} title="Use my location" aria-label="Use my location" className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-brand">
            <LocateFixed className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-[1100] mt-1 max-h-72 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-lift">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No stops match “{query}”</li>}
          {results.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={s.id === value}
              onMouseDown={(e) => { e.preventDefault(); pick(s.id); }}
              onMouseEnter={() => setActive(i)}
              className={cn("flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm", i === active && "bg-muted")}
            >
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{s.area}{s.type !== "stop" ? ` · ${s.type === "terminus" ? "Bus terminus" : "Depot"}` : ""}</span>
              </span>
              {s.id === value && <Check className="h-4 w-4 text-brand" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
