/**
 * Core domain types for Wayzo.
 * These mirror the shape a future API is expected to return, so mock data
 * in /src/data can be swapped for real responses without touching the UI.
 */

export type OperatorCode = "MTC" | "SETC" | "TNSTC" | "PRIVATE";

export interface Operator {
  code: OperatorCode;
  name: string;
  shortName: string;
  category: "City" | "Intercity" | "Regional" | "Private";
  color: string;
  description: string;
}

export type StopType = "stop" | "terminus" | "depot";

export interface Stop {
  id: string;
  name: string;
  tamilName?: string;
  area: string;
  lat: number;
  lng: number;
  type: StopType;
  /** Boarding bays / platforms, only when known (demo values). */
  bays?: string[];
  amenities?: string[];
}

export type ServiceType =
  | "Ordinary"
  | "Express"
  | "Deluxe"
  | "AC"
  | "Ultra Deluxe"
  | "AC Sleeper"
  | "Non-AC Sleeper";

export interface Route {
  id: string;
  number: string;
  operator: OperatorCode;
  name: string;
  /** Ordered stop ids from origin to destination. */
  stopIds: string[];
  serviceType: ServiceType;
  intercity: boolean;
  frequencyMins: number;
  firstDeparture: string; // "HH:MM"
  lastDeparture: string; // "HH:MM"
  avgSpeedKmph: number;
  /** Indicative fare range in INR for the full route (demo). */
  fareRange: [number, number];
}

/** Accessibility data must never claim verification unless it is verified. */
export type AccessStatus = "verified" | "demo" | "unknown" | "not-available";

export interface VehicleAccessibility {
  wheelchair: AccessStatus;
  lowFloor: AccessStatus;
  prioritySeating: AccessStatus;
  audioAnnouncements: AccessStatus;
}

export type VehicleType =
  | "Standard"
  | "Low-floor"
  | "Electric (sample)"
  | "Deluxe coach"
  | "AC seater coach"
  | "AC sleeper coach"
  | "Non-AC sleeper coach";

export interface Vehicle {
  id: string;
  /** Demo label only — not a real registration number. */
  label: string;
  routeId: string;
  vehicleType: VehicleType;
  /** null = not known */
  ac: boolean | null;
  /** Indicative capacity used for the demo occupancy estimate. */
  capacity: number;
  accessibility: VehicleAccessibility;
}

export type OccupancyLevel = "available" | "moderate" | "crowded" | "full";

export type BusStatus = "running" | "at-stop" | "delayed" | "not-in-service";

/** Live (simulated) state of a vehicle. */
export interface BusState {
  vehicleId: string;
  routeId: string;
  /** Distance travelled along the route polyline in km. */
  progressKm: number;
  /** 1 = origin→destination, -1 = reverse trip. */
  direction: 1 | -1;
  speedKmph: number;
  status: BusStatus;
  delayMins: number;
  occupancyPct: number;
  lastUpdated: number; // epoch ms
  /** Simulation-only: bus is dwelling at a stop until this time. */
  dwellUntil?: number;
  /** Simulation-only: how often (in ticks) this bus "reports" a position. */
  reportEvery?: number;
}

/** Fully resolved bus for the UI. */
export interface LiveBus {
  id: string;
  vehicle: Vehicle;
  route: Route;
  state: BusState;
  position: [number, number];
  bearing: number;
  originStop: Stop;
  destinationStop: Stop;
  nextStop: Stop;
  nextStopIndex: number;
  /** Stops in travel order for the current trip. */
  tripStops: Stop[];
  remainingKm: number;
  totalKm: number;
  progressPct: number;
  etaNextStopMins: number;
  etaDestinationMins: number;
  occupancy: OccupancyLevel;
}

export type AlertType = "delay" | "diversion" | "cancellation" | "stop-change";
export type AlertSeverity = "low" | "medium" | "high";

export interface ServiceAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  routeIds: string[];
  stopIds: string[];
  operator: OperatorCode;
  startsAt: number;
  updatedAt: number;
  alternatives: { label: string; from?: string; to?: string }[];
}

export interface JourneyLeg {
  routeId: string;
  fromStopId: string;
  toStopId: string;
  stopIds: string[];
  departAt: number;
  arriveAt: number;
  distanceKm: number;
  waitMins: number;
}

export interface Journey {
  id: string;
  fromStopId: string;
  toStopId: string;
  legs: JourneyLeg[];
  departAt: number;
  arriveAt: number;
  durationMins: number;
  transfers: number;
  distanceKm: number;
  fareEstimate: [number, number];
  intercity: boolean;
  tags: string[];
}

export type DepartureKind = "scheduled" | "tracked" | "confirmed";

export interface Departure {
  id: string;
  routeId: string;
  stopId: string;
  towardsStopId: string;
  scheduledAt: number;
  expectedAt?: number;
  kind: DepartureKind;
  bay?: string;
  vehicleId?: string;
}

export interface SavedJourney {
  id: string;
  fromStopId: string;
  toStopId: string;
  savedAt: number;
  summary: string;
  instructions: string[];
  routeNumbers: string[];
}

export type ThemePref = "light" | "dark" | "system";
export type LanguagePref = "en" | "ta";

export interface UserSettings {
  preferredOperators: OperatorCode[];
  notifications: {
    serviceAlerts: boolean;
    arrivalReminders: boolean;
    savedRouteUpdates: boolean;
    productNews: boolean;
  };
  language: LanguagePref;
  accessibility: {
    largeText: boolean;
    reduceMotion: boolean;
    accessibleFirst: boolean;
    highContrastMap: boolean;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  homeStopId: string;
  workStopId: string;
}
