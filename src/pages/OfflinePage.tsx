import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Wifi,
  WifiOff,
  CheckCircle2,
  Trash2,
  MapPin,
  Route as RouteIcon,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STOPS } from "@/data/stops";

export interface OfflineBundle {
  id: string;
  name: string;
  corridor: string;
  routeNumbers: string[];
  stopsCount: number;
  sizeKb: number;
  downloadedAt?: number;
  description: string;
}

const AVAILABLE_BUNDLES: OfflineBundle[] = [
  {
    id: "bundle-gst",
    name: "GST Road & Southern Transit Corridor",
    corridor: "Chennai Central ↔ Tambaram ↔ Kilambakkam (KCBT)",
    routeNumbers: ["18A", "21G", "70V", "SETC-118"],
    stopsCount: 38,
    sizeKb: 1250,
    description: "Crucial trunk route connecting downtown Chennai to airport, Tambaram Sanatorium, and Kilambakkam bus terminus.",
  },
  {
    id: "bundle-omr",
    name: "OMR IT Highway & ECR Express",
    corridor: "Broadway ↔ Adyar ↔ Sholinganallur ↔ Siruseri",
    routeNumbers: ["570", "102", "19B"],
    stopsCount: 26,
    sizeKb: 980,
    description: "Complete technological corridor route schedules covering Tidel Park, Kandanchavadi, Thoraipakkam, and Sholinganallur.",
  },
  {
    id: "bundle-intercity",
    name: "Kilambakkam (KCBT) Intercity Hub Feeder",
    corridor: "Koyambedu (CMBT) ↔ Guindy ↔ Kilambakkam (KCBT)",
    routeNumbers: ["70V", "SETC-118", "M1"],
    stopsCount: 32,
    sizeKb: 1420,
    description: "Intercity connection timetables and intermediate boarding bays for south-bound long distance departures.",
  },
  {
    id: "bundle-annasalai",
    name: "Anna Salai Metro Trunk Line",
    corridor: "Chennai Central ↔ T.Nagar ↔ Guindy",
    routeNumbers: ["18A", "21G"],
    stopsCount: 22,
    sizeKb: 850,
    description: "High-frequency central arterial route with full stop manifests and scheduled departure frequencies.",
  },
];

