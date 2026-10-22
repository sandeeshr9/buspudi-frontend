import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { X } from "lucide-react";

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"about" | "contact" | "privacy" | "terms" | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="w-full border-t border-[#374151] bg-[#111827] text-xs text-[#9CA3AF]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Col 1: Brand & Tagline (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <Logo to="/" showTagline={true} />
              <p className="max-w-md text-xs leading-relaxed text-[#9CA3AF] pt-1">
                Wayzo is a unified bus tracking and passenger mobility platform bringing city MTC lines, intercity state express buses, and private coaches into one clear interface.
              </p>
              <div className="text-[11px] text-[#64748B]">
                Initial Focus: Chennai & Tamil Nadu • Offline Maps & Accessibility Support
              </div>
            </div>

            {/* Col 2: Navigation Links (3 cols) */}
            <div className="md:col-span-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
                Core Features
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link to="/app/track" className="hover:text-white transition">
                    Live Bus Tracking
                  </Link>
                </li>
                <li>
                  <Link to="/app/plan" className="hover:text-white transition">
                    Journey Planner
                  </Link>
                </li>
                <li>
                  <Link to="/app/offline" className="hover:text-white transition">
                    Offline Maps & Routes
                  </Link>
                </li>
                <li>
                  <Link to="/app/accessibility" className="hover:text-white transition">
                    Accessibility & Support
                  </Link>
                </li>
                <li>
                  <Link to="/app/stops" className="hover:text-white transition">
                    Stops & Departure Boards
                  </Link>
                </li>
                <li>
                  <Link to="/app/alerts" className="hover:text-white transition">
                    Transit Service Alerts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Transparency & Legal Modals (4 cols) */}
            <div className="md:col-span-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
                Transparency & Legal
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Frontend demonstration prototype. Real-time fleet data is simulated for academic and mobility innovation demonstration.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("about")}
                  className="hover:text-white transition underline"
                >
                  About Wayzo
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
              © 2026 Wayzo — Every Bus. Every Route. In One Place.
            </div>
            <div>
              Demonstration prototype • Independent student innovation initiative.
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
                <h3 className="text-lg font-bold text-white">About Wayzo</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    <strong>Wayzo</strong> is built on a single, clear premise: <em>“Every Bus. Every Route. In One Place.”</em>
                  </p>
                  <p>
                    Passengers traveling through Chennai and Tamil Nadu often struggle to coordinate multiple fragmented services—navigating an MTC city bus to a terminal, transferring to an intercity SETC/TNSTC coach, or finding private bus pickup coordinates.
                  </p>
                  <p>
                    Wayzo unites live bus tracking, multi-leg journey planning, offline downloadable corridor manifests, stop departure boards, and accessibility filters into a unified, passenger-first interface.
                  </p>
                </div>
              </div>
            )}

            {activeModal === "contact" && (
              <div>
                <h3 className="text-lg font-bold text-white">Contact & Feedback</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    Have ideas or suggestions for improving Wayzo? We welcome inquiries from transport enthusiasts, reviewers, and passengers.
                  </p>
                  <div className="rounded-lg border border-[#374151] bg-[#111827] p-3 text-xs">
                    <div className="font-semibold text-white">Wayzo Mobility Project Team</div>
                    <div className="text-[#9CA3AF] mt-0.5">Email: team@wayzo.app (Sample Contact)</div>
                    <div className="text-[#9CA3AF]">Focus Area: Chennai, Tamil Nadu, India</div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-lg font-bold text-white">Privacy Notice</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    <strong>Client-Side Storage:</strong> Saved routes, offline corridor packages, preferences, and demonstration assistance requests are stored strictly in your browser's local storage.
                  </p>
                  <p>
                    We do not harvest or sell your location coordinates or travel history.
                  </p>
                </div>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 className="text-lg font-bold text-white">Terms of Demonstration</h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#D1D5DB]">
                  <p>
                    <strong>Simulated Prototype:</strong> All vehicle positions, arrival ETAs, fares, occupancy percentages, and service alerts in this demonstration are simulated sample data generated in the browser.
                  </p>
                  <p>
                    Wayzo is not affiliated with, endorsed by, or partnered with MTC, SETC, TNSTC, or any private transport operator.
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
