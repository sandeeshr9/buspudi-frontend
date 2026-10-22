import { WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div role="status" className="flex items-center justify-center gap-2 bg-warning px-4 py-1.5 text-center text-xs font-medium text-navy-950">
      <WifiOff className="h-3.5 w-3.5" /> You're offline. Live positions and new alerts are paused. <Link to="/app/saved" className="underline">Open saved journeys</Link>
    </div>
  );
}
