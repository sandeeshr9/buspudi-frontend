import { OPERATOR_LIST } from "@/data/operators";
import { cn } from "@/lib/utils";
import type { OperatorCode } from "@/types";

interface Props {
  selected: OperatorCode[];
  onChange: (v: OperatorCode[]) => void;
  counts?: Partial<Record<OperatorCode, number>>;
  className?: string;
}

/** Multi-select chip filter. Empty selection = all operators. */
export function OperatorFilter({ selected, onChange, counts, className }: Props) {
  const all = selected.length === 0;
  const toggle = (c: OperatorCode) => onChange(selected.includes(c) ? selected.filter((x) => x !== c) : [...selected, c]);
  return (
    <div role="group" aria-label="Filter by operator" className={cn("flex flex-wrap gap-1.5", className)}>
      <button type="button" aria-pressed={all} onClick={() => onChange([])} className={cn("h-8 rounded-full border px-3 text-xs font-medium transition", all ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
        All
      </button>
      {OPERATOR_LIST.map((op) => {
        const on = selected.includes(op.code);
        return (
          <button
            key={op.code}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(op.code)}
            className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition", on ? "text-white" : "bg-card hover:bg-muted")}
            style={on ? { backgroundColor: op.color, borderColor: op.color } : undefined}
          >
            {!on && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: op.color }} />}
            {op.shortName}
            {counts?.[op.code] != null && <span className={cn("tabular", on ? "text-white/80" : "text-muted-foreground")}>{counts[op.code]}</span>}
          </button>
        );
      })}
    </div>
  );
}
