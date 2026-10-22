<<<<<<< HEAD
import React, { useState } from "react";
import { Bus, X } from "lucide-react";

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"about" | "contact" | "privacy" | "terms" | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="w-full border-t border-[#374151] bg-[#111827] text-xs text-[#9CA3AF]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Col 1: Brand & Mission (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0B1220]">
                  <Bus className="h-4 w-4" />
                </div>
                <span className="text-base font-extrabold text-[#F9FAFB]">
                  BusPudi
                </span>
                <span className="rounded bg-[#1F2937] px-2 py-0.5 text-[10px] font-semibold text-[#D1D5DB] border border-[#374151]">
                  Prototype
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-[#9CA3AF]">
                BusPudi is a transport-tech platform created to help intercity bus passengers verify their pickup locations, prevent boarding confusion, and avoid missing buses due to outdated terminal information.
              </p>
              <div className="text-[11px] text-[#64748B]">
                Focus Area: Chennai Metropolitan Area (Kilambakkam KCBT, Koyambedu CMBT, Tambaram, Madhavaram).
              </div>
            </div>

            {/* Col 2: Quick Links (3 cols) */}
            <div className="md:col-span-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
                Platform Navigation
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a href="#verify-tool" className="hover:text-white transition">
                    Verify My Bus Pickup
                  </a>
                </li>
                <li>
                  <a href="#service-directory" className="hover:text-white transition">
                    Sample Service Directory
                  </a>
                </li>
                <li>
                  <a href="#report-confusion" className="hover:text-white transition">
                    Report Confusion (Demo)
                  </a>
                </li>
                <li>
                  <a href="#terminal-guide" className="hover:text-white transition">
                    Chennai Terminal Guide
                  </a>
                </li>
                <li>
                  <a href="#data-reliability" className="hover:text-white transition">
                    Data Reliability & Scope
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Modals (4 cols) */}
            <div className="md:col-span-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
                Transparency & Legal
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Illustrative demonstration datasets only. All mock services and discrepancies are prepared for student transport-tech demonstration.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("about")}
                  className="hover:text-white transition underline"
                >
                  About BusPudi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal("contact")}
                  className="hover:text-white transition underline"
                >
                  Contact & Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal("privacy")}
                  className="hover:text-white transition underline"
                >
                  Privacy Notice
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal("terms")}
                  className="hover:text-white transition underline"
                >
                  Terms of Use
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-8 border-t border-[#374151] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-[#64748B]">
            <div>
              © 2026 BusPudi. Built for Student Innovation & Mobility Verification.
            </div>
            <div>
              No official affiliation with SETC, TNSTC, CMDA, or private omnibuses.
            </div>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-2xl text-[#D1D5DB]">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#111827] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === "about" && (
              <div>
                <h3 className="text-lg font-bold text-white">About BusPudi</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    <strong>BusPudi</strong> ("Verify Your Pickup Before You Travel") was created to solve a pervasive intercity mobility issue: passengers booking online tickets that list outdated, legacy, or ambiguous pickup locations, resulting in frantic last-minute trips or missed buses.
                  </p>
                  <p>
                    Following Chennai's major intercity bus terminal reorganization—where south-bound operations relocated to Kilambakkam (KCBT)—many third-party aggregators still issue receipts listing Vadapalani, Koyambedu, or curbside highway stops.
                  </p>
                  <p>
                    BusPudi serves as an independent pre-travel checkpoint, alerting passengers to potential discrepancies before they leave home.
                  </p>
                </div>
              </div>
            )}

            {activeModal === "contact" && (
              <div>
                <h3 className="text-lg font-bold text-white">Contact & Feedback</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    Have feedback or questions about the BusPudi prototype? We welcome suggestions from passengers, transport researchers, and competition reviewers.
                  </p>
                  <div className="rounded-lg border border-[#374151] bg-[#111827] p-3 text-xs">
                    <div className="font-semibold text-white">Student Innovation Project Team</div>
                    <div className="text-[#9CA3AF] mt-0.5">Email: feedback@buspudi.demo (Sample Contact)</div>
                    <div className="text-[#9CA3AF]">Location: Chennai, Tamil Nadu, India</div>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF]">
                    For emergency bus queries or ticket cancellations, please contact your ticketed operator directly.
                  </p>
                </div>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-lg font-bold text-white">Privacy Notice</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    <strong>Client-Side Processing:</strong> All verification queries and reported confusion logs are handled exclusively within your local browser environment.
                  </p>
                  <p>
                    We do not track, transmit, or monetize your travel plans, personal phone numbers, or booking receipts. Local storage items can be cleared at any time via your browser settings or using the "Clear Local Data" button on the Report Confusion tab.
                  </p>
                </div>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 className="text-lg font-bold text-white">Terms of Demonstration</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    <strong>Advisory Nature:</strong> The information provided by BusPudi is for illustrative and pre-travel verification purposes.
                  </p>
                  <p>
                    Because transport schedules and emergency police diversions can shift unexpectedly, BusPudi does not provide an absolute legal guarantee that buses will arrive at specific bays. Passengers remain responsible for confirming their travel status with their operator.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0B1220] hover:bg-[#E5E7EB]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
=======
import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">A unified view of city and intercity buses in Chennai. This is a frontend demonstration using simulated data.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/#features" className="hover:text-foreground">Features</Link></li>
            <li><Link to="/app/track" className="hover:text-foreground">Live tracking</Link></li>
            <li><Link to="/app/plan" className="hover:text-foreground">Journey planner</Link></li>
            <li><Link to="/operator" className="hover:text-foreground">Operator preview</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col gap-2 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} BusPudi. Demo build — not affiliated with MTC, SETC, TNSTC or any private operator.</span>
          <span>Map data © OpenStreetMap contributors</span>
        </div>
      </div>
    </footer>
  );
}
>>>>>>> origin/main
