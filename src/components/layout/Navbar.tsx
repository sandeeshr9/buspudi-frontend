import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { to: "/app/track", label: "Live tracking" },
  { to: "/app/plan", label: "Journey planner" },
  { to: "/app/stops", label: "Stops" },
  { to: "/operator", label: "For operators" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[500] border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <nav className="container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => cn("rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground", isActive && "text-foreground")}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="brand" className="hidden sm:inline-flex"><Link to="/app">Open app</Link></Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t bg-background md:hidden">
          <div className="container flex flex-col py-2">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted">{l.label}</Link>
            ))}
            <Button asChild variant="brand" className="mt-2"><Link to="/app" onClick={() => setOpen(false)}>Open app</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
