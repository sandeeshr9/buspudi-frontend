import { Accessibility, Bell, BookmarkCheck, Building2, Gauge, LayoutDashboard, MapPinned, Radar, Route, UserRound, Users } from "lucide-react";
import type { StringKey } from "@/lib/i18n";

export interface NavItem {
  to: string;
  key: StringKey;
  icon: typeof Radar;
  end?: boolean;
}

export const NAV_PRIMARY: NavItem[] = [
  { to: "/app", key: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/track", key: "track", icon: Radar },
  { to: "/app/plan", key: "plan", icon: Route },
  { to: "/app/stops", key: "stops", icon: MapPinned },
  { to: "/app/alerts", key: "alerts", icon: Bell },
];

export const NAV_SECONDARY: NavItem[] = [
  { to: "/app/occupancy", key: "occupancy", icon: Users },
  { to: "/app/accessibility", key: "accessibility", icon: Accessibility },
  { to: "/app/saved", key: "saved", icon: BookmarkCheck },
  { to: "/app/profile", key: "profile", icon: UserRound },
];

export const NAV_OPERATOR: NavItem = { to: "/operator", key: "operator", icon: Building2 };
export const GaugeIcon = Gauge;
