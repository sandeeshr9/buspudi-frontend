import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} fill="none" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0B1220" stroke="#374151" strokeWidth="1.5" />
      {/* Stylized transit W with route path and bus dots */}
      <path
        d="M7 10L11 22L16 13L21 22L25 10"
        stroke="#F9FAFB"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="13" r="2.2" fill="#64748B" stroke="#0B1220" strokeWidth="1" />
      <circle cx="11" cy="22" r="2.2" fill="#10B981" />
      <circle cx="21" cy="22" r="2.2" fill="#3B82F6" />
    </svg>
  );
}

export function Logo({
  to = "/",
  className,
  showTagline = false,
}: {
  to?: string;
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2.5 rounded-lg group", className)} aria-label="Wayzo home">
      <LogoMark />
      <div className="flex flex-col">
        <span className="font-display text-lg font-extrabold tracking-tight text-[#F9FAFB]">
          Wayzo
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium text-[#9CA3AF] -mt-1 tracking-tight">
            Every Bus. Every Route. In One Place.
          </span>
        )}
      </div>
    </Link>
  );
}
