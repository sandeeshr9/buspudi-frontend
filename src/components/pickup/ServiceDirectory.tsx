import React, { useState, useMemo } from "react";
import {
  SAMPLE_SERVICES,
  SAMPLE_OPERATORS,
  SAMPLE_DESTINATIONS,
  CHENNAI_TERMINALS,
  type SampleServiceRecord,
} from "@/data/mockPickupData";
import {
  Search,
  MapPin,
  Clock,
  Phone,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface Props {
  onSelectService?: (service: SampleServiceRecord) => void;
}

export const ServiceDirectory: React.FC<Props> = ({ onSelectService }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerminal, setSelectedTerminal] = useState<string>("ALL");
  const [selectedOperator, setSelectedOperator] = useState<string>("ALL");
  const [selectedDestination, setSelectedDestination] = useState<string>("ALL");

  const filteredServices = useMemo(() => {
    return SAMPLE_SERVICES.filter((srv) => {
      // Terminal filter
      if (selectedTerminal !== "ALL" && srv.terminalCode !== selectedTerminal) {
        return false;
      }
      // Operator filter
      if (selectedOperator !== "ALL" && srv.operator !== selectedOperator) {
        return false;
      }
      // Destination filter
      if (selectedDestination !== "ALL" && srv.destination !== selectedDestination) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${srv.operator} ${srv.destination} ${srv.authorizedPickupPoint} ${srv.serviceType} ${srv.terminalCode}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [searchQuery, selectedTerminal, selectedOperator, selectedDestination]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTerminal("ALL");
    setSelectedOperator("ALL");
    setSelectedDestination("ALL");
  };

  return (
    <div id="service-directory" className="w-full">
      {/* Header and Disclaimers */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F9FAFB]">
            Sample Intercity Service Directory
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Explore authorized pickup points and terminal assignments from demonstration datasets
          </p>
        </div>
        <div className="inline-flex items-center rounded-lg border border-[#374151] bg-[#111827] px-3 py-1.5 text-xs text-[#9CA3AF]">
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
          Showing {filteredServices.length} of {SAMPLE_SERVICES.length} Demonstration Records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 rounded-2xl border border-[#374151] bg-[#1F2937] p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Search Input */}
          <div className="relative md:col-span-4">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route, operator, or pickup point..."
              className="w-full rounded-lg border border-[#374151] bg-[#111827] py-2.5 pl-10 pr-4 text-xs text-[#F9FAFB] placeholder-[#64748B] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Terminal Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedTerminal}
              onChange={(e) => setSelectedTerminal(e.target.value)}
              className="w-full rounded-lg border border-[#374151] bg-[#111827] px-3 py-2.5 text-xs text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            >
              <option value="ALL">All Terminals</option>
              {CHENNAI_TERMINALS.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.code} - {t.name.split("(")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Operator Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full rounded-lg border border-[#374151] bg-[#111827] px-3 py-2.5 text-xs text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            >
              <option value="ALL">All Operators</option>
              {SAMPLE_OPERATORS.map((op) => (
                <option key={op} value={op}>
                  {op.split(" ")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full rounded-lg border border-[#374151] bg-[#111827] px-3 py-2.5 text-xs text-[#F9FAFB] focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            >
              <option value="ALL">All Destinations</option>
              {SAMPLE_DESTINATIONS.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-1 flex items-center">
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="w-full h-full min-h-[38px] flex items-center justify-center rounded-lg border border-[#374151] bg-[#111827] text-xs text-[#9CA3AF] transition hover:bg-[#374151] hover:text-[#F9FAFB]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="flex flex-col justify-between rounded-xl border border-[#374151] bg-[#1F2937] p-5 shadow-card transition-all hover:border-[#4B5563]"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 border-b border-[#374151] pb-3">
                  <span className="rounded bg-[#111827] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D1D5DB] border border-[#374151]">
                    {srv.terminalCode} Terminal
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified in Sample
                  </span>
                </div>

                {/* Route Header */}
                <div className="mt-3">
                  <div className="text-xs font-semibold text-[#9CA3AF]">
                    {srv.operator}
                  </div>
                  <h3 className="mt-0.5 text-base font-bold text-[#F9FAFB]">
                    Chennai → {srv.destination}
                  </h3>
                  <div className="text-[11px] text-[#64748B]">
                    {srv.serviceType}
                  </div>
                </div>

                {/* Authorized Pickup Point */}
                <div className="mt-4 rounded-lg border border-[#374151] bg-[#111827] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    <MapPin className="h-3.5 w-3.5 text-white" />
                    Authorized Pickup Point
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#F9FAFB]">
                    {srv.authorizedPickupPoint}
                  </div>
                </div>

                {/* Prohibited / Relocated Warning */}
                {srv.prohibitedPoints.length > 0 && (
                  <div className="mt-2.5 rounded-lg border border-rose-900/40 bg-rose-950/20 p-2.5">
                    <div className="flex items-start gap-1.5 text-[11px] text-rose-300">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                      <div>
                        <strong className="font-semibold">Restricted Stops:</strong>{" "}
                        No pickup at {srv.prohibitedPoints.join(", ")}.
                      </div>
                    </div>
                  </div>
                )}

                {/* Operating Advisory Note */}
                <p className="mt-3 text-xs leading-relaxed text-[#9CA3AF] line-clamp-3">
                  {srv.officialAdvisory}
                </p>
              </div>

              {/* Bottom Metadata & Actions */}
              <div className="mt-4 border-t border-[#374151] pt-3">
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#64748B]" />
                    <span>{srv.departureWindow}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-[#64748B]" />
                    <span>{srv.operatorHelpline}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Source: {srv.dataSource.slice(0, 30)}...</span>
                  <span>Updated: {srv.lastUpdated}</span>
                </div>

                {onSelectService && (
                  <button
                    type="button"
                    onClick={() => onSelectService(srv)}
                    className="mt-3 w-full rounded-lg border border-[#374151] bg-[#111827] py-2 text-xs font-semibold text-white transition hover:bg-[#374151]"
                  >
                    Test in Pickup Verifier
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-8 text-center shadow-card">
          <AlertCircle className="mx-auto h-8 w-8 text-[#64748B]" />
          <h4 className="mt-2 text-sm font-bold text-[#F9FAFB]">
            No Matching Services Found
          </h4>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            Try adjusting your search keywords or clearing active filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 rounded-lg border border-[#374151] bg-[#111827] px-4 py-1.5 text-xs font-semibold text-[#F9FAFB] transition hover:bg-[#374151]"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
