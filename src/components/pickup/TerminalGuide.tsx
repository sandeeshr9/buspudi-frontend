import React from "react";
import { CHENNAI_TERMINALS } from "@/data/mockPickupData";
import {
  MapPin,
  Navigation,
} from "lucide-react";

export const TerminalGuide: React.FC = () => {
  return (
    <div id="terminal-guide" className="w-full space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-[#F9FAFB]">
          Chennai Intercity Terminal Relocation Guide
        </h2>
        <p className="text-xs text-[#9CA3AF]">
          Understanding how Chennai's bus departure points are zoned to prevent confusion and missed buses
        </p>
      </div>

      {/* 4 Terminals Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CHENNAI_TERMINALS.map((t) => (
          <div
            key={t.code}
            className="flex flex-col justify-between rounded-xl border border-[#374151] bg-[#1F2937] p-5 shadow-card"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#374151] pb-3">
                <span className="rounded bg-[#111827] px-2.5 py-1 text-xs font-bold text-white border border-[#374151]">
                  {t.code} Terminal
                </span>
                <span className="text-[11px] text-[#9CA3AF]">Chennai Pilot Zone</span>
              </div>

              <h3 className="mt-3 text-base font-bold text-[#F9FAFB]">{t.name}</h3>
              <div className="mt-1 flex items-start gap-1.5 text-xs text-[#D1D5DB]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                <span>{t.location}</span>
              </div>

              <div className="mt-3 rounded-lg border border-[#374151] bg-[#111827] p-3 text-xs">
                <div className="font-semibold text-white">Routes Handled:</div>
                <div className="mt-0.5 text-[#D1D5DB]">{t.routesHandled}</div>
              </div>

              <div className="mt-3 text-xs leading-relaxed text-[#9CA3AF]">
                <strong className="text-[#D1D5DB]">Operational Note:</strong>{" "}
                {t.relocationNote}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Practical Instructions When Mismatch Is Found */}
      <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
          <Navigation className="h-4 w-4 text-[#D1D5DB]" />
          4 Essential Steps When A Boarding Mismatch Is Detected
        </div>
        <p className="mt-1 text-xs text-[#9CA3AF]">
          Always follow this verification protocol before leaving your house:
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F2937] font-bold text-white border border-[#374151]">
              1
            </div>
            <div className="mt-2.5 font-bold text-[#F9FAFB]">
              Recheck Booking Confirmation
            </div>
            <p className="mt-1.5 leading-relaxed text-[#9CA3AF]">
              Check the latest SMS and email confirmation from your travel portal. Online tickets frequently receive boarding point updates 2 to 4 hours before departure.
            </p>
          </div>

          <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F2937] font-bold text-white border border-[#374151]">
              2
            </div>
            <div className="mt-2.5 font-bold text-[#F9FAFB]">
              Compare Operator's Instructions
            </div>
            <p className="mt-1.5 leading-relaxed text-[#9CA3AF]">
              Review the operator's official website or official circular. Clarify whether they operate feeder minivans from city hubs to Kilambakkam.
            </p>
          </div>

          <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F2937] font-bold text-white border border-[#374151]">
              3
            </div>
            <div className="mt-2.5 font-bold text-[#F9FAFB]">
              Contact Operator If Discrepancy Remains
            </div>
            <p className="mt-1.5 leading-relaxed text-[#9CA3AF]">
              Call the boarding point contact number provided on your ticket. Ask the dispatcher for the exact terminal bay or platform landmark.
            </p>
          </div>

          <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F2937] font-bold text-white border border-[#374151]">
              4
            </div>
            <div className="mt-2.5 font-bold text-[#F9FAFB]">
              Do Not Travel on Assumptions
            </div>
            <p className="mt-1.5 leading-relaxed text-[#9CA3AF]">
              Never travel to an unverified terminal based solely on hearsay. Give yourself at least 45 minutes extra buffer time when traveling along the GST corridor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
