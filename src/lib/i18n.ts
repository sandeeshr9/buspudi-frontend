import type { LanguagePref } from "@/types";

/** Minimal UI string table. Extend as more screens are localised. */
const STRINGS = {
  dashboard: { en: "Dashboard", ta: "முகப்பு" },
  track: { en: "Live tracking", ta: "நேரடி கண்காணிப்பு" },
  trackShort: { en: "Track", ta: "கண்காணி" },
  plan: { en: "Journey planner", ta: "பயண திட்டம்" },
  planShort: { en: "Plan", ta: "திட்டம்" },
  stops: { en: "Stops & depots", ta: "நிறுத்தங்கள்" },
  occupancy: { en: "Occupancy", ta: "இருக்கை நிலை" },
  alerts: { en: "Service alerts", ta: "சேவை அறிவிப்புகள்" },
  alertsShort: { en: "Alerts", ta: "அறிவிப்பு" },
  accessibility: { en: "Accessibility", ta: "அணுகல்தன்மை" },
  offline: { en: "Offline maps", ta: "ஆஃப்லைன் வரைபடம்" },
  saved: { en: "Saved & offline", ta: "சேமித்தவை" },
  profile: { en: "Profile & settings", ta: "சுயவிவரம்" },
  operator: { en: "Operator preview", ta: "இயக்குநர் பார்வை" },
  home: { en: "Home", ta: "முகப்பு" },
  more: { en: "More", ta: "மேலும்" },
  demoData: { en: "Demo data", ta: "மாதிரி தரவு" },
  searchBus: { en: "Search bus, route, destination or operator", ta: "பேருந்து, வழி, இலக்கு தேடு" },
  goodMorning: { en: "Good morning", ta: "காலை வணக்கம்" },
  goodAfternoon: { en: "Good afternoon", ta: "மதிய வணக்கம்" },
  goodEvening: { en: "Good evening", ta: "மாலை வணக்கம்" },
  whereTo: { en: "Where are you going today?", ta: "இன்று எங்கே செல்கிறீர்கள்?" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function translate(key: StringKey, lang: LanguagePref) {
  return STRINGS[key][lang] ?? STRINGS[key].en;
}
