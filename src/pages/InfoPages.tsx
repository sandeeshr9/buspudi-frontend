import { CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { InfoNote } from "@/components/common/Badges";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Shell({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-3xl py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          {lead && <p className="mt-3 text-lg text-muted-foreground">{lead}</p>}
          <div className="prose-sm mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/90 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function AboutPage() {
  return (
    <Shell title="About Wayzo" lead="Every Bus. Every Route. In One Place.">
      <p>Chennai travellers often juggle several sources to make one trip: a city bus to a terminus, then an intercity coach from a different operator. Wayzo explores what it would look like to bring that entire journey into one clear interface — live tracking, journey planning, stop departure boards, offline maps, and accessibility support together.</p>
      <h2>What this build is</h2>
      <p>This is a frontend demonstration. Every bus position, timetable, occupancy figure and alert is simulated sample data generated in your browser. Nothing here reflects real-time operator information.</p>
      <h2>What it would take to go live</h2>
      <p>Real-time tracking depends on operators publishing vehicle positions and timetables (for example as GTFS and GTFS-Realtime feeds) and on agreements to use that data. Wayzo has no partnership with MTC, SETC, TNSTC or any private operator.</p>
      <InfoNote>Want to see it in action? <Link to="/app/track" className="font-medium underline">Open live tracking</Link> or <Link to="/app/plan" className="font-medium underline">plan a journey</Link>.</InfoNote>
    </Shell>
  );
}

export function PrivacyPage() {
  return (
    <Shell title="Privacy" lead="Short version: this demo doesn't collect or send your data.">
      <h2>Data stored on your device</h2>
      <p>Saved journeys, favourite stops, saved buses, your mock profile and settings are stored in your browser's local storage. They never leave your device and you can clear them any time from Profile &amp; settings.</p>
      <h2>Location</h2>
      <p>If you choose “Use my location”, your browser shares your position with this page only to find nearby stops. It isn't stored or transmitted. If you decline, a fixed demo location is used.</p>
      <h2>Map tiles</h2>
      <p>Map images are loaded from OpenStreetMap-based tile servers (OpenStreetMap and CARTO). Those services receive standard web requests for map tiles, as with any web map.</p>
      <h2>Forms</h2>
      <p>The contact and assistance forms are demonstrations. Submissions are not sent anywhere.</p>
    </Shell>
  );
}

export function TermsPage() {
  return (
    <Shell title="Terms of use" lead="Please read before relying on anything you see here.">
      <h2>Demonstration only</h2>
      <p>Wayzo is a prototype. All transport information — bus locations, arrival estimates, timetables, fares, occupancy, accessibility details and alerts — is simulated sample data and must not be used to make travel decisions.</p>
      <h2>No operator affiliation</h2>
      <p>Operator names are used only to describe categories of service. Wayzo is not affiliated with, endorsed by, or partnered with any transport operator.</p>
      <h2>Accessibility information</h2>
      <p>Accessibility details are not verified. Always confirm with the operator before travelling.</p>
      <h2>Map data</h2>
      <p>Map data © OpenStreetMap contributors, available under the Open Database License.</p>
    </Shell>
  );
}

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = "Please enter a valid email.";
    if (form.message.trim().length < 10) er.message = "Message should be at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
    toast.success("Message recorded (demo)", { description: "Nothing was sent — this form is a frontend demonstration." });
  };

  return (
    <Shell title="Contact" lead="Feedback, partnership questions or bug reports.">
      <Card>
        <CardContent className="p-6">
          {sent ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
              <p className="mt-3 font-semibold">Thanks, {form.name.split(" ")[0]}!</p>
              <p className="mt-1 text-sm text-muted-foreground">This is a demo form, so your message wasn't actually sent.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "general", message: "" }); }}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="c-name" className="mb-1.5 block">Name</Label>
                  <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} autoComplete="name" />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="c-email" className="mb-1.5 block">Email</Label>
                  <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} autoComplete="email" />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Topic</Label>
                <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
                  <SelectTrigger aria-label="Topic"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General feedback</SelectItem>
                    <SelectItem value="operator">Operator / data partnership</SelectItem>
                    <SelectItem value="accessibility">Accessibility</SelectItem>
                    <SelectItem value="bug">Report a bug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="c-msg" className="mb-1.5 block">Message</Label>
                <Textarea id="c-msg" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button type="submit" variant="brand" className="w-fit"><Mail /> Send message</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Shell>
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div>
          <p className="font-display text-6xl font-extrabold text-brand">404</p>
          <h1 className="mt-3 text-2xl font-bold">This stop isn't on our route</h1>
          <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild variant="brand"><Link to="/">Go home</Link></Button>
            <Button asChild variant="outline"><Link to="/app/track">Track a bus</Link></Button>
          </div>
        </div>
      </main>
    </div>
  );
}
