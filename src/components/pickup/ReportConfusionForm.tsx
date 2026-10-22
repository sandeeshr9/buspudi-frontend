import React, { useState, useEffect } from "react";
import {
  SAMPLE_OPERATORS,
  SAMPLE_DESTINATIONS,
  type ConfusionReport,
} from "@/data/mockPickupData";
import {
  FileWarning,
  Send,
  CheckCircle,
  Trash2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "buspudi:confusion_reports";

export const ReportConfusionForm: React.FC = () => {
  const [operator, setOperator] = useState(SAMPLE_OPERATORS[0]);
  const [destination, setDestination] = useState(SAMPLE_DESTINATIONS[0]);
  const [ticketPickup, setTicketPickup] = useState("");
  const [actualPointReported, setActualPointReported] = useState("");
  const [issueCategory, setIssueCategory] = useState<ConfusionReport["issueCategory"]>("confusing_instructions");
  const [description, setDescription] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ConfusionReport | null>(null);

  // Stored reports list
  const [storedReports, setStoredReports] = useState<ConfusionReport[]>([]);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setStoredReports(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load demo confusion reports", e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketPickup.trim()) {
      toast.error("Please enter the pickup location stated on the ticket.");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      toast.error("Please provide at least 10 characters describing the confusion.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: ConfusionReport = {
        id: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        operator,
        destination,
        ticketPickup,
        actualPointReported: actualPointReported || "Not resolved yet",
        issueCategory,
        description,
        bookingRef: bookingRef.trim() || undefined,
        status: "Submitted in Demo",
      };

      const updated = [newReport, ...storedReports];
      setStoredReports(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Error saving report to localStorage", err);
      }

      setIsSubmitting(false);
      setSubmittedReport(newReport);
      toast.success("Report Submitted in Demo Mode", {
        description: `Reference #${newReport.id} logged to your local prototype storage.`,
      });

      // Clear fields
      setTicketPickup("");
      setActualPointReported("");
      setDescription("");
      setBookingRef("");
    }, 300);
  };

  const handleDeleteReport = (id: string) => {
    const updated = storedReports.filter((r) => r.id !== id);
    setStoredReports(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    toast.info("Demo report deleted from local storage.");
  };

  const handleClearAll = () => {
    if (confirm("Clear all demo reports stored on this device?")) {
      setStoredReports([]);
      localStorage.removeItem(STORAGE_KEY);
      toast.info("All local demo reports cleared.");
    }
  };

  return (
    <div id="report-confusion" className="w-full">
      {/* Title */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F9FAFB]">
            Report a Pickup Discrepancy or Confusion
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Help identify misleading boarding instructions, conflicting SMS alerts, or unnotified terminal shifts
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center rounded-lg border border-[#374151] bg-[#111827] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "form"
                ? "bg-[#1F2937] text-white shadow-sm"
                : "text-[#9CA3AF] hover:text-[#F9FAFB]"
            }`}
          >
            Submit Report
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "history"
                ? "bg-[#1F2937] text-white shadow-sm"
                : "text-[#9CA3AF] hover:text-[#F9FAFB]"
            }`}
          >
            Local Reports ({storedReports.length})
          </button>
        </div>
      </div>

      {activeTab === "form" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Form (Left 8 Cols) */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
              {/* Demo Notice Banner */}
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 text-xs text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <strong className="font-semibold text-amber-300">
                    Prototype Demonstration Mode:
                  </strong>{" "}
                  Reports submitted through this form are stored securely in your browser's local storage. This is an early-stage prototype for innovation testing and does NOT transmit complaints to government transport departments or private operators.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Operator and Destination */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                      Bus Operator
                    </label>
                    <select
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-xs text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      {SAMPLE_OPERATORS.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                      Destination
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-xs text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      {SAMPLE_DESTINATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Issue Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                    Category of Confusion
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) =>
                      setIssueCategory(e.target.value as ConfusionReport["issueCategory"])
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-xs text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="confusing_instructions">
                      Confusing or ambiguous pickup landmark instructions
                    </option>
                    <option value="conflicting_points">
                      Conflicting pickup points (e.g. SMS differs from ticket PDF)
                    </option>
                    <option value="unexpected_change">
                      Unexpected last-minute terminal change (e.g. Kilambakkam shift)
                    </option>
                    <option value="missing_bay">
                      Missing platform/bay or inaccessible terminal guidance
                    </option>
                  </select>
                </div>

                {/* Ticket Pickup vs Actual Point */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                      Pickup Location on Ticket <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketPickup}
                      onChange={(e) => setTicketPickup(e.target.value)}
                      placeholder="e.g. Vadapalani Metro"
                      className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2 text-xs text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                      Actual Boarding Point Encountered
                    </label>
                    <input
                      type="text"
                      value={actualPointReported}
                      onChange={(e) => setActualPointReported(e.target.value)}
                      placeholder="e.g. Kilambakkam KCBT Bay 4"
                      className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2 text-xs text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                    Describe What Happened <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details: What did the ticket say vs where did the bus actually depart from? Did the conductor call you? Did you have to take an emergency auto to Kilambakkam?"
                    className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-xs leading-relaxed text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                {/* Optional Booking Reference */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1D5DB]">
                    Booking Reference / PNR (Optional)
                  </label>
                  <input
                    type="text"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    placeholder="e.g. TN2026-B8123 (demo only)"
                    className="mt-1.5 w-full rounded-lg border border-[#374151] bg-[#111827] px-3.5 py-2 text-xs text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB] active:scale-[0.99] disabled:opacity-75 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B1220] border-t-transparent" />
                        Logging Demo Report...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Submit Confusion Report (Demo Prototype)
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Last Submitted Preview (Right 4 Cols) */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {/* Submitted Confirmation Card */}
              {submittedReport ? (
                <div className="rounded-2xl border border-emerald-800/60 bg-[#1F2937] p-5 shadow-card">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Report Logged in Demo
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-[#F9FAFB]">
                    Reference #{submittedReport.id}
                  </div>
                  <div className="mt-1 text-xs text-[#9CA3AF]">
                    Status:{" "}
                    <span className="rounded bg-emerald-950 px-2 py-0.5 font-semibold text-emerald-300 border border-emerald-700">
                      {submittedReport.status}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-[#D1D5DB] border-t border-[#374151] pt-3">
                    <strong>Route:</strong> {submittedReport.operator} → {submittedReport.destination}
                  </div>
                  <div className="mt-1 text-xs text-[#D1D5DB]">
                    <strong>Ticketed:</strong> {submittedReport.ticketPickup}
                  </div>
                  <div className="mt-1 text-xs text-[#D1D5DB]">
                    <strong>Actual:</strong> {submittedReport.actualPointReported}
                  </div>
                  <p className="mt-2 text-xs italic text-[#9CA3AF] line-clamp-3">
                    "{submittedReport.description}"
                  </p>
                  <div className="mt-3 text-[10px] text-[#64748B]">
                    Logged locally at {new Date(submittedReport.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ) : null}

              {/* Guidelines Card */}
              <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-5 shadow-card">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D1D5DB]">
                  <FileWarning className="h-4 w-4 text-white" />
                  Why Report Pickup Confusion?
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  During major transport terminal shifts (like Chennai's transition to Kilambakkam KCBT), third-party booking sites frequently fail to update their database manifests.
                </p>
                <div className="mt-3 space-y-2 text-xs text-[#D1D5DB]">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-white">•</span>
                    <span>Highlights outdated city boarding points still being sold online.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-white">•</span>
                    <span>Helps future passengers anticipate discrepancies before leaving home.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-white">•</span>
                    <span>Contributes to open research on intercity passenger information gaps.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between border-b border-[#374151] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#F9FAFB]">
                Submitted Demo Reports on This Device
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Stored locally in browser localStorage for prototype verification
              </p>
            </div>
            {storedReports.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-900/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Local Data
              </button>
            )}
          </div>

          {storedReports.length > 0 ? (
            <div className="space-y-3">
              {storedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#{rep.id}</span>
                      <span className="rounded bg-[#1F2937] px-2 py-0.5 text-[10px] font-semibold text-[#D1D5DB] border border-[#374151]">
                        {rep.status}
                      </span>
                      <span className="text-[#9CA3AF]">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReport(rep.id)}
                      className="text-[#64748B] transition hover:text-rose-400"
                      title="Delete report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <span className="text-[#9CA3AF]">Operator:</span>{" "}
                      <strong className="text-white">{rep.operator}</strong>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF]">Destination:</span>{" "}
                      <strong className="text-white">{rep.destination}</strong>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF]">Category:</span>{" "}
                      <span className="text-[#D1D5DB]">{rep.issueCategory.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div className="mt-2 rounded-lg bg-[#1F2937] p-2.5">
                    <div className="flex gap-4">
                      <div>
                        <span className="text-[#9CA3AF]">Ticketed:</span>{" "}
                        <span className="text-rose-300 font-medium">{rep.ticketPickup}</span>
                      </div>
                      <div>
                        <span className="text-[#9CA3AF]">Actual:</span>{" "}
                        <span className="text-emerald-300 font-medium">{rep.actualPointReported}</span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[#D1D5DB] italic">
                      "{rep.description}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Info className="mx-auto h-8 w-8 text-[#64748B]" />
              <h4 className="mt-2 text-sm font-bold text-[#F9FAFB]">
                No Demo Reports Stored Yet
              </h4>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Submit a test report using the form to see it saved locally here.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className="mt-3 rounded-lg border border-[#374151] bg-[#111827] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#374151]"
              >
                Go to Report Form
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
