<<<<<<< HEAD
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bus, Menu, X, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#374151] bg-[#0B1220]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0B1220] shadow-sm">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-[#F9FAFB]">
                BusPudi
              </span>
              <span className="rounded bg-[#1F2937] px-1.5 py-0.5 text-[10px] font-semibold text-[#D1D5DB] border border-[#374151]">
                Chennai Pilot
              </span>
            </div>
            <div className="text-[10px] text-[#9CA3AF] -mt-0.5">
              Verify Before You Travel
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            onClick={() => scrollToSection("verify-tool")}
            className="text-xs font-semibold text-[#D1D5DB] transition hover:text-white"
          >
            Verify Pickup
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("service-directory")}
            className="text-xs font-semibold text-[#D1D5DB] transition hover:text-white"
          >
            Service Directory
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("report-confusion")}
            className="text-xs font-semibold text-[#D1D5DB] transition hover:text-white"
          >
            Report Confusion
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("terminal-guide")}
            className="text-xs font-semibold text-[#D1D5DB] transition hover:text-white"
          >
            Terminal Guide
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("data-reliability")}
            className="text-xs font-semibold text-[#D1D5DB] transition hover:text-white"
          >
            Reliability & Scope
          </button>
        </nav>

        {/* Primary CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scrollToSection("verify-tool")}
            className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB] active:scale-[0.98] shadow-sm flex items-center gap-1.5"
          >
            Verify My Pickup
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg border border-[#374151] bg-[#1F2937] p-2 text-[#9CA3AF] hover:text-white md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#374151] bg-[#111827] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("verify-tool")}
              className="rounded-lg p-2 text-left text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
            >
              Verify My Bus Pickup
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("service-directory")}
              className="rounded-lg p-2 text-left text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
            >
              Service Directory
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("report-confusion")}
              className="rounded-lg p-2 text-left text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
            >
              Report Pickup Confusion
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("terminal-guide")}
              className="rounded-lg p-2 text-left text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
            >
              Chennai Terminal Guide
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("data-reliability")}
              className="rounded-lg p-2 text-left text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
            >
              Reliability & Prototype Limitations
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("verify-tool")}
              className="mt-2 w-full rounded-lg bg-white py-2.5 text-center text-xs font-bold text-[#0B1220]"
            >
              Verify My Pickup
            </button>
          </nav>
=======
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
>>>>>>> origin/main
        </div>
      )}
    </header>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> origin/main
