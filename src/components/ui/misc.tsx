import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export function Separator({ className, vertical }: { className?: string; vertical?: boolean }) {
  return <div role="separator" className={cn("shrink-0 bg-border", vertical ? "h-full w-px" : "h-px w-full", className)} />;
}

export function Progress({ value, className, indicatorClassName, label }: { value: number; className?: string; indicatorClassName?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-label={label} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full bg-brand transition-[width] duration-700 ease-out", indicatorClassName)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function Checkbox({ checked, onCheckedChange, id, label, description }: { checked: boolean; onCheckedChange: (v: boolean) => void; id: string; label: React.ReactNode; description?: React.ReactNode }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-[hsl(var(--brand))]" />
      <span className="grid gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}

export const TooltipProvider = TooltipPrimitive.Provider;
export function Tooltip({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactNode; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <TooltipPrimitive.Root delayDuration={250}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content side={side} sideOffset={6} className="z-[1200] max-w-xs rounded-md bg-navy-900 px-2.5 py-1.5 text-xs text-white shadow-lift animate-in fade-in-0 dark:bg-slate-100 dark:text-navy-900">
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
