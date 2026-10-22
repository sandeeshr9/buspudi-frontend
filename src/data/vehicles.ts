import type { AccessStatus, Vehicle, VehicleType } from "@/types";
import { ROUTES } from "./routes";

/**
 * DEMO DATA — sample vehicles. Labels are fictional ("BP-DEMO-…") and are not
 * registration numbers. Vehicle types, capacity and accessibility values are
 * placeholders flagged as "demo" — none of them are verified.
 */

const perRoute: Record<string, number> = {
  "mtc-21g": 4, "mtc-570": 3, "mtc-29c": 3, "mtc-47a": 2, "mtc-12b": 2, "mtc-88": 3, "mtc-1": 2,
  "mtc-555": 3, "mtc-588": 2, "mtc-70a": 2, "setc-137": 2, "setc-460": 1, "setc-803": 2,
  "tnstc-76c": 2, "tnstc-v1": 2, "tnstc-ecr": 1, "tnstc-118": 2, "pvt-blr": 1, "pvt-mdu": 1,
};

function typeFor(serviceType: string, i: number): { t: VehicleType; ac: boolean | null; cap: number } {
  switch (serviceType) {
    case "AC": return { t: "AC seater coach", ac: true, cap: 48 };
    case "Ultra Deluxe": return { t: "Deluxe coach", ac: i % 2 === 0 ? false : null, cap: 44 };
    case "AC Sleeper": return { t: "AC sleeper coach", ac: true, cap: 36 };
    case "Non-AC Sleeper": return { t: "Non-AC sleeper coach", ac: false, cap: 36 };
    case "Express": return { t: i % 3 === 0 ? "Low-floor" : "Standard", ac: false, cap: 60 };
    default: return i % 4 === 1 ? { t: "Low-floor", ac: false, cap: 65 } : i % 7 === 3 ? { t: "Electric (sample)", ac: null, cap: 60 } : { t: "Standard", ac: false, cap: 62 };
  }
}

let n = 100;
export const VEHICLES: Vehicle[] = ROUTES.flatMap((route) => {
  const count = perRoute[route.id] ?? 1;
  return Array.from({ length: count }, (_, i) => {
    n += 1;
    const { t, ac, cap } = typeFor(route.serviceType, n);
    const lowFloor = t === "Low-floor";
    const unknown: AccessStatus = "unknown";
    return {
      id: `${route.id}-${i + 1}`,
      label: `BP-DEMO-${n}`,
      routeId: route.id,
      vehicleType: t,
      ac,
      capacity: cap,
      accessibility: {
        wheelchair: lowFloor ? "demo" : route.intercity ? "not-available" : unknown,
        lowFloor: lowFloor ? "demo" : route.intercity ? "not-available" : unknown,
        prioritySeating: route.operator === "PRIVATE" ? unknown : "demo",
        audioAnnouncements: lowFloor || t === "Electric (sample)" ? "demo" : unknown,
      },
    } satisfies Vehicle;
  });
});

export const VEHICLE_MAP: Record<string, Vehicle> = Object.fromEntries(VEHICLES.map((v) => [v.id, v]));
