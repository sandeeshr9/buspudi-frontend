import { Accessibility, Armchair, BadgeCheck, CheckCircle2, HandHelping, Trash2, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AccessBadge, DemoBadge, InfoNote, RouteChip } from "@/components/common/Badges";
import { EmptyState, PageHeader } from "@/components/common/States";
import { StopPicker } from "@/components/common/StopPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulation } from "@/context/SimulationContext";
import { ROUTES, ROUTE_MAP } from "@/data/routes";
import { STOP_MAP } from "@/data/stops";
import { VEHICLES } from "@/data/vehicles";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatTime } from "@/lib/time";
import type { AccessStatus } from "@/types";

interface AssistRequest {
  id: string;
  routeId: string;
  stopId: string;
  type: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
  createdAt: number;
}

const ASSIST_TYPES = ["Wheelchair boarding", "Visual impairment guidance", "Help with luggage", "Senior citizen assistance", "Other"];

export default function AccessibilityPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { busMap } = useSimulation();
  const preBus = params.get("bus") ? busMap[params.get("bus")!] : undefined;
  const [mode, setMode] = useState<"verified" | "any">("any");
  const [requests, setRequests] = useLocalStorage<AssistRequest[]>("assistRequests", []);

  const [form, setForm] = useState({ routeId: preBus?.route.id ?? "", stopId: preBus?.nextStop.id ?? "", type: ASSIST_TYPES[0], time: "", name: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<AssistRequest | null>(null);

  const accessibleRoutes = useMemo(() => {
    const ok: AccessStatus[] = mode === "verified" ? ["verified"] : ["verified", "demo"];
    return ROUTES.map((r) => {
      const vs = VEHICLES.filter((v) => v.routeId === r.id);
      const wc = vs.filter((v) => ok.includes(v.accessibility.wheelchair)).length;
      const lf = vs.filter((v) => ok.includes(v.accessibility.lowFloor)).length;
      return { r, total: vs.length, wc, lf };
    }).filter((x) => x.wc > 0 || x.lf > 0);
  }, [mode]);

  const set = (k: keyof typeof form, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.routeId) er.routeId = "Choose a route.";
    if (!form.stopId) er.stopId = "Choose your boarding stop.";
    else if (form.routeId && !ROUTE_MAP[form.routeId].stopIds.includes(form.stopId)) er.stopId = "This route doesn't stop here.";
    if (!form.time) er.time = "Choose an approximate time.";
    if (form.name.trim().length < 2) er.name = "Enter your name.";
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) er.phone = "Enter a valid 10-digit Indian mobile number.";
    setErrors(er);
    if (Object.values(er).some(Boolean)) { toast.error("Please fix the highlighted fields"); return; }
    const req: AssistRequest = { id: `req-${Date.now()}`, ...form, createdAt: Date.now() };
    setRequests((r) => [req, ...r].slice(0, 10));
    setDone(req);
    setForm((f) => ({ ...f, notes: "" }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Accessibility & passenger support" description="Find accessible services and try the boarding assistance request flow." badge={<DemoBadge />} />

      <InfoNote tone="warning">
        BusPudi currently has <strong>no verified accessibility data</strong>. Features below marked “Demo · not verified” are sample values. Verified information would need to come from the operator or an on-ground audit.
      </InfoNote>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Accessibility, t: "Wheelchair access", d: "Shown as Verified only when confirmed by the operator or audit. Otherwise marked Demo or Unknown.", s: "demo" as AccessStatus },
          { icon: Armchair, t: "Low-floor buses", d: "Low-floor vehicles make boarding easier for wheelchair users, older passengers and parents with strollers.", s: "demo" as AccessStatus },
          { icon: Volume2, t: "Priority seating", d: "Reserved seats for elderly, pregnant and disabled passengers. Availability varies by vehicle.", s: "demo" as AccessStatus },
        ].map((f) => (
          <Card key={f.t}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between"><f.icon className="h-5 w-5 text-brand" /><AccessBadge status={f.s} /></div>
              <p className="mt-3 text-sm font-semibold">{f.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Accessible route filter</CardTitle>
              <CardDescription>Routes with at least one wheelchair or low-floor vehicle</CardDescription>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
              <TabsList className="h-9"><TabsTrigger value="verified" className="text-xs"><BadgeCheck />Verified only</TabsTrigger><TabsTrigger value="any" className="text-xs">Include demo</TabsTrigger></TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {accessibleRoutes.length === 0 ? (
              <EmptyState icon={BadgeCheck} title="No verified accessible routes yet" description="No accessibility information in this demo has been verified. Switch to “Include demo” to see sample data." action={<Button size="sm" variant="outline" onClick={() => setMode("any")}>Include demo data</Button>} />
            ) : (
              <ul className="divide-y">
                {accessibleRoutes.map(({ r, total, wc, lf }) => (
                  <li key={r.id} className="flex items-center gap-3 py-2.5">
                    <RouteChip number={r.number} code={r.operator} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{wc}/{total} wheelchair · {lf}/{total} low-floor <span className="text-warning">(demo)</span></p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/app/track?q=${encodeURIComponent(r.number)}`)}>Track</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HandHelping className="h-4 w-4 text-brand" /> Request boarding assistance</CardTitle>
            <CardDescription>Frontend demonstration only — requests are <strong>not sent</strong> to any operator.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-3" noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Route</Label>
                  <Select value={form.routeId} onValueChange={(v) => set("routeId", v)}>
                    <SelectTrigger aria-label="Route" aria-invalid={!!errors.routeId}><SelectValue placeholder="Choose route" /></SelectTrigger>
                    <SelectContent>{ROUTES.map((r) => <SelectItem key={r.id} value={r.id}>{r.number} · {r.name}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.routeId && <p className="mt-1 text-xs text-destructive">{errors.routeId}</p>}
                </div>
                <div>
                  <StopPicker label="Boarding stop" value={form.stopId} onChange={(v) => set("stopId", v)} invalid={!!errors.stopId} />
                  {errors.stopId && <p className="mt-1 text-xs text-destructive">{errors.stopId}</p>}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Assistance needed</Label>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger aria-label="Assistance type"><SelectValue /></SelectTrigger>
                    <SelectContent>{ASSIST_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="as-time" className="mb-1.5 block text-xs text-muted-foreground">Approx. boarding time</Label>
                  <Input id="as-time" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} aria-invalid={!!errors.time} />
                  {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time}</p>}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="as-name" className="mb-1.5 block text-xs text-muted-foreground">Your name</Label>
                  <Input id="as-name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} autoComplete="name" />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="as-phone" className="mb-1.5 block text-xs text-muted-foreground">Mobile number</Label>
                  <Input id="as-phone" inputMode="tel" placeholder="98xxxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} autoComplete="tel" />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="as-notes" className="mb-1.5 block text-xs text-muted-foreground">Notes (optional)</Label>
                <Textarea id="as-notes" value={form.notes} onChange={(e) => set("notes", e.target.value.slice(0, 300))} placeholder="Anything the crew should know" />
                <p className="mt-1 text-right text-[11px] text-muted-foreground">{form.notes.length}/300</p>
              </div>
              <Button type="submit" variant="brand">Submit demo request</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {requests.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your demo requests</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setRequests([]); toast("Requests cleared"); }}><Trash2 /> Clear</Button>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {requests.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2 py-2.5">
                  <RouteChip number={ROUTE_MAP[r.routeId].number} code={ROUTE_MAP[r.routeId].operator} className="h-6 text-xs" />
                  <span className="font-medium">{r.type}</span>
                  <span className="text-muted-foreground">at {STOP_MAP[r.stopId].name} around {r.time}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Saved locally {formatTime(r.createdAt)} · not sent</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!done} onOpenChange={(o) => !o && setDone(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="h-6 w-6" /></div>
            <DialogTitle>Demo request recorded</DialogTitle>
            <DialogDescription>
              This request was saved in your browser only. <strong>It has not been sent to any operator</strong>, and no one will be notified. In a live service, this is where the operator's confirmation would appear.
            </DialogDescription>
          </DialogHeader>
          {done && (
            <dl className="grid grid-cols-2 gap-y-1.5 rounded-lg border p-3 text-sm">
              <dt className="text-muted-foreground">Route</dt><dd className="text-right font-medium">{ROUTE_MAP[done.routeId].number}</dd>
              <dt className="text-muted-foreground">Stop</dt><dd className="text-right font-medium">{STOP_MAP[done.stopId].name}</dd>
              <dt className="text-muted-foreground">Assistance</dt><dd className="text-right font-medium">{done.type}</dd>
              <dt className="text-muted-foreground">Time</dt><dd className="text-right font-medium">{done.time}</dd>
            </dl>
          )}
          <DialogFooter><Button variant="brand" onClick={() => setDone(null)}>Got it</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
