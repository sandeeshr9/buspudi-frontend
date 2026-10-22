import type { Route } from "@/types";

/**
 * DEMO DATA — sample routes. Route numbers and stop sequences are illustrative,
 * may not match current operator timetables, and must be replaced with
 * operator-published data before any real-world use.
 */
export const ROUTES: Route[] = [
  // ---- MTC (city) ----
  { id: "mtc-21g", number: "21G", operator: "MTC", name: "Broadway – Tambaram", stopIds: ["broadway", "central", "gemini", "teynampet", "saidapet", "guindy", "airport", "chromepet", "tambaram"], serviceType: "Ordinary", intercity: false, frequencyMins: 8, firstDeparture: "04:30", lastDeparture: "23:15", avgSpeedKmph: 18, fareRange: [5, 30] },
  { id: "mtc-570", number: "570", operator: "MTC", name: "Koyambedu – Kelambakkam", stopIds: ["cmbt", "vadapalani", "ashoknagar", "guindy", "velachery", "taramani", "sholinganallur", "kelambakkam"], serviceType: "Express", intercity: false, frequencyMins: 15, firstDeparture: "05:00", lastDeparture: "22:30", avgSpeedKmph: 22, fareRange: [7, 40] },
  { id: "mtc-29c", number: "29C", operator: "MTC", name: "Perambur – Besant Nagar", stopIds: ["perambur", "egmore", "royapettah", "mylapore", "adyar", "besantnagar"], serviceType: "Ordinary", intercity: false, frequencyMins: 10, firstDeparture: "05:00", lastDeparture: "22:45", avgSpeedKmph: 16, fareRange: [5, 25] },
  { id: "mtc-47a", number: "47A", operator: "MTC", name: "Anna Nagar – Broadway", stopIds: ["annanagar", "kilpauk", "egmore", "central", "broadway"], serviceType: "Ordinary", intercity: false, frequencyMins: 12, firstDeparture: "05:15", lastDeparture: "22:30", avgSpeedKmph: 16, fareRange: [5, 20] },
  { id: "mtc-12b", number: "12B", operator: "MTC", name: "T. Nagar – Thiruvanmiyur", stopIds: ["tnagar", "teynampet", "mylapore", "adyar", "thiruvanmiyur"], serviceType: "Ordinary", intercity: false, frequencyMins: 12, firstDeparture: "05:30", lastDeparture: "22:30", avgSpeedKmph: 16, fareRange: [5, 20] },
  { id: "mtc-88", number: "88K", operator: "MTC", name: "Poonamallee – T. Nagar", stopIds: ["poonamallee", "porur", "ramapuram", "guindy", "saidapet", "tnagar"], serviceType: "Ordinary", intercity: false, frequencyMins: 10, firstDeparture: "04:45", lastDeparture: "23:00", avgSpeedKmph: 19, fareRange: [5, 25] },
  { id: "mtc-1", number: "1", operator: "MTC", name: "Thiruvottiyur – Chennai Central", stopIds: ["thiruvottiyur", "tondiarpet", "broadway", "central"], serviceType: "Ordinary", intercity: false, frequencyMins: 9, firstDeparture: "04:30", lastDeparture: "23:00", avgSpeedKmph: 15, fareRange: [5, 15] },
  { id: "mtc-555", number: "555K", operator: "MTC", name: "Guindy – Kilambakkam (KCBT)", stopIds: ["guindy", "airport", "chromepet", "tambaram", "kilambakkam"], serviceType: "Express", intercity: false, frequencyMins: 10, firstDeparture: "04:00", lastDeparture: "23:59", avgSpeedKmph: 24, fareRange: [7, 30] },
  { id: "mtc-588", number: "588", operator: "MTC", name: "Thiruvanmiyur – Mamallapuram (ECR)", stopIds: ["thiruvanmiyur", "neelankarai", "kovalam", "mahabalipuram"], serviceType: "Express", intercity: false, frequencyMins: 20, firstDeparture: "05:30", lastDeparture: "21:30", avgSpeedKmph: 28, fareRange: [10, 45] },
  { id: "mtc-70a", number: "70A", operator: "MTC", name: "Koyambedu – Anna Nagar – Perambur", stopIds: ["cmbt", "annanagar", "kilpauk", "perambur"], serviceType: "AC", intercity: false, frequencyMins: 20, firstDeparture: "06:00", lastDeparture: "21:30", avgSpeedKmph: 17, fareRange: [15, 45] },

  // ---- SETC (intercity) ----
  { id: "setc-137", number: "137 UD", operator: "SETC", name: "Kilambakkam – Madurai", stopIds: ["kilambakkam", "chengalpattu", "tindivanam", "villupuram", "trichy", "madurai"], serviceType: "Ultra Deluxe", intercity: true, frequencyMins: 45, firstDeparture: "06:00", lastDeparture: "23:30", avgSpeedKmph: 55, fareRange: [120, 520] },
  { id: "setc-460", number: "460 AC", operator: "SETC", name: "Koyambedu – Coimbatore", stopIds: ["cmbt", "poonamallee", "vellore", "salem", "coimbatore"], serviceType: "AC", intercity: true, frequencyMins: 60, firstDeparture: "07:00", lastDeparture: "23:00", avgSpeedKmph: 58, fareRange: [150, 640] },
  { id: "setc-803", number: "803 UD", operator: "SETC", name: "Kilambakkam – Puducherry", stopIds: ["kilambakkam", "chengalpattu", "tindivanam", "puducherry"], serviceType: "Ultra Deluxe", intercity: true, frequencyMins: 30, firstDeparture: "05:00", lastDeparture: "22:30", avgSpeedKmph: 52, fareRange: [60, 190] },

  // ---- TNSTC (regional) ----
  { id: "tnstc-76c", number: "76C", operator: "TNSTC", name: "Koyambedu – Kanchipuram", stopIds: ["cmbt", "poonamallee", "sriperumbudur", "kanchipuram"], serviceType: "Ordinary", intercity: true, frequencyMins: 15, firstDeparture: "04:30", lastDeparture: "22:30", avgSpeedKmph: 38, fareRange: [15, 70] },
  { id: "tnstc-v1", number: "V1 Exp", operator: "TNSTC", name: "Koyambedu – Vellore", stopIds: ["cmbt", "poonamallee", "sriperumbudur", "ranipet", "vellore"], serviceType: "Express", intercity: true, frequencyMins: 20, firstDeparture: "04:30", lastDeparture: "23:00", avgSpeedKmph: 48, fareRange: [20, 150] },
  { id: "tnstc-ecr", number: "ECR 1", operator: "TNSTC", name: "Thiruvanmiyur – Puducherry (ECR)", stopIds: ["thiruvanmiyur", "kovalam", "mahabalipuram", "marakkanam", "puducherry"], serviceType: "Express", intercity: true, frequencyMins: 30, firstDeparture: "05:00", lastDeparture: "21:00", avgSpeedKmph: 45, fareRange: [20, 160] },
  { id: "tnstc-118", number: "118", operator: "TNSTC", name: "Tambaram – Chengalpattu", stopIds: ["tambaram", "kilambakkam", "guduvancheri", "chengalpattu"], serviceType: "Ordinary", intercity: true, frequencyMins: 12, firstDeparture: "04:30", lastDeparture: "23:00", avgSpeedKmph: 32, fareRange: [8, 40] },

  // ---- Private (sample operators) ----
  { id: "pvt-blr", number: "PX-BLR", operator: "PRIVATE", name: "Koyambedu – Bengaluru", stopIds: ["cmbt", "poonamallee", "vellore", "krishnagiri", "bengaluru"], serviceType: "AC Sleeper", intercity: true, frequencyMins: 60, firstDeparture: "19:00", lastDeparture: "23:30", avgSpeedKmph: 60, fareRange: [450, 1400] },
  { id: "pvt-mdu", number: "PX-MDU", operator: "PRIVATE", name: "Koyambedu – Madurai", stopIds: ["cmbt", "kilambakkam", "villupuram", "trichy", "madurai"], serviceType: "Non-AC Sleeper", intercity: true, frequencyMins: 90, firstDeparture: "18:30", lastDeparture: "23:00", avgSpeedKmph: 55, fareRange: [500, 1300] },
];

export const ROUTE_MAP: Record<string, Route> = Object.fromEntries(ROUTES.map((r) => [r.id, r]));
