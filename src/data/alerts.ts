import type { ServiceAlert } from "@/types";

/**
 * DEMO DATA — fictional service alerts for demonstration only.
 * Times are generated relative to when the app is opened.
 */
const now = Date.now();
const min = 60_000;

export const ALERTS: ServiceAlert[] = [
  {
    id: "al-1", type: "delay", severity: "medium", operator: "MTC",
    title: "Slow traffic on Anna Salai near Gemini",
    description: "Buses on 21G are running 10–15 minutes behind schedule between Gemini and Saidapet.",
    routeIds: ["mtc-21g"], stopIds: ["gemini", "teynampet", "saidapet"],
    startsAt: now - 35 * min, updatedAt: now - 4 * min,
    alternatives: [{ label: "Take 47A to Egmore and change to 29C", from: "central", to: "mylapore" }],
  },
  {
    id: "al-2", type: "diversion", severity: "high", operator: "MTC",
    title: "570 diverted around Velachery Main Road works",
    description: "Between Guindy and Taramani, 570 services skip the Velachery stop. Board at Guindy or Taramani instead.",
    routeIds: ["mtc-570"], stopIds: ["velachery"],
    startsAt: now - 3 * 60 * min, updatedAt: now - 22 * min,
    alternatives: [{ label: "Plan Guindy → Sholinganallur", from: "guindy", to: "sholinganallur" }],
  },
  {
    id: "al-3", type: "cancellation", severity: "high", operator: "SETC",
    title: "One 137 UD departure cancelled",
    description: "A late-evening Kilambakkam – Madurai departure is cancelled. Passengers can use the next scheduled service or a private operator.",
    routeIds: ["setc-137"], stopIds: ["kilambakkam"],
    startsAt: now - 50 * min, updatedAt: now - 12 * min,
    alternatives: [{ label: "Find other journeys to Madurai", from: "kilambakkam", to: "madurai" }],
  },
  {
    id: "al-4", type: "stop-change", severity: "low", operator: "MTC",
    title: "T. Nagar boarding moved to Bay 3",
    description: "12B boarding at T. Nagar has moved temporarily to Bay 3 while the shelter is repaired.",
    routeIds: ["mtc-12b"], stopIds: ["tnagar"],
    startsAt: now - 26 * 60 * min, updatedAt: now - 90 * min,
    alternatives: [],
  },
  {
    id: "al-5", type: "delay", severity: "low", operator: "TNSTC",
    title: "Minor delays on ECR towards Mamallapuram",
    description: "Weekend traffic near Kovalam may add around 5–10 minutes to ECR 1 trips.",
    routeIds: ["tnstc-ecr", "mtc-588"], stopIds: ["kovalam"],
    startsAt: now - 70 * min, updatedAt: now - 9 * min,
    alternatives: [{ label: "Plan Thiruvanmiyur → Mamallapuram", from: "thiruvanmiyur", to: "mahabalipuram" }],
  },
  {
    id: "al-6", type: "diversion", severity: "medium", operator: "TNSTC",
    title: "Vellore services use Poonamallee bypass",
    description: "V1 Exp services are skipping the Poonamallee town stop this evening.",
    routeIds: ["tnstc-v1"], stopIds: ["poonamallee"],
    startsAt: now - 2 * 60 * min, updatedAt: now - 40 * min,
    alternatives: [{ label: "Board at Koyambedu (CMBT) instead", from: "cmbt", to: "vellore" }],
  },
];
