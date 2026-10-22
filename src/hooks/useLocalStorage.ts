import { useCallback, useEffect, useState } from "react";

const PREFIX = "wayzo:";
const LEGACY_PREFIX = "buspudi:";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key) ?? localStorage.getItem(LEGACY_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** useState backed by localStorage. Fails gracefully when storage is blocked. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [key, value]);
  const reset = useCallback(() => setValue(initial), [initial]);
  return [value, setValue, reset] as const;
}
