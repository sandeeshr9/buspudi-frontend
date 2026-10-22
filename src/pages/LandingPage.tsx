import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Radar,
  Route as RouteIcon,
  Search,
  MapPin,
  Clock,
  Bell,
  WifiOff,
  Accessibility,
  ArrowRight,
  ShieldAlert,
  ExternalLink,
  Bus,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BusMap } from "@/components/map/BusMap";
import { ServiceAlertCard } from "@/components/bus/ServiceAlertCard";
import { useSimulation } from "@/context/SimulationContext";
import { useNow } from "@/hooks/useNow";
import { STOPS, STOP_MAP, DEMO_LOCATION } from "@/data/stops";
import { ROUTE_MAP } from "@/data/routes";
import { ALERTS } from "@/data/alerts";
import { nearestStops } from "@/lib/geo";
import { departuresForStop } from "@/lib/departures";
import { formatTime } from "@/lib/time";

export default function LandingPage() {
  const navigate = useNavigate();
  const { buses, busMap, lastTick } = useSimulation();
  const now = useNow(10000);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOperator, setSelectedOperator] = useState<string>("ALL");
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  // Filtered buses for the interactive map and quick search
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      if (selectedOperator !== "ALL" && bus.route.operator !== selectedOperator) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${bus.route.number} ${bus.route.name} ${bus.destinationStop.name} ${bus.originStop.name} ${bus.route.operator}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [buses, selectedOperator, searchQuery]);

  const selectedBus = useMemo(() => {
    return selectedBusId ? busMap[selectedBusId] ?? null : filteredBuses[0] ?? null;
  }, [selectedBusId, busMap, filteredBuses]);

  // Nearby sample departures from Guindy / Central demo coordinates
  const demoHere: [number, number] = [DEMO_LOCATION.lat, DEMO_LOCATION.lng];
  const nearbyStops = useMemo(() => nearestStops(STOPS, demoHere, 3), []);
  const primaryStop = nearbyStops[0]?.stop;
  const upcomingDepartures = useMemo(() => {
    return primaryStop ? departuresForStop(primaryStop.id, buses, now).slice(0, 4) : [];
  }, [primaryStop, buses, now]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/track?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/app/track");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F9FAFB] selection:bg-white selection:text-[#0B1220]">
      {/* Global Brand Navbar */}
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-[#374151] bg-[#0B1220] py-14 sm:py-20">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Product Category Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#374151] bg-[#111827] px-4 py-1 text-xs text-[#D1D5DB] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">Wayzo</span>
                <span className="text-[#64748B]">|</span>
                <span>Unified City & Intercity Bus Tracking Platform</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#F9FAFB] sm:text-5xl sm:leading-tight">
                Track Your Bus. Know When It Arrives.
              </h1>

              {/* Exact Requested Subtitle */}
              <p className="mt-4 text-base leading-relaxed text-[#D1D5DB] sm:text-lg">
                Find buses, follow routes, check estimated arrivals, and plan your journey across city and intercity services.
              </p>

              {/* Fast Bus Search Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="mx-auto mt-8 flex max-w-xl items-center rounded-xl border border-[#374151] bg-[#1F2937] p-1.5 shadow-2xl focus-within:border-white focus-within:ring-1 focus-within:ring-white"
              >
                <div className="flex flex-1 items-center gap-2.5 px-3">
                  <Search className="h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bus number (e.g. 570, 21G, 102), route, or destination..."
                    className="w-full bg-transparent text-xs text-[#F9FAFB] placeholder-[#64748B] focus:outline-none sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB] shrink-0"
                >
                  Track Bus
                </button>
              </form>

              {/* Primary Action Buttons */}
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/app/track"
                  className="w-full sm:w-auto rounded-lg bg-white px-6 py-3 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB] flex items-center justify-center gap-2 shadow-sm"
                >
                  <Radar className="h-4 w-4" />
                  Track a Bus
                </Link>
                <Link
                  to="/app/plan"
                  className="w-full sm:w-auto rounded-lg border border-[#374151] bg-[#111827] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#1F2937] hover:border-[#64748B] flex items-center justify-center gap-2"
                >
                  <RouteIcon className="h-4 w-4 text-[#D1D5DB]" />
                  Plan My Journey
                </Link>
                <Link
                  to="/app/offline"
                  className="w-full sm:w-auto rounded-lg border border-[#374151] bg-[#111827] px-5 py-3 text-xs font-semibold text-[#D1D5DB] transition hover:bg-[#1F2937] flex items-center justify-center gap-2"
                >
                  <WifiOff className="h-3.5 w-3.5 text-[#64748B]" />
                  Offline Maps & Routes
                </Link>
              </div>

              {/* Honesty Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#9CA3AF]">
                <Info className="h-3.5 w-3.5 text-[#64748B]" />
                <span>Simulated live bus tracking demo for Chennai Metropolitan Area • No real-time operator API integration</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Feature Section: Interactive Unified Bus Tracking Map */}
        <section id="tracking-preview" className="border-b border-[#374151] bg-[#0B1220] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Live Fleet Tracking & Simulation
                  </span>
                </div>
                <h2 className="mt-1 text-2xl font-extrabold text-[#F9FAFB]">
                  Chennai Unified Bus Tracking
                </h2>
                <p className="text-xs text-[#9CA3AF]">
                  Select any moving bus on the map to inspect its real-time progress, upcoming stops, and ETA
                </p>
              </div>

              {/* Operator Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "ALL", label: "All Fleets" },
                  { id: "MTC", label: "MTC City" },
                  { id: "SETC", label: "SETC Intercity" },
                  { id: "TNSTC", label: "TNSTC Express" },
                  { id: "PRIVATE", label: "Private Omnibuses" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedOperator(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedOperator === tab.id
                        ? "bg-white text-[#0B1220] shadow-sm"
                        : "border border-[#374151] bg-[#111827] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map & Live Bus Details Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Interactive Leaflet Map (8 Cols) */}
              <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-[#374151] bg-[#1F2937] shadow-card">
                <div className="flex items-center justify-between border-b border-[#374151] bg-[#111827] px-4 py-2.5 text-xs text-[#D1D5DB]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-semibold text-white">
                      {filteredBuses.length} Vehicles Tracking
                    </span>
                    <span className="text-[#64748B]">|</span>
                    <span className="text-[11px] text-[#9CA3AF]">Updated {formatTime(lastTick)}</span>
                  </div>
                  <Link
                    to="/app/track"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
                  >
                    Full Screen Tracker
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="h-[460px] w-full">
                  <BusMap
                    buses={filteredBuses}
                    selectedBusId={selectedBus?.id}
                    onSelectBus={(id) => setSelectedBusId(id)}
                    stops={STOPS}
                    interactive={true}
                  />
                </div>
              </div>

              {/* Selected Bus Inspection Card (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-[#374151] bg-[#1F2937] p-5 shadow-card">
                {selectedBus ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#374151] pb-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                          Selected Vehicle
                        </div>
                        <h3 className="text-xl font-extrabold text-[#F9FAFB]">
                          Route {selectedBus.route.number}
                        </h3>
                      </div>
                      <span className="rounded bg-[#111827] px-2.5 py-1 text-xs font-bold text-white border border-[#374151]">
                        {selectedBus.route.operator}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-[#9CA3AF]">Route Name:</div>
                      <div className="text-sm font-semibold text-white">
                        {selectedBus.route.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#D1D5DB]">
                        <span>Destination:</span>
                        <strong className="text-white">{selectedBus.destinationStop.name}</strong>
                      </div>
                    </div>

                    {/* Progress & Next Stop */}
                    <div className="rounded-xl border border-[#374151] bg-[#111827] p-3 text-xs">
                      <div className="flex items-center justify-between text-[#9CA3AF]">
                        <span>Next Approaching Stop:</span>
                        <span className="text-emerald-400 font-bold">In ~3 mins</span>
                      </div>
                      <div className="mt-1 font-bold text-white flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {selectedBus.nextStop?.name ?? selectedBus.destinationStop.name}
                      </div>
                      <div className="mt-2 text-[11px] text-[#9CA3AF]">
                        Speed: <span className="text-white">{Math.round(selectedBus.state.speedKmph)} km/h</span> • Vehicle:{" "}
                        <span className="text-white">{selectedBus.vehicle.label}</span> ({selectedBus.vehicle.ac ? "AC" : "Non-AC"})
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/app/bus/${selectedBus.id}`}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB]"
                      >
                        View Full Stop Timeline & ETAs
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <Bus className="h-8 w-8 text-[#64748B]" />
                    <p className="mt-2 text-xs text-[#9CA3AF]">
                      Click any bus icon on the map to inspect its real-time route progress and stop arrival estimates.
                    </p>
                  </div>
                )}

                {/* Quick Tracker Info */}
                <div className="border-t border-[#374151] pt-3 text-[11px] text-[#64748B]">
                  Simulated demo feed running at accelerated frequency.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Nearby Stops, Upcoming Departures & Alerts Section */}
        <section className="border-b border-[#374151] bg-[#111827] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              {/* Nearby Departures Card (6 cols) */}
              <div className="md:col-span-6 rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
                <div className="flex items-center justify-between border-b border-[#374151] pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Clock className="h-4 w-4 text-[#D1D5DB]" />
                    Upcoming Departures ({primaryStop?.name ?? "Guindy"})
                  </div>
                  <Link
                    to="/app/stops"
                    className="text-xs text-white hover:underline flex items-center gap-1"
                  >
                    All Stops <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-4 space-y-2.5">
                  {upcomingDepartures.length > 0 ? (
                    upcomingDepartures.map((dep, idx) => {
                      const r = ROUTE_MAP[dep.routeId];
                      const dest = STOP_MAP[dep.towardsStopId];
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-[#374151] bg-[#111827] p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="rounded bg-[#1F2937] px-2 py-1 font-bold text-white border border-[#374151]">
                              {r?.number ?? dep.routeId}
                            </span>
                            <div>
                              <div className="font-semibold text-white">
                                To {dest?.name ?? "Terminus"}
                              </div>
                              <div className="text-[11px] text-[#9CA3AF]">
                                {r?.operator ?? "MTC"} • Bay {dep.bay ?? "1"}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-emerald-400">
                              {formatTime(dep.scheduledAt)}
                            </div>
                            <div className="text-[10px] text-[#64748B]">
                              {dep.kind === "tracked" ? "Estimated" : "Scheduled"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center text-xs text-[#9CA3AF]">
                      No upcoming departures in immediate window.
                    </div>
                  )}
                </div>
              </div>

              {/* Live Service Alerts Card (6 cols) */}
              <div className="md:col-span-6 rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
                <div className="flex items-center justify-between border-b border-[#374151] pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Bell className="h-4 w-4 text-[#D1D5DB]" />
                    Transit Service Alerts
                  </div>
                  <Link
                    to="/app/alerts"
                    className="text-xs text-white hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {ALERTS.slice(0, 2).map((alert) => (
                    <ServiceAlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars of Wayzo Section */}
        <section className="border-b border-[#374151] bg-[#0B1220] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                Complete Passenger Mobility
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-[#F9FAFB] sm:text-3xl">
                Every Bus. Every Route. In One Place.
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                Wayzo combines city MTC transit, intercity government SETC/TNSTC coaches, and private omnibuses with essential offline support and accessibility features.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Pillar 1: Unified Tracking */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card transition-all hover:border-[#64748B]">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151]">
                    <Radar className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                    Unified Bus Tracking
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                    Track city MTC buses and intercity coaches side-by-side on an interactive map of Chennai with real-time route progress and stop ETAs.
                  </p>
                </div>
                <Link
                  to="/app/track"
                  className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
                >
                  Explore Tracker <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Pillar 2: Offline Maps */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card transition-all hover:border-[#64748B]">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151]">
                    <WifiOff className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                    Offline Maps & Routes
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                    Save high-frequency corridor bundles directly to your device. View stop manifests and scheduled timetables when network signal drops.
                  </p>
                </div>
                <Link
                  to="/app/offline"
                  className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
                >
                  Manage Offline Bundles <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Pillar 3: Accessibility */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card transition-all hover:border-[#64748B]">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151]">
                    <Accessibility className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                    Accessibility & Support
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                    Filter for wheelchair-accessible and low-floor buses, view priority seating notes, and submit local demonstration boarding assistance requests.
                  </p>
                </div>
                <Link
                  to="/app/accessibility"
                  className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
                >
                  Accessibility Options <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Pillar 4: Multi-Modal Journey Planner */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card transition-all hover:border-[#64748B]">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151]">
                    <RouteIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                    Journey Planner
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                    Compare direct lines and 1–2 transfer interchanges between city lines and long-distance departures with clear step-by-step guidance.
                  </p>
                </div>
                <Link
                  to="/app/plan"
                  className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
                >
                  Plan a Route <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Data Reliability & Honesty Section */}
        <section className="bg-[#111827] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                <ShieldAlert className="h-4 w-4 text-[#D1D5DB]" />
                Prototype Demonstration & Transparency Policy
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                Wayzo is an early-stage transport-tech prototype developed to explore unified passenger mobility for Chennai and Tamil Nadu. All vehicle positions, arrival ETAs, fares, occupancy figures, and alerts are simulated sample data generated in the browser. Wayzo has no formal government partnership or live data API integration with MTC, SETC, TNSTC, or private transport federations.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}