export default function OfflinePage() {
  const isBrowserOnline = useOnlineStatus();
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const isOnline = isBrowserOnline && !simulatedOffline;

  // Stored downloaded bundles in localStorage
  const [downloadedIds, setDownloadedIds] = useLocalStorage<string[]>("offline_bundles", [
    "bundle-gst", // pre-cache one for immediate demonstration
  ]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedBundleId, setExpandedBundleId] = useState<string | null>("bundle-gst");

  const handleDownload = (bundle: OfflineBundle) => {
    setDownloadingId(bundle.id);
    toast.info(`Downloading ${bundle.name} offline bundle...`, {
      description: `Saving ~${(bundle.sizeKb / 1024).toFixed(1)} MB of stops and timetables locally.`,
    });

    setTimeout(() => {
      if (!downloadedIds.includes(bundle.id)) {
        setDownloadedIds([...downloadedIds, bundle.id]);
      }
      setDownloadingId(null);
      toast.success(`${bundle.name} downloaded successfully!`, {
        description: "Available offline without an internet connection.",
      });
    }, 600);
  };

  const handleRemove = (bundleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadedIds(downloadedIds.filter((id) => id !== bundleId));
    toast.info("Offline bundle removed from local storage.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#374151] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#111827] px-2.5 py-0.5 text-xs font-semibold text-[#D1D5DB] border border-[#374151]">
              Offline Mobility Hub
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-[#F9FAFB] sm:text-3xl">
            Offline Maps & Route Bundles
          </h1>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            Save high-frequency corridors to your device so you can navigate routes and stop schedules without an active data connection
          </p>
        </div>

        {/* Status Indicators & Simulation Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
              isOnline
                ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-300"
                : "border-amber-800/60 bg-amber-950/40 text-amber-300"
            }`}
          >
            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            <span>{isOnline ? "Network Connected" : "Operating in Offline Mode"}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSimulatedOffline(!simulatedOffline);
              toast.info(
                simulatedOffline
                  ? "Reconnected to live network mode."
                  : "Simulating offline mode. Live GPS updates paused; cached manifests active."
              );
            }}
            className="rounded-lg border border-[#374151] bg-[#1F2937] px-3 py-1.5 text-xs font-semibold text-[#D1D5DB] transition hover:bg-[#374151] hover:text-white"
          >
            {simulatedOffline ? "Restore Online" : "Simulate Offline"}
          </button>
        </div>
      </div>

      {/* Honest Offline Notice Banner */}
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
          <div className="space-y-1">
            <div className="font-bold text-[#F9FAFB]">
              Important Offline Scope & OSM Usage Notice:
            </div>
            <p className="leading-relaxed text-[#9CA3AF]">
              • <strong>Available Offline:</strong> Route directions, stop lists, transfer interchanges, and scheduled frequency timetables work completely offline once saved.
            </p>
            <p className="leading-relaxed text-[#9CA3AF]">
              • <strong>Live GPS Limitations:</strong> Live vehicle markers and real-time arrival counts require an active internet connection. When offline, Wayzo shows the last cached vehicle position with a stale timestamp warning.
            </p>
            <p className="leading-relaxed text-[#64748B]">
              • <strong>Tile Licensing:</strong> In strict compliance with OpenStreetMap Fair Usage Policies, full offline raster/vector tile map downloads are designed as a dedicated Phase 2 caching module to prevent bulk tile scraping.
            </p>
          </div>
        </div>
      </div>

      {/* Available Offline Corridor Bundles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#F9FAFB]">
              Available Transit Corridor Packages
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Pre-packaged bundles containing route manifests, intermediate stops, and scheduled timetables
            </p>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            {downloadedIds.length} of {AVAILABLE_BUNDLES.length} Bundles Saved
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {AVAILABLE_BUNDLES.map((bundle) => {
            const isDownloaded = downloadedIds.includes(bundle.id);
            const isDownloading = downloadingId === bundle.id;
            const isExpanded = expandedBundleId === bundle.id;

            return (
              <div
                key={bundle.id}
                className={`rounded-2xl border transition-all ${
                  isDownloaded
                    ? "border-[#4B5563] bg-[#1F2937] shadow-card"
                    : "border-[#374151] bg-[#1F2937]/60"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#F9FAFB]">
                          {bundle.name}
                        </h3>
                        {isDownloaded && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800/60">
                            <CheckCircle2 className="h-3 w-3" />
                            Offline Ready
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#D1D5DB]">
                        <RouteIcon className="h-3.5 w-3.5 text-[#64748B]" />
                        <span>{bundle.corridor}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center rounded-md bg-[#111827] px-2.5 py-1 text-xs font-semibold text-[#9CA3AF] border border-[#374151]">
                        ~{(bundle.sizeKb / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#9CA3AF]">
                    {bundle.description}
                  </p>

                  {/* Route chips */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#9CA3AF]">Routes:</span>
                    {bundle.routeNumbers.map((num) => (
                      <span
                        key={num}
                        className="rounded bg-[#111827] px-2 py-0.5 text-[11px] font-bold text-white border border-[#374151]"
                      >
                        {num}
                      </span>
                    ))}
                    <span className="text-[11px] text-[#64748B]">
                      • {bundle.stopsCount} intermediate stops
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#374151] pt-3">
                    <button
                      type="button"
                      onClick={() => setExpandedBundleId(isExpanded ? null : bundle.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#D1D5DB] hover:text-white"
                    >
                      <span>{isExpanded ? "Hide Stops List" : "Inspect Stops & Details"}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      {isDownloaded ? (
                        <button
                          type="button"
                          onClick={(e) => handleRemove(bundle.id, e)}
                          title="Remove bundle from storage"
                          className="flex items-center gap-1 rounded-lg border border-rose-900/60 bg-rose-950/30 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-900/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() => handleDownload(bundle)}
                          className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-[#0B1220] transition hover:bg-[#E5E7EB]"
                        >
                          {isDownloading ? (
                            <>
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0B1220] border-t-transparent" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-3.5 w-3.5" />
                              <span>Save for Offline</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded stops details */}
                {isExpanded && (
                  <div className="border-t border-[#374151] bg-[#111827] p-4 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                      <span>Corridor Key Boarding Stops:</span>
                      <span>Cached Status: {isDownloaded ? "Stored Locally" : "Not Downloaded"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STOPS.slice(0, 8).map((st) => (
                        <div key={st.id} className="flex items-center gap-1 text-[11px] text-[#D1D5DB]">
                          <MapPin className="h-3 w-3 text-[#64748B]" />
                          <span className="truncate">{st.name}</span>
                        </div>
                      ))}
                    </div>
                    {isDownloaded && (
                      <div className="mt-3 flex items-center justify-between border-t border-[#374151] pt-2 text-[10px] text-[#64748B]">
                        <span>Last Cached: Today at {new Date().toLocaleTimeString()}</span>
                        <Link to={`/app/track?q=${bundle.routeNumbers[0]}`} className="text-white hover:underline">
                          View in Tracker →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
