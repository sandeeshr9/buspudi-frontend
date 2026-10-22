# BusPudi — Frontend

**Every Bus. One Journey.** A unified city and intercity bus tracking and mobility frontend for Chennai, Tamil Nadu.

> **Demo build.** Every bus position, timetable, fare, occupancy figure, accessibility value and service alert in this app is **simulated sample data** generated in the browser. BusPudi has no partnership with MTC, SETC, TNSTC or any private operator.

## Quick start

Requirements: **Node.js 18+** (20 or 22 recommended) and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build at http://localhost:4173
npm run typecheck  # TypeScript only
```

The map uses OpenStreetMap-based tiles (CARTO Voyager / Dark Matter, or standard OSM via the layers button), so an internet connection is needed for map imagery. No API keys or environment variables are required.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui-style components (Radix primitives) · Lucide icons · React Router · Leaflet + react-leaflet · Recharts · Sonner (toasts).

## What's included

| Area | Route | Highlights |
| --- | --- | --- |
| Landing | `/` | Hero search, moving-bus map preview, features, how it works, operator categories, data-availability notice |
| Passenger dashboard | `/app` | Origin/destination search, nearby stops, upcoming departures, favourites, recent routes, alerts |
| **Live tracking** | `/app/track` | Full map, coloured bus markers with heading, route lines, stops, search, operator/AC/wheelchair/parked filters, sort, list ↔ map on mobile, nearby stops → approaching buses, selected-bus panel with ETA, distance, progress, last-updated, zoom/recenter/locate/layer controls, legend |
| Journey planner | `/app/plan` | Real local route search (direct, 1 and 2 transfers), departure time, compare duration/transfers/arrival/fare, city-to-intercity, per-leg stop timeline, map view, save |
| Bus details | `/app/bus/:id` | Map, upcoming stops with ETAs, progress, AC/vehicle type, accessibility (clearly unverified), other buses on route, route alerts |
| Stops & depots | `/app/stops` | Search/filter stops, bays and facilities, services, departure board separating **scheduled**, **tracked (simulated)** and **confirmed (demo)** |
| Occupancy | `/app/occupancy` | Available / moderate / crowded / full, capacity comparison chart, source + timestamp, explanation of why ticket counts aren't occupancy |
| Service alerts | `/app/alerts` | Delays, diversions, cancellations, stop changes, severity, timestamps, alternative journeys |
| Accessibility | `/app/accessibility` | Verified-only vs demo filtering, low-floor/priority seating info, validated boarding-assistance form (not sent anywhere) |
| Saved & offline | `/app/saved` | Saved journeys with step-by-step instructions, saved stops/routes, online/offline indicator |
| Profile & settings | `/app/profile` | Mock profile, saved buses/stops, preferred operators, notifications, theme, language (partial Tamil), larger text, reduce motion, map style, reset |
| Operator preview | `/operator` | Fleet KPIs, live fleet map, status and occupancy charts, route status, terminus departures, vehicle table, alerts |
| Info | `/about`, `/contact`, `/privacy`, `/terms` | Contact form with validation (demo) |

Preferences, favourites, saved journeys and assistance requests persist in `localStorage` (keys prefixed `buspudi:`).

## Project structure

```
src/
  components/
    ui/        shadcn-style primitives (button, card, dialog, tabs, select, switch…)
    common/    Badges, OccupancyIndicator, SearchBar, OperatorFilter, StopPicker, states, Logo
    bus/       BusCard, BusDetailsPanel, RouteTimeline, StopCard, JourneyCard, ServiceAlertCard
    map/       BusMap, BusMarker
    layout/    AppLayout (Sidebar, MobileBottomNav, TopBar), Navbar, Footer, ThemeToggle
  context/     AppContext (prefs & saved items), SimulationContext (demo bus feed)
  data/        operators, stops, routes, vehicles, alerts  ← all mock data lives here
  hooks/       useLocalStorage, useOnlineStatus, useUserLocation, useNow, useDebounce
  lib/         geo, simulation, planner, departures, time, i18n, utils
  pages/       one file per screen (lazy-loaded)
  types/       domain types mirroring a future API
```

## Connecting a real backend later

- **Static data** — replace the arrays in `src/data/*` with API responses (e.g. parsed GTFS `stops.txt`, `routes.txt`, `trips.txt`). The shapes are defined in `src/types/index.ts`.
- **Live vehicles** — `SimulationProvider` (`src/context/SimulationContext.tsx`) is the single source of `LiveBus[]`. Swap it for a provider that polls a vehicle-positions endpoint (e.g. GTFS-Realtime) and keep the same context shape; every screen updates automatically.
- **Journeys** — `planJourneys()` in `src/lib/planner.ts` can be replaced with a call to a routing engine (e.g. OpenTripPlanner).
- **Alerts / departures** — `src/data/alerts.ts` and `src/lib/departures.ts` are the integration points for service alerts and stop arrival feeds.

## Honesty rules baked into the UI

- Simulated content carries "Demo data" / "Simulated" labels; movement runs at 8× speed and says so.
- Accessibility values are never shown as verified; the "Verified only" filter returns an empty state.
- Departure boards distinguish scheduled times from tracked and confirmed departures.
- Occupancy is labelled as an estimate with its data source and timestamp.
- Assistance requests and contact messages are clearly not sent.
- Location is used only in the browser; a demo location (Guindy) is used when permission is unavailable.

Map data © OpenStreetMap contributors. Tiles © CARTO.
