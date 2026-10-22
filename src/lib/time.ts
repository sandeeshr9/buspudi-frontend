export function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatDuration(mins: number, compact = false) {
  const m = Math.max(0, Math.round(mins));
  if (m < 1) return "Now";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (compact) return r ? `${h}h ${r}m` : `${h}h`;
  return r ? `${h} h ${r} min` : `${h} h`;
}

export function relativeTime(ts: number, now = Date.now()) {
  const s = Math.round((now - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function parseHHMM(hhmm: string, base = new Date()) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function toInputTime(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
