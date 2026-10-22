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
