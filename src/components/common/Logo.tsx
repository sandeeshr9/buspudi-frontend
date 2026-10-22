import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0b1b3a" />
      <path d="M9 21V11a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10" fill="none" stroke="#2dd4bf" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 17h16" stroke="#2dd4bf" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="23.5" r="1.8" fill="#fff" />
      <circle cx="20" cy="23.5" r="1.8" fill="#fff" />
    </svg>
  );
}

export function Logo({ to = "/", className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2 rounded-md", className)} aria-label="BusPudi home">
      <LogoMark />
      <span className="font-display text-lg font-extrabold tracking-tight">
        Bus<span className="text-brand">Pudi</span>
      </span>
    </Link>
  );
}
