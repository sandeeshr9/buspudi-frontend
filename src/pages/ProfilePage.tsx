import { Bell, Bookmark, Bus, Globe, Palette, RotateCcw, Save, UserRound, Accessibility } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { InfoNote, OperatorBadge, RouteChip } from "@/components/common/Badges";
import { EmptyState, PageHeader } from "@/components/common/States";
import { StopPicker } from "@/components/common/StopPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";
import { OPERATOR_LIST } from "@/data/operators";
import { STOP_MAP } from "@/data/stops";
import { VEHICLE_MAP } from "@/data/vehicles";
import { ROUTE_MAP } from "@/data/routes";
import type { LanguagePref, ThemePref, UserSettings } from "@/types";

export default function ProfilePage() {
  const { profile, setProfile, settings, updateSettings, theme, setTheme, savedBuses, toggleSavedBus, favouriteStops, resetAll } = useApp();
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (draft.name.trim().length < 2) er.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email)) er.email = "Enter a valid email address.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setProfile({ ...draft, name: draft.name.trim() });
    toast.success("Profile saved", { description: "Stored only in this browser." });
  };

  const setNotif = (k: keyof UserSettings["notifications"], v: boolean) => updateSettings({ notifications: { ...settings.notifications, [k]: v } });
  const setA11y = (k: keyof UserSettings["accessibility"], v: boolean) => updateSettings({ accessibility: { ...settings.accessibility, [k]: v } });
  const toggleOp = (code: (typeof OPERATOR_LIST)[number]["code"], on: boolean) => {
    const next = on ? [...settings.preferredOperators, code] : settings.preferredOperators.filter((c) => c !== code);
    if (next.length === 0) { toast.error("Keep at least one operator selected"); return; }
    updateSettings({ preferredOperators: next });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile & settings" description="A mock profile for this demo. There's no sign-in, and everything is stored locally in your browser." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRound className="h-4 w-4 text-brand" /> Profile</CardTitle>
              <CardDescription>Mock profile — no account or authentication.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="grid gap-4" noValidate>
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-navy-900 font-display text-lg font-bold text-teal-300 dark:bg-accent">
                    {draft.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?"}
                  </div>
                  <div className="text-sm text-muted-foreground">Avatar is generated from your initials.</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="p-name" className="mb-1.5 block text-xs text-muted-foreground">Name</Label>
                    <Input id="p-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} aria-invalid={!!errors.name} />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="p-email" className="mb-1.5 block text-xs text-muted-foreground">Email</Label>
                    <Input id="p-email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <StopPicker label="Home stop" value={draft.homeStopId} onChange={(v) => setDraft({ ...draft, homeStopId: v })} />
                  <StopPicker label="Work / college stop" value={draft.workStopId} onChange={(v) => setDraft({ ...draft, workStopId: v })} icon="destination" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="brand" disabled={!dirty}><Save /> Save profile</Button>
                  {dirty && <Button type="button" variant="ghost" onClick={() => { setDraft(profile); setErrors({}); }}>Discard</Button>}
                  <Button asChild variant="outline" className="ml-auto"><Link to={`/app/plan?from=${profile.homeStopId}&to=${profile.workStopId}`}>Plan commute</Link></Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bookmark className="h-4 w-4 text-brand" /> Saved buses & stops</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buses</p>
                {savedBuses.length === 0 ? <EmptyState icon={Bus} title="No saved buses" description="Use “Save bus” on a bus's details." className="py-6" /> : (
                  <ul className="space-y-1.5">
                    {savedBuses.map((id) => {
                      const v = VEHICLE_MAP[id];
                      if (!v) return null;
                      const r = ROUTE_MAP[v.routeId];
                      return (
                        <li key={id} className="flex items-center gap-2 rounded-lg border p-2">
                          <RouteChip number={r.number} code={r.operator} className="h-6 text-xs" />
                          <Link to={`/app/bus/${id}`} className="flex-1 truncate text-sm hover:underline">{v.label} · {r.name}</Link>
                          <Button size="sm" variant="ghost" onClick={() => toggleSavedBus(id)}>Remove</Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stops</p>
                <div className="flex flex-wrap gap-1.5">
                  {favouriteStops.length === 0 ? <span className="text-sm text-muted-foreground">No favourite stops.</span> : favouriteStops.map((id) => <Link key={id} to={`/app/stops?stop=${id}`} className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted">{STOP_MAP[id]?.name}</Link>)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bus className="h-4 w-4 text-brand" /> Preferred operators</CardTitle><CardDescription>Live tracking starts filtered to these operators.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {OPERATOR_LIST.map((op) => (
                <Checkbox key={op.code} id={`op-${op.code}`} checked={settings.preferredOperators.includes(op.code)} onCheckedChange={(v) => toggleOp(op.code, v)} label={<span className="inline-flex items-center gap-2"><OperatorBadge code={op.code} />{op.category}</span>} description={op.description} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4 text-brand" /> Appearance & language</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-xs text-muted-foreground">Theme</Label>
                <Select value={theme} onValueChange={(v) => setTheme(v as ThemePref)}>
                  <SelectTrigger aria-label="Theme"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="system">Match system</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Globe className="h-3.5 w-3.5" /> Language</Label>
                <Select value={settings.language} onValueChange={(v) => { updateSettings({ language: v as LanguagePref }); toast.success(v === "ta" ? "தமிழ் தேர்ந்தெடுக்கப்பட்டது" : "English selected", { description: "Navigation and key labels are translated in this demo." }); }}>
                  <SelectTrigger aria-label="Language"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ta">தமிழ் (Tamil) — partial</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-brand" /> Notifications</CardTitle><CardDescription>Preferences only — the demo doesn't send notifications.</CardDescription></CardHeader>
            <CardContent className="divide-y">
              <SwitchRow id="n1" label="Service alerts" desc="Delays, diversions and cancellations" checked={settings.notifications.serviceAlerts} onChange={(v) => setNotif("serviceAlerts", v)} />
              <SwitchRow id="n2" label="Arrival reminders" desc="Before a saved bus reaches your stop" checked={settings.notifications.arrivalReminders} onChange={(v) => setNotif("arrivalReminders", v)} />
              <SwitchRow id="n3" label="Saved route updates" desc="Changes to routes you've saved" checked={settings.notifications.savedRouteUpdates} onChange={(v) => setNotif("savedRouteUpdates", v)} />
              <SwitchRow id="n4" label="Product news" desc="Occasional BusPudi updates" checked={settings.notifications.productNews} onChange={(v) => setNotif("productNews", v)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Accessibility className="h-4 w-4 text-brand" /> Accessibility preferences</CardTitle></CardHeader>
            <CardContent className="divide-y">
              <SwitchRow id="a1" label="Larger text" desc="Increase text size across the app" checked={settings.accessibility.largeText} onChange={(v) => setA11y("largeText", v)} />
              <SwitchRow id="a2" label="Reduce motion" desc="Minimise animations and transitions" checked={settings.accessibility.reduceMotion} onChange={(v) => setA11y("reduceMotion", v)} />
              <SwitchRow id="a3" label="Accessible buses first" desc="Live tracking starts with the wheelchair (demo) filter on" checked={settings.accessibility.accessibleFirst} onChange={(v) => setA11y("accessibleFirst", v)} />
              <SwitchRow id="a4" label="Detailed map style" desc="Use the standard OpenStreetMap style with stronger contrast" checked={settings.accessibility.highContrastMap} onChange={(v) => setA11y("highContrastMap", v)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Data</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoNote>Everything on this page lives in your browser's local storage. Clearing it removes saved journeys, stops, buses and preferences.</InfoNote>
              <Button variant="outline" className="text-destructive" onClick={() => setConfirmReset(true)}><RotateCcw /> Reset all demo data</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all demo data?</DialogTitle>
            <DialogDescription>This clears your saved journeys, favourites, profile and settings from this browser. It can't be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { resetAll(); setDraft({ name: "Demo Passenger", email: "passenger@example.com", homeStopId: "ramapuram", workStopId: "guindy" }); setConfirmReset(false); toast.success("Demo data reset"); }}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SwitchRow({ id, label, desc, checked, onChange }: { id: string; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
