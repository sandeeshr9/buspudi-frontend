import { Search, X } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  onSubmit?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(({ value, onChange, placeholder = "Search", className, label = "Search", onSubmit }, ref) => (
  <form role="search" className={cn("relative", className)} onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    <input
      ref={ref}
      type="search"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-9 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button type="button" onClick={() => onChange("")} className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted" aria-label="Clear search">
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </form>
));
SearchBar.displayName = "SearchBar";
