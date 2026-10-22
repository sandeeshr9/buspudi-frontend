import { Building2, FlaskConical, MoreHorizontal, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/misc";
import { useApp } from "@/context/AppContext";
import { useSimulation } from "@/context/SimulationContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { ALERTS } from "@/data/alerts";
import { cn } from "@/lib/utils";
import { NAV_OPERATOR, NAV_PRIMARY, NAV_SECONDARY, type NavItem } from "./nav";
import { OfflineBanner } from "./OfflineBanner";
import { ThemeToggle } from "./ThemeToggle";

function SideLink({ item, label, badge }: { item: NavItem; label: string; badge?: number }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => cn("group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground", isActive && "bg-accent text-accent-foreground hover:bg-accent")}
    >
      <Icon className="h-[18px] w-[18px]" />
      <span className="flex-1 truncate">{label}</span>
      {badge ? <span className="rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">{badge}</span> : null}
    </NavLink>
  );
}

export function Sidebar() {
  const { t } = useApp();
  const highAlerts = ALERTS.filter((a) => a.severity === "high").length;
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card lg:flex" aria-label="Sidebar">
      <div className="flex h-16 items-center px-5"><Logo to="/" /></div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2" aria-label="App">
        <div className="space-y-0.5">
          {NAV_PRIMARY.map((n) => <SideLink key={n.to} item={n} label={t(n.key)} badge={n.key === "alerts" ? highAlerts : undefined} />)}
        </div>
        <div>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Passenger</p>
          <div className="space-y-0.5">{NAV_SECONDARY.map((n) => <SideLink key={n.to} item={n} label={t(n.key)} />)}</div>
        </div>
      </nav>
      <div className="space-y-3 border-t p-3">
        <Link to={NAV_OPERATOR.to} className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 text-sm font-medium hover:bg-muted">
          <Building2 className="h-4 w-4 text-brand" /> {t("operator")}
        </Link>
        <div className="rounded-lg bg-warning/10 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <p className="mb-1 flex items-center gap-1.5 font-semibold text-warning"><FlaskConical className="h-3.5 w-3.5" /> Demo build</p>
          All buses, times and alerts are simulated sample data. No operator integration is active.
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  const items = [
    { to: "/app", key: "home" as const, icon: NAV_PRIMARY[0].icon, end: true },
    { to: "/app/track", key: "trackShort" as const, icon: NAV_PRIMARY[1].icon },
    { to: "/app/plan", key: "planShort" as const, icon: NAV_PRIMARY[2].icon },
    { to: "/app/alerts", key: "alertsShort" as const, icon: NAV_PRIMARY[4].icon },
  ];
  const moreActive = [...NAV_SECONDARY, NAV_PRIMARY[3]].some((n) => loc.pathname.startsWith(n.to));
  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-[600] border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Mobile">
        <div className="grid grid-cols-5">
          {items.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground", isActive && "text-brand")}>
              <n.icon className="h-5 w-5" />
              {t(n.key)}
            </NavLink>
          ))}
          <button type="button" onClick={() => setOpen(true)} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground", moreActive && "text-brand")} aria-haspopup="dialog">
            <MoreHorizontal className="h-5 w-5" /> {t("more")}
          </button>
        </div>
      </nav>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent side="bottom" className="gap-2 p-4 pb-8">
          <DialogTitle className="text-base">More</DialogTitle>
          <DialogDescription className="sr-only">Other Wayzo sections</DialogDescription>
          <div className="grid grid-cols-3 gap-2">
            {[NAV_PRIMARY[3], ...NAV_SECONDARY, NAV_OPERATOR].map((n) => (
              <Link key={n.to} to={n.to} className="flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center text-xs font-medium hover:bg-muted">
                <n.icon className="h-5 w-5 text-brand" />{t(n.key)}
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TopBar() {
  const { running, setRunning } = useSimulation();
  const online = useOnlineStatus();
  return (
    <header className="sticky top-0 z-[500] flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur lg:h-16 lg:px-6">
      <div className="lg:hidden"><Logo to="/" /></div>
      <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
        <span className={cn("h-2 w-2 rounded-full", online ? "bg-success" : "bg-warning")} />
        {online ? "Online" : "Offline"} · Simulation {running ? "running" : "paused"}
      </div>
      <div className="flex items-center gap-1">
        <Tooltip content={running ? "Pause the bus simulation" : "Resume the bus simulation"}>
          <Button variant="outline" size="sm" onClick={() => setRunning(!running)} aria-pressed={!running}>
            {running ? <Pause /> : <Play />}<span className="hidden sm:inline">{running ? "Pause demo" : "Resume demo"}</span>
          </Button>
        </Tooltip>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function AppLayout() {
  const loc = useLocation();
  const fullBleed = loc.pathname.startsWith("/app/track");
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <TopBar />
        <main id="main" className={cn("flex-1", fullBleed ? "" : "px-4 py-6 pb-safe sm:px-6 lg:px-8 lg:pb-10")}>
          <div key={loc.pathname} className={cn("animate-fade-in", !fullBleed && "mx-auto max-w-6xl")}>
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
