import { useCallback, useState } from "react";
import { toast } from "sonner";
import { DEMO_LOCATION } from "@/data/stops";
import { haversineKm } from "@/lib/geo";

/**
 * Requests the browser location. If unavailable, denied, or outside the demo
 * network area, falls back to a fixed demo location in Chennai.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [locating, setLocating] = useState(false);

  const useDemo = useCallback((reason: string) => {
    setLocation([DEMO_LOCATION.lat, DEMO_LOCATION.lng]);
    setIsDemo(true);
    toast.info("Using demo location", { description: `${reason} Showing ${DEMO_LOCATION.label}.` });
  }, []);

  const locate = useCallback((): Promise<[number, number]> => {
    setLocating(true);
    return new Promise((resolve) => {
      const fallback = (reason: string) => {
        setLocating(false);
        useDemo(reason);
        resolve([DEMO_LOCATION.lat, DEMO_LOCATION.lng]);
      };
      if (!("geolocation" in navigator)) return fallback("Location isn't supported in this browser.");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          if (haversineKm(p, [13.04, 80.21]) > 60) return fallback("You appear to be outside the Chennai demo area.");
          setLocation(p);
          setIsDemo(false);
          toast.success("Location found", { description: "Your location stays in this browser and isn't sent anywhere." });
          resolve(p);
        },
        () => fallback("Location permission was not granted."),
        { timeout: 6000, maximumAge: 60000 }
      );
    });
  }, [useDemo]);

  return { location, isDemo, locating, locate };
}
