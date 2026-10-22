import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import {
  Radar,
  Route as RouteIcon,
  WifiOff,
  Accessibility,
  Bell,
  MapPin,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Live Tracking", to: "/app/track", icon: Radar },
    { label: "Journey Planner", to: "/app/plan", icon: RouteIcon },
    { label: "Offline Maps", to: "/app/offline", icon: WifiOff },
    { label: "Accessibility", to: "/app/accessibility", icon: Accessibility },
    { label: "Stops", to: "/app/stops", icon: MapPin },
    { label: "Alerts", to: "/app/alerts", icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#374151] bg-[#0B1220]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo to="/" showTagline={false} />
          <span className="hidden sm:inline-flex rounded bg-[#111827] px-2 py-0.5 text-[10px] font-semibold text-[#D1D5DB] border border-[#374151]">
            Chennai Unified
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-5 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "text-white font-bold"
                    : "text-[#D1D5DB] hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-[#9CA3AF]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA & Dashboard Button */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/app"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#D1D5DB] transition hover:text-white"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/app/track"
            className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB] shadow-sm flex items-center gap-1.5"
          >
            <Radar className="h-3.5 w-3.5" />
            Track a Bus
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg border border-[#374151] bg-[#1F2937] p-2 text-[#9CA3AF] hover:text-white md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#374151] bg-[#111827] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2.5 text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Passenger Dashboard</span>
            </Link>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg p-2.5 text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white"
                >
                  <Icon className="h-4 w-4 text-[#9CA3AF]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              to="/app/track"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full rounded-lg bg-white py-2.5 text-center text-xs font-bold text-[#0B1220] flex items-center justify-center gap-2"
            >
              <Radar className="h-4 w-4" />
              Track a Bus Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
