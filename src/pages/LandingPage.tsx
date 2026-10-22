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
              </div>
            </div>
          </div>
        </section>

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
      <Footer />
    </div>
  );
}
