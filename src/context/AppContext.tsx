import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { translate, type StringKey } from "@/lib/i18n";
import type { OperatorCode, SavedJourney, ThemePref, UserProfile, UserSettings } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  preferredOperators: ["MTC", "SETC", "TNSTC", "PRIVATE"],
  notifications: { serviceAlerts: true, arrivalReminders: true, savedRouteUpdates: false, productNews: false },
  language: "en",
  accessibility: { largeText: false, reduceMotion: false, accessibleFirst: false, highContrastMap: false },
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Demo Passenger",
  email: "passenger@example.com",
  homeStopId: "ramapuram",
  workStopId: "guindy",
};

interface AppState {
  theme: ThemePref;
  setTheme: (t: ThemePref) => void;
  resolvedTheme: "light" | "dark";
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  favouriteStops: string[];
  toggleFavouriteStop: (id: string) => boolean;
  savedBuses: string[];
  toggleSavedBus: (id: string) => boolean;
  savedRoutes: string[];
  toggleSavedRoute: (id: string) => boolean;
  recentRoutes: string[];
  pushRecentRoute: (id: string) => void;
  savedJourneys: SavedJourney[];
  saveJourney: (j: SavedJourney) => void;
  removeJourney: (id: string) => void;
  isJourneySaved: (id: string) => boolean;
  t: (key: StringKey) => string;
  resetAll: () => void;
}

const Ctx = createContext<AppState | null>(null);

function toggleIn(list: string[], id: string): [string[], boolean] {
  return list.includes(id) ? [list.filter((x) => x !== id), false] : [[id, ...list], true];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemePref>("theme", "system");
  const [settings, setSettings] = useLocalStorage<UserSettings>("settings", DEFAULT_SETTINGS);
  const [profile, setProfile] = useLocalStorage<UserProfile>("profile", DEFAULT_PROFILE);
  const [favouriteStops, setFavStops] = useLocalStorage<string[]>("favStops", ["guindy", "kilambakkam"]);
  const [savedBuses, setSavedBuses] = useLocalStorage<string[]>("savedBuses", []);
  const [savedRoutes, setSavedRoutes] = useLocalStorage<string[]>("savedRoutes", ["mtc-21g"]);
  const [recentRoutes, setRecent] = useLocalStorage<string[]>("recentRoutes", ["mtc-88", "mtc-570", "setc-803"]);
  const [savedJourneys, setJourneys] = useLocalStorage<SavedJourney[]>("savedJourneys", []);

  const systemDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = settings.accessibility.largeText ? "112.5%" : "";
    root.classList.toggle("reduce-motion", settings.accessibility.reduceMotion);
    root.lang = settings.language === "ta" ? "ta" : "en";
  }, [settings.accessibility.largeText, settings.accessibility.reduceMotion, settings.language]);

  // Merge settings so new keys added later get defaults.
  const merged = useMemo<UserSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...settings,
    notifications: { ...DEFAULT_SETTINGS.notifications, ...settings.notifications },
    accessibility: { ...DEFAULT_SETTINGS.accessibility, ...settings.accessibility },
    preferredOperators: (settings.preferredOperators ?? DEFAULT_SETTINGS.preferredOperators) as OperatorCode[],
  }), [settings]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => setSettings((s) => ({ ...s, ...patch })), [setSettings]);

  const mk = (list: string[], set: (v: string[]) => void) => (id: string) => {
    const [next, added] = toggleIn(list, id);
    set(next);
    return added;
  };

  const value: AppState = {
    theme, setTheme, resolvedTheme,
    settings: merged, updateSettings,
    profile, setProfile,
    favouriteStops, toggleFavouriteStop: mk(favouriteStops, setFavStops),
    savedBuses, toggleSavedBus: mk(savedBuses, setSavedBuses),
    savedRoutes, toggleSavedRoute: mk(savedRoutes, setSavedRoutes),
    recentRoutes,
    pushRecentRoute: (id) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 6)),
    savedJourneys,
    saveJourney: (j) => setJourneys((list) => [j, ...list.filter((x) => x.id !== j.id)]),
    removeJourney: (id) => setJourneys((list) => list.filter((x) => x.id !== id)),
    isJourneySaved: (id) => savedJourneys.some((x) => x.id === id),
    t: (key) => translate(key, merged.language),
    resetAll: () => {
      setSettings(DEFAULT_SETTINGS); setProfile(DEFAULT_PROFILE); setFavStops([]); setSavedBuses([]);
      setSavedRoutes([]); setRecent([]); setJourneys([]); setTheme("system");
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
