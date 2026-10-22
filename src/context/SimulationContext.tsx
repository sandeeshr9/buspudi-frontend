import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { initialStates, resolveBus, SIM_TICK_MS, stepStates } from "@/lib/simulation";
import type { BusState, LiveBus } from "@/types";

interface SimState {
  buses: LiveBus[];
  busMap: Record<string, LiveBus>;
  running: boolean;
  setRunning: (r: boolean) => void;
  lastTick: number;
  /** True until the first simulated frame is ready (used for loading skeletons). */
  loading: boolean;
}

const Ctx = createContext<SimState | null>(null);

/**
 * Provides SIMULATED bus positions. Replace this provider with one that polls
 * a real vehicle-positions API (e.g. GTFS-Realtime) when operator data exists.
 */
export function SimulationProvider({ children }: { children: ReactNode }) {
  const [states, setStates] = useState<BusState[]>(() => initialStates());
  const [running, setRunning] = useState(true);
  const [lastTick, setLastTick] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const tick = useRef(0);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      tick.current += 1;
      const now = Date.now();
      setStates((s) => stepStates(s, tick.current, now));
      setLastTick(now);
    }, SIM_TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  const buses = useMemo(() => states.map(resolveBus), [states]);
  const busMap = useMemo(() => Object.fromEntries(buses.map((b) => [b.id, b])), [buses]);

  return <Ctx.Provider value={{ buses, busMap, running, setRunning, lastTick, loading }}>{children}</Ctx.Provider>;
}

export function useSimulation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
}
