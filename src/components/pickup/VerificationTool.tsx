import React, { useState, useEffect } from "react";
import {
  DEMO_SCENARIOS,
  SAMPLE_OPERATORS,
  SAMPLE_DESTINATIONS,
  verifyPickup,
  type DemoScenario,
  type VerificationResult,
} from "@/data/mockPickupData";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Database,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialScenarioId?: string;
  onScenarioSelect?: (scenario: DemoScenario) => void;
}

export const VerificationTool: React.FC<Props> = ({ initialScenarioId }) => {
  // Form state
  const [operator, setOperator] = useState("SETC (State Express Transport)");
  const [destination, setDestination] = useState("Madurai");
  const [ticketPickup, setTicketPickup] = useState("Vadapalani");
  const [travelDate, setTravelDate] = useState("2026-10-24");
  const [departureTime, setDepartureTime] = useState("21:30");
  const [notes, setNotes] = useState("Ticket mentions Vadapalani boarding counter near Metro pillar.");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("scenario-1");

  // Output result state
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize with scenario 1
  useEffect(() => {
    const s = DEMO_SCENARIOS.find((item) => item.id === (initialScenarioId || "scenario-1")) || DEMO_SCENARIOS[0];
    applyScenario(s, false);
  }, [initialScenarioId]);

  const applyScenario = (s: DemoScenario, notify: boolean = true) => {
    setSelectedScenarioId(s.id);
    setOperator(s.operator);
    setDestination(s.destination);
    setTicketPickup(s.ticketPickup);
    setTravelDate(s.travelDate);
    setDepartureTime(s.departureTime);
    setNotes(s.notes);

    // Calculate result dynamically
    const res = verifyPickup({
      operator: s.operator,
      destination: s.destination,
      ticketPickup: s.ticketPickup,
      travelDate: s.travelDate,
      departureTime: s.departureTime,
      notes: s.notes,
    });
    setResult(res);

    if (notify) {
      toast.info(`Loaded ${s.title}`, {
        description: `Expected outcome: ${s.expectedOutcome} (${s.scenarioSummary})`,
      });
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketPickup.trim()) {
      toast.error("Please enter the pickup location printed on your ticket.");
      return;
    }

    setIsVerifying(true);
    // Simulate swift comparison calculation
    setTimeout(() => {
      const res = verifyPickup({
        operator,
        destination,
        ticketPickup,
        travelDate,
        departureTime,
        notes,
      });
      setResult(res);
      setIsVerifying(false);

      if (res.status === "MATCH") {
        toast.success("Pickup Location Verified!", {
          description: "Matches authorized terminal in demo dataset.",
        });
      } else if (res.status === "MISMATCH") {
        toast.error("Potential Location Discrepancy!", {
          description: "The entered pickup differs from the sample service record.",
        });
      } else {
        toast.warning("Service Unverified", {
          description: "No verified record in sample dataset.",
        });
      }
    }, 280);
  };

  const handleReset = () => {
    setOperator(SAMPLE_OPERATORS[0]);
    setDestination(SAMPLE_DESTINATIONS[0]);
    setTicketPickup("");
    setTravelDate("2026-10-24");
    setDepartureTime("20:00");
    setNotes("");
    setSelectedScenarioId("");
    setResult(null);
    toast.info("Verification form reset.");
  };

  return (
    <div id="verify-tool" className="w-full">
      {/* Demo Scenario Selector Banner */}
      <div className="mb-6 rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#D1D5DB]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
              Interactive Sample Scenarios
            </span>
            <span className="inline-flex items-center rounded-full bg-[#1F2937] px-2.5 py-0.5 text-[11px] font-medium text-[#9CA3AF] border border-[#374151]">
              Illustrative Demo Data
            </span>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            Click a scenario to demonstrate instant verification outcomes
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {DEMO_SCENARIOS.map((s) => {
            const isSelected = selectedScenarioId === s.id;
            const badgeColor =
              s.expectedOutcome === "MATCH"
                ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
                : s.expectedOutcome === "MISMATCH"
                ? "border-rose-700/60 bg-rose-950/40 text-rose-400"
                : "border-amber-700/60 bg-amber-950/40 text-amber-400";

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className={`group flex flex-col justify-between rounded-lg border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-white/60 bg-[#1F2937] ring-1 ring-white/40 shadow-sm"
                    : "border-[#374151] bg-[#1F2937]/50 hover:border-[#4B5563] hover:bg-[#1F2937]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-[#F9FAFB] line-clamp-1">
                    {s.destination}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}
                  >
                    {s.tag}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-[#9CA3AF] line-clamp-2 leading-tight">
                  {s.ticketPickup}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#D1D5DB]">
                  <span className="truncate">{s.operator.split(" ")[0]}</span>
                  <ArrowRight
                    className={`h-3 w-3 transition-transform ${
                      isSelected ? "translate-x-0.5 text-white" : "text-[#64748B]"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form + Verification Result */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Verification Form (Left 5 Cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between border-b border-[#374151] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#F9FAFB]">
                  Verify My Bus Pickup
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Compare your ticketed boarding point with authorized terminal records
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                title="Reset Form"
                className="flex items-center gap-1 rounded-md border border-[#374151] bg-[#111827] px-2.5 py-1.5 text-xs text-[#9CA3AF] transition hover:bg-[#1F2937] hover:text-[#F9FAFB]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* Operator */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                  Bus Operator / Service Name
                </label>
                <div className="mt-1.5">
                  <select
                    value={operator}
                    onChange={(e) => {
                      setOperator(e.target.value);
                      setSelectedScenarioId("");
                    }}
                    className="w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    {SAMPLE_OPERATORS.map((op) => (
                      <option key={op} value={op} className="bg-[#111827] text-[#F9FAFB]">
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                  Destination City
                </label>
                <div className="mt-1.5">
                  <select
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setSelectedScenarioId("");
                    }}
                    className="w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    {SAMPLE_DESTINATIONS.map((dest) => (
                      <option key={dest} value={dest} className="bg-[#111827] text-[#F9FAFB]">
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pickup location printed on ticket */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                    Pickup Location on Ticket <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-[#9CA3AF]">Exact printed boarding point</span>
                </div>
                <div className="mt-1.5">
                  <input
                    type="text"
                    required
                    value={ticketPickup}
                    onChange={(e) => {
                      setTicketPickup(e.target.value);
                      setSelectedScenarioId("");
                    }}
                    placeholder="e.g. Vadapalani, Koyambedu CMBT, Tambaram, Kilambakkam"
                    className="w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                {/* Quick suggestions */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Vadapalani", "Kilambakkam (KCBT)", "Koyambedu (CMBT)", "Tambaram Railway Stn", "Tambaram MEPZ", "Guindy"].map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setTicketPickup(p);
                          setSelectedScenarioId("");
                        }}
                        className="rounded-md border border-[#374151] bg-[#111827] px-2 py-0.5 text-[11px] text-[#9CA3AF] transition hover:border-[#64748B] hover:text-[#F9FAFB]"
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3 py-2 text-sm text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3 py-2 text-sm text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              {/* Optional instructions / notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                  Optional Instructions / Booking Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 'Wait near metro pillar 123', 'Reporting time 20:45'"
                  className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2 text-sm text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#0B1220] transition-all hover:bg-[#E5E7EB] active:scale-[0.99] disabled:opacity-75 shadow-md flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B1220] border-t-transparent" />
                      Analyzing Records...
                    </>
                  ) : (
                    <>
                      Verify My Bus Pickup
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF]">
                <Info className="h-3.5 w-3.5 text-[#64748B]" />
                Calculated instantly against sample Chennai service regulations
              </div>
            </form>
          </div>
        </div>

        {/* Verification Result Display (Right 7 Cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div
              className={`rounded-2xl border p-6 shadow-card transition-all ${
                result.status === "MATCH"
                  ? "border-emerald-700/60 bg-[#1F2937]"
                  : result.status === "MISMATCH"
                  ? "border-rose-700/60 bg-[#1F2937]"
                  : "border-amber-700/60 bg-[#1F2937]"
              }`}
            >
              {/* Status Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#374151] pb-4">
                <div className="flex items-center gap-3">
                  {result.status === "MATCH" && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  {result.status === "MISMATCH" && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-950 border border-rose-500/50 text-rose-400">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  )}
                  {result.status === "UNVERIFIED" && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-950 border border-amber-500/50 text-amber-400">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-widest border ${
                          result.status === "MATCH"
                            ? "border-emerald-600 bg-emerald-950 text-emerald-300"
                            : result.status === "MISMATCH"
                            ? "border-rose-600 bg-rose-950 text-rose-300"
                            : "border-amber-600 bg-amber-950 text-amber-300"
                        }`}
                      >
                        {result.status}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        Route: <strong className="text-[#F9FAFB]">{result.destination}</strong>
                      </span>
                    </div>
                    <h4 className="mt-1 text-base font-bold text-[#F9FAFB]">
                      {result.status === "MATCH" && "Pickup Point Verified in Sample Records"}
                      {result.status === "MISMATCH" && "Potential Boarding Discrepancy Detected"}
                      {result.status === "UNVERIFIED" && "Service Data Unverified / Incomplete"}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center rounded bg-[#111827] px-2.5 py-1 text-[11px] font-medium text-[#9CA3AF] border border-[#374151]">
                    Sample Dataset v2026.3
                  </span>
                </div>
              </div>

              {/* Side-by-Side Location Comparison */}
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Entered Pickup */}
                <div className="rounded-xl border border-[#374151] bg-[#111827] p-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    <span>Entered on Ticket</span>
                    <span className="text-[10px] text-[#64748B]">Passenger Input</span>
                  </div>
                  <div className="mt-2 text-base font-bold text-[#F9FAFB]">
                    {result.enteredPickup}
                  </div>
                  <div className="mt-1 text-xs text-[#9CA3AF]">
                    Operator: <span className="text-[#D1D5DB]">{result.operator}</span>
                  </div>
                </div>

                {/* Expected Pickup from service record */}
                <div
                  className={`rounded-xl border p-4 ${
                    result.status === "MATCH"
                      ? "border-emerald-800/60 bg-emerald-950/20"
                      : result.status === "MISMATCH"
                      ? "border-rose-800/60 bg-rose-950/20"
                      : "border-amber-800/60 bg-amber-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    <span>Expected Pickup Point</span>
                    <span className="text-[10px] text-[#64748B]">Sample Service Record</span>
                  </div>
                  <div
                    className={`mt-2 text-base font-bold ${
                      result.status === "MATCH"
                        ? "text-emerald-300"
                        : result.status === "MISMATCH"
                        ? "text-rose-300"
                        : "text-amber-300"
                    }`}
                  >
                    {result.expectedPickup}
                  </div>
                  <div className="mt-1 text-xs text-[#9CA3AF]">
                    Status:{" "}
                    <span className="text-[#D1D5DB]">
                      {result.status === "MATCH"
                        ? "Exact Match"
                        : result.status === "MISMATCH"
                        ? "Locations Differ"
                        : "No Confirmed Record"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning / Explanation Block */}
              <div className="mt-5 rounded-xl border border-[#374151] bg-[#111827] p-4">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#D1D5DB]" />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB]">
                      {result.warningTitle || "Verification Explanation"}
                    </h5>
                    <p className="mt-1 text-xs leading-relaxed text-[#D1D5DB]">
                      {result.warningReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="mt-5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Recommended Next Steps Before Travelling:
                </h5>
                <ul className="mt-2.5 space-y-2">
                  {result.recommendedSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-[#374151]/80 bg-[#111827]/70 p-3 text-xs text-[#D1D5DB]"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#374151] text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="leading-normal">{step.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Operator Contact Helpline Placeholder */}
              <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-[#374151] bg-[#111827] p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F2937] text-white">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#9CA3AF]">
                      Operator Contact / Helpline Placeholder
                    </div>
                    <div className="text-sm font-bold text-[#F9FAFB]">
                      {result.operatorContact.phone}
                    </div>
                  </div>
                </div>
                <a
                  href={`tel:${result.operatorContact.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#374151] bg-[#1F2937] px-3.5 py-2 text-xs font-semibold text-[#F9FAFB] transition hover:bg-[#374151]"
                >
                  Confirm with Operator
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Transparency Metadata Footer */}
              <div className="mt-5 border-t border-[#374151] pt-3 text-[11px] text-[#9CA3AF]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3 w-3 text-[#64748B]" />
                    <span>Source: {result.dataSource}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-[#64748B]" />
                    <span>Last Updated: {result.lastUpdated}</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-[#64748B] italic">
                  {result.reliabilityNote}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#374151] bg-[#1F2937]/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[#64748B]">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[#F9FAFB]">
                Ready to Verify
              </h4>
              <p className="mt-1 max-w-sm text-xs text-[#9CA3AF]">
                Fill out the ticket details on the left, or pick one of the sample scenarios above to view an instant verification report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
