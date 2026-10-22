import React from "react";
import { ShieldAlert, Database, AlertCircle, CheckCircle2 } from "lucide-react";

export const DataReliabilitySection: React.FC = () => {
  return (
    <div id="data-reliability" className="w-full">
      <div className="rounded-2xl border border-[#374151] bg-[#111827] p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#374151] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-white border border-[#374151]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F9FAFB]">
                Data Reliability, Limitations & Project Scope
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Transparent principles guiding the BusPudi prototype and demonstration datasets
              </p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-md border border-[#374151] bg-[#1F2937] px-3 py-1 text-xs font-semibold text-[#D1D5DB]">
            Early-Stage Prototype Notice
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Item 1 */}
          <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <Database className="h-4 w-4 text-[#64748B]" />
              Sample Datasets Only
            </div>
            <p className="mt-2 leading-relaxed text-[#9CA3AF]">
              BusPudi utilizes illustrative sample records based on published regional relocation orders (such as the Chennai Kilambakkam KCBT transition). It does <strong>not</strong> claim live API integration with bus operator ticketing engines or private PNR databases.
            </p>
          </div>

          {/* Item 2 */}
          <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <AlertCircle className="h-4 w-4 text-[#64748B]" />
              Sample Mismatch vs Real Error
            </div>
            <p className="mt-2 leading-relaxed text-[#9CA3AF]">
              A "MISMATCH" flagged by this tool signifies a variance between the passenger's ticket input and the demonstration service record. It serves as an advisory alert to prompt passenger verification, not a certified legal judgment of operator default.
            </p>
          </div>

          {/* Item 3 */}
          <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <CheckCircle2 className="h-4 w-4 text-[#64748B]" />
              No Guarantee of Travel
            </div>
            <p className="mt-2 leading-relaxed text-[#9CA3AF]">
              BusPudi is an advisory pre-travel checkpoint. It cannot guarantee that passengers will never miss a bus due to unforeseen road traffic, mechanical delays, or last-minute operational shifts. Passengers must always reconfirm directly with their operator.
            </p>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="mt-6 rounded-xl border border-[#374151] bg-[#1F2937]/60 p-4 text-xs text-[#9CA3AF]">
          <strong className="text-white">Independent Academic & Innovation Initiative:</strong>{" "}
          BusPudi is built independently as a human-centered transport-tech solution for regional passenger mobility challenges. It holds no official commercial partnership or government affiliation with SETC, TNSTC, CMDA, or private transport federations.
        </div>
      </div>
    </div>
  );
};
