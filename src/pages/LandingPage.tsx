<<<<<<< HEAD
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VerificationTool } from "@/components/pickup/VerificationTool";
import { ServiceDirectory } from "@/components/pickup/ServiceDirectory";
import { ReportConfusionForm } from "@/components/pickup/ReportConfusionForm";
import { TerminalGuide } from "@/components/pickup/TerminalGuide";
import { DataReliabilitySection } from "@/components/pickup/DataReliabilitySection";
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function LandingPage() {
  const [selectedInitialScenario, setSelectedInitialScenario] = useState<string>("scenario-1");

  const scrollToVerify = (scenarioId?: string) => {
    if (scenarioId) {
      setSelectedInitialScenario(scenarioId);
    }
    const elem = document.getElementById("verify-tool");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHowItWorks = () => {
    const elem = document.getElementById("how-it-works");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectServiceFromDirectory = () => {
    scrollToVerify();
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F9FAFB] selection:bg-white selection:text-[#0B1220]">
      {/* Navigation */}
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-[#374151] bg-[#0B1220] py-16 sm:py-24">
          {/* Subtle geometric backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#374151] bg-[#111827] px-3.5 py-1 text-xs text-[#D1D5DB] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>BusPudi — Verify Your Pickup Before You Travel</span>
                <span className="text-[#64748B]">|</span>
                <span className="text-[#9CA3AF]">Chennai Pilot</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#F9FAFB] sm:text-5xl sm:leading-tight">
                Don't Miss Your Bus Because of the Wrong Pickup Point.
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base leading-relaxed text-[#D1D5DB] sm:text-lg">
                Check your bus pickup information before you leave. Compare your ticket details with available service information and identify potential mismatches.
              </p>

              {/* CTA Row */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToVerify()}
                  className="w-full sm:w-auto rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#0B1220] transition-all hover:bg-[#E5E7EB] active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                >
                  Verify My Pickup
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollToHowItWorks}
                  className="w-full sm:w-auto rounded-lg border border-[#374151] bg-[#111827] px-6 py-3.5 text-sm font-semibold text-[#F9FAFB] transition hover:bg-[#1F2937] hover:border-[#64748B]"
                >
                  Explore How It Works
                </button>
              </div>

              {/* Quick Summary Notice */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
                <Info className="h-3.5 w-3.5 text-[#64748B]" />
                <span>Focusing on Chennai's Kilambakkam (KCBT), Koyambedu (CMBT), and Tambaram zones</span>
              </div>
            </div>

            {/* Quick 3 Outcomes Visual Teaser Bar */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-900/40 bg-[#1F2937]/80 p-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Outcome: MATCH
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#9CA3AF]">
                  Entered pickup corresponds with authorized departure platform in demo records.
                </p>
              </div>

              <div className="rounded-xl border border-rose-900/40 bg-[#1F2937]/80 p-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Outcome: MISMATCH
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#9CA3AF]">
                  Ticket pickup conflicts with relocation orders (e.g. Vadapalani vs Kilambakkam).
                </p>
              </div>

              <div className="rounded-xl border border-amber-900/40 bg-[#1F2937]/80 p-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Outcome: UNVERIFIED
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#9CA3AF]">
                  Service information missing or ambiguous. Prompts direct operator confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Interactive Tool Section */}
        <section className="border-b border-[#374151] bg-[#0B1220] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Interactive Verification Engine
                </span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-[#F9FAFB] sm:text-3xl">
                Verify Your Bus Pickup
              </h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Enter your ticket details or pick a realistic demonstration scenario below to see dynamic validation results
              </p>
            </div>

            <VerificationTool initialScenarioId={selectedInitialScenario} />
          </div>
        </section>

        {/* 3-Step Explanation Section */}
        <section id="how-it-works" className="border-b border-[#374151] bg-[#111827] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                Simple 3-Step Passenger Verification
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-[#F9FAFB] sm:text-3xl">
                How BusPudi Works Before You Travel
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                A practical pre-travel workflow designed to prevent passenger stress and costly emergency travel
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151] font-extrabold">
                  1
                </div>
                <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                  Enter Ticket Details
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  Input your bus operator, intended destination, and the exact pickup point printed on your booking confirmation or travel app receipt.
                </p>
                <div className="mt-4 text-[11px] text-[#64748B]">
                  Takes under 30 seconds • No account required
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151] font-extrabold">
                  2
                </div>
                <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                  Check Available Records
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  BusPudi compares your entered boarding point against regional terminal relocation rules (like Kilambakkam KCBT vs Koyambedu CMBT) and sample operator schedules.
                </p>
                <div className="mt-4 text-[11px] text-[#64748B]">
                  Instant MATCH, MISMATCH, or UNVERIFIED output
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white border border-[#374151] font-extrabold">
                  3
                </div>
                <h3 className="mt-4 text-base font-bold text-[#F9FAFB]">
                  Confirm Before Leaving
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  Receive clear, actionable steps: verify your booking SMS, call the operator helpline directly, and adjust your departure schedule with ample buffer time.
                </p>
                <div className="mt-4 text-[11px] text-[#64748B]">
                  Clear operator contact placeholders provided
                </div>
              </div>
            </div>

            {/* Passenger Benefits Row */}
            <div className="mt-12 rounded-2xl border border-[#374151] bg-[#1F2937]/50 p-6 sm:p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D1D5DB]">
                Key Benefits for Intercity Bus Passengers
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
                  <div className="font-bold text-white">Avoid Missed Departures</div>
                  <p className="mt-1 text-[#9CA3AF]">
                    Prevents arriving at an abandoned city stop while your bus departs 25 km away at Kilambakkam.
                  </p>
                </div>
                <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
                  <div className="font-bold text-white">Save Emergency Auto Costs</div>
                  <p className="mt-1 text-[#9CA3AF]">
                    Eliminates panic-induced ₹1,000+ emergency taxi rides across city traffic to catch a departing bus.
                  </p>
                </div>
                <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
                  <div className="font-bold text-white">Clear Relocation Insight</div>
                  <p className="mt-1 text-[#9CA3AF]">
                    Demystifies Chennai's multi-terminal structure (KCBT, CMBT, MMBT, and Tambaram).
                  </p>
                </div>
                <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
                  <div className="font-bold text-white">Zero Ambiguity</div>
                  <p className="mt-1 text-[#9CA3AF]">
                    Distinguishes confirmed information from unverified records, preventing risky assumptions.
                  </p>
                </div>
=======
import { Accessibility, ArrowRight, Bell, CloudOff, Layers, MapPinned, Radar, Route as RouteIcon, Search, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InfoNote, OperatorBadge, RouteChip } from "@/components/common/Badges";
import { StopPicker } from "@/components/common/StopPicker";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BusMap } from "@/components/map/BusMap";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/context/SimulationContext";
import { OPERATOR_LIST } from "@/data/operators";
import { CITY_STOP_IDS, STOPS } from "@/data/stops";
import { formatDuration } from "@/lib/time";

const FEATURES = [
  { icon: Radar, title: "Live bus tracking", desc: "See city and intercity buses on one map, with next stop, ETA and route progress." },
  { icon: RouteIcon, title: "City-to-intercity planning", desc: "Connect an MTC ride to an SETC, TNSTC or private coach in a single plan." },
  { icon: MapPinned, title: "Stop & terminus boards", desc: "Departure boards for stops and termini, clearly separating scheduled and confirmed trips." },
  { icon: Users, title: "Occupancy estimates", desc: "Simple available-to-full indicators, honest about how the estimate is made." },
  { icon: Bell, title: "Service alerts", desc: "Delays, diversions and cancellations with suggested alternatives." },
  { icon: Accessibility, title: "Accessibility first", desc: "Low-floor, wheelchair and priority seating information — verified status shown clearly." },
  { icon: CloudOff, title: "Works offline", desc: "Saved journeys and stop details stay available when your signal drops." },
  { icon: Layers, title: "One app, every operator", desc: "Consistent experience across operator categories, ready for open data feeds." },
];

const STEPS = [
  { n: "01", t: "Search", d: "Enter where you are and where you're going, or type a bus number." },
  { n: "02", t: "Compare", d: "See direct and connecting options with duration, transfers and estimated arrival." },
  { n: "03", t: "Track", d: "Follow your bus on the map and get its ETA to your stop." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { buses } = useSimulation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loc.hash) document.querySelector(loc.hash)?.scrollIntoView({ behavior: "smooth" });
  }, [loc.hash]);

  const cityBuses = useMemo(() => buses.filter((b) => b.state.status !== "not-in-service" && !b.route.intercity), [buses]);
  const cityRoutes = useMemo(() => [...new Set(cityBuses.map((b) => b.route.id))], [cityBuses]);
  const cityStops = useMemo(() => STOPS.filter((s) => CITY_STOP_IDS.has(s.id) && s.type !== "stop"), []);
  const featured = cityBuses.slice(0, 3);

  const search = () => {
    if (!from || !to) { setErr(!from ? "Choose where you're starting from." : "Choose a destination."); return; }
    if (from === to) { setErr("Start and destination must be different."); return; }
    navigate(`/app/plan?from=${from}&to=${to}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#hero" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-card focus:px-3 focus:py-2">Skip to content</a>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden border-b bg-navy-900 text-white">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} aria-hidden />
          <div className="container relative grid gap-10 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-teal-200">
                <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-teal-300" /> Chennai · city & intercity
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl">Every Bus.<br /><span className="text-teal-300">One Journey.</span></h1>
              <p className="mt-4 max-w-lg text-base text-white/75">BusPudi brings MTC city buses and intercity services from SETC, TNSTC and private operators into one place — so you can plan, track and catch the right bus without switching apps.</p>

              <form onSubmit={(e) => { e.preventDefault(); search(); }} className="mt-7 rounded-2xl bg-card p-3 text-foreground shadow-lift" noValidate>
                <div className="grid gap-2 sm:grid-cols-2">
                  <StopPicker label="From" hideLabel value={from} onChange={(v) => { setFrom(v); setErr(null); }} placeholder="From — e.g. Ramapuram" icon="origin" />
                  <StopPicker label="To" hideLabel value={to} onChange={(v) => { setTo(v); setErr(null); }} placeholder="To — e.g. Puducherry" icon="destination" />
                </div>
                {err && <p className="mt-2 px-1 text-xs text-destructive" role="alert">{err}</p>}
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Button type="submit" variant="brand" size="lg"><Search /> Search buses</Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => navigate("/app/track")}><Radar /> Track a bus</Button>
                </div>
              </form>
              <p className="mt-3 text-xs text-white/55">Demo build · all buses and times are simulated sample data.</p>
            </div>

            <div className="relative">
              <div className="relative h-[360px] overflow-hidden rounded-2xl border border-white/10 shadow-lift sm:h-[460px]">
                <BusMap className="absolute inset-0" buses={cityBuses} routeIds={cityRoutes} stops={cityStops} interactive={false} showControls={false} initialZoom={11} onSelectBus={(id) => navigate(`/app/track?bus=${id}`)} />
                <div className="absolute left-3 top-3 z-[400] rounded-lg bg-card/95 px-2.5 py-1.5 text-[11px] font-medium text-foreground shadow-soft">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse2 rounded-full bg-success" /> {cityBuses.length} buses moving · Demo data
                </div>
              </div>
              <div className="absolute -bottom-5 left-4 right-4 z-[401] hidden gap-2 sm:flex">
                {featured.map((b) => (
                  <Link key={b.id} to={`/app/track?bus=${b.id}`} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border bg-card p-2.5 text-foreground shadow-lift transition hover:-translate-y-0.5">
                    <RouteChip number={b.route.number} code={b.route.operator} className="h-6 text-xs" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{b.nextStop.name}</span>
                      <span className="block text-[11px] text-muted-foreground tabular">in {formatDuration(b.etaNextStopMins)}</span>
                    </span>
                  </Link>
                ))}
>>>>>>> origin/main
              </div>
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {/* Searchable Service Directory Section */}
        <section className="border-b border-[#374151] bg-[#0B1220] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ServiceDirectory onSelectService={handleSelectServiceFromDirectory} />
          </div>
        </section>

        {/* Report Confusion Form Section */}
        <section className="border-b border-[#374151] bg-[#111827] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ReportConfusionForm />
          </div>
        </section>

        {/* Chennai Terminal Relocation Guide */}
        <section className="border-b border-[#374151] bg-[#0B1220] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TerminalGuide />
          </div>
        </section>

        {/* Data Reliability & Limitations Section */}
        <section className="bg-[#111827] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DataReliabilitySection />
          </div>
        </section>
      </main>

      {/* Footer */}
=======
        {/* Operators */}
        <section className="border-b bg-card">
          <div className="container py-10">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">Supported operator categories</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {OPERATOR_LIST.map((o) => (
                <div key={o.code} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between"><OperatorBadge code={o.code} /><span className="text-xs text-muted-foreground">{o.category}</span></div>
                  <p className="mt-2 text-sm font-semibold">{o.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{o.description}</p>
                </div>
              ))}
            </div>
            <InfoNote className="mx-auto mt-5 max-w-3xl">
              Live integration depends on each operator making vehicle-location and timetable data available. BusPudi has no partnership with any operator listed above; this demo uses simulated data only.
            </InfoNote>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16">
          <div className="container py-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">Everything for the trip, in one place</h2>
              <p className="mt-2 text-muted-foreground">Built around the moment that matters most: knowing where your bus is and when it will reach you.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl border bg-card p-5 transition hover:shadow-soft">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><f.icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y bg-card">
          <div className="container grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-bold">How it works</h2>
              <p className="mt-2 text-muted-foreground">Three steps from “which bus?” to “there it is.”</p>
              <Button asChild variant="brand" className="mt-6"><Link to="/app">Open the app <ArrowRight /></Link></Button>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-xl border p-5">
                  <span className="font-display text-sm font-bold text-brand">{s.n}</span>
                  <p className="mt-2 font-semibold">{s.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Operator CTA */}
        <section>
          <div className="container py-16">
            <div className="grid items-center gap-6 rounded-2xl border bg-navy-900 p-8 text-white dark:bg-card md:grid-cols-[1fr_auto]">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-teal-300"><ShieldCheck className="h-4 w-4" /> For transport operators</p>
                <h2 className="mt-2 text-2xl font-bold">Preview the operator console</h2>
                <p className="mt-1 max-w-xl text-sm text-white/70">Fleet overview, route status, departures and occupancy — a visual concept using mock data.</p>
              </div>
              <Button asChild variant="brand" size="lg"><Link to="/operator">View preview <ArrowRight /></Link></Button>
            </div>
          </div>
        </section>
      </main>
>>>>>>> origin/main
      <Footer />
    </div>
  );
}
