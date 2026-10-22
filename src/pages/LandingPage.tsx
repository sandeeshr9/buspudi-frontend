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
              </div>
            </div>
          </div>
        </section>

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
      <Footer />
    </div>
  );
}
