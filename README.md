# Wayzo — Unified Bus Tracking & Mobility Platform

> **“Every Bus. Every Route. In One Place.”**

**Wayzo** is a modern, unified city and intercity bus tracking and passenger mobility platform for Chennai and Tamil Nadu. It unites urban municipal buses (MTC), intercity state express carriers (SETC, TNSTC), and private omnibuses into a single, intuitive interface with offline maps, accessible travel support, multi-modal journey planning, and real-time fleet simulation.

---

## Core Product Features

### 1. Unified Bus Tracking
- **Interactive Leaflet Map**: Visualizes Chennai bus routes with live moving vehicles, heading arrows, and route polylines.
- **Multi-Operator Support**: Filter fleets across MTC (City), SETC (Intercity), TNSTC (Express), and Private omnibuses.
- **Fast Bus Search**: Find vehicles by bus number (e.g., 570, 21G, 102), route name, or destination terminal.
- **Detailed Bus Panel**: Real-time speed, vehicle type (AC / Non-AC), upcoming stops, arrival ETAs, route progress, and accessibility status.

### 2. Offline Maps & Route Bundles
- **Downloadable Transit Corridors**: Save high-frequency routes and stop manifests locally on your device (e.g., GST Road Corridor, OMR IT Highway, Kilambakkam Intercity Link, Anna Salai Trunk).
- **Network Resilience**: Check stops, interchanges, and scheduled frequencies even when network data drops.
- **Responsible Licensing**: Operates within OpenStreetMap usage policies without bulk-scraping public tile servers.

### 3. Accessibility & Passenger Support
- **Fleet Accessibility Filters**: Identify wheelchair-accessible and low-floor buses.
- **Priority Seating Guidance**: Clear markings for priority seating zones across different vehicle classes.
- **Demonstration Assistance Requests**: Log passenger boarding assistance needs with local browser persistence (`localStorage`).

### 4. Multi-Modal Journey Planner
- **Route Search**: Enter origin and destination to compare direct routes and 1–2 transfer interchanges.
- **Calibrated Comparisons**: Compare estimated travel time, transfers, approximate fares, and intermediate stops.
- **No Booking Friction**: Pure journey planning with no payment gateways, ticket selling, or booking-first user flows.

### 5. Passenger Dashboard & Service Alerts
- **Centralized Hub**: Quick access to recent routes, nearby departures, favourite stops, and service alerts for delays, diversions, and cancellations.

---

## Design System & Theme

Built with a dark navy blue, grey, and white palette:
- **Primary Background**: Deep Navy `#0B1220`
- **Secondary Background**: Dark Blue `#111827`
- **Card Background**: Slate Grey `#1F2937`
- **Borders & Dividers**: Cool Grey `#374151`
- **Primary Text**: White `#F9FAFB`
- **Secondary Text**: Light Grey `#D1D5DB`
- **Muted Text**: Grey `#9CA3AF`
- **Accents**: Restrained Steel Blue `#64748B`

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui primitives
- **Maps**: Leaflet + React Leaflet with CARTO / OpenStreetMap tiles
- **Icons**: Lucide React
- **Local Persistence**: `localStorage` (prefixed `wayzo:`)

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/sandeeshr9/buspudi-frontend.git
cd buspudi-frontend
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## Project Structure

```text
src/
├── components/
│   ├── bus/           # BusCard, BusDetailsPanel, RouteTimeline, StopCard, JourneyCard
│   ├── common/        # Badges, Logo, SearchBar, OperatorFilter, StopPicker, States
│   ├── layout/        # AppLayout, Navbar, Footer, OfflineBanner, ThemeToggle
│   ├── map/           # BusMap, BusMarker (Leaflet interactive map)
│   └── ui/            # Buttons, Cards, Dialogs, Selects, Tabs, Inputs
├── context/
│   ├── AppContext.tsx          # Saved journeys, favourites, preferences
│   └── SimulationContext.tsx   # Fleet simulation engine (LiveBus state)
├── data/              # Routes, stops, vehicles, operators, alerts
├── hooks/             # useLocalStorage, useOnlineStatus, useUserLocation, useNow
├── lib/               # Geolocation (haversine), departures, time, planner
└── pages/
    ├── LandingPage.tsx          # Unified homepage with live bus tracking hero
    ├── LiveTrackingPage.tsx     # Full-screen fleet tracker & filters
    ├── JourneyPlannerPage.tsx   # Origin/destination route comparison
    ├── OfflinePage.tsx          # Downloadable corridor bundles & cached stops
    ├── AccessibilityPage.tsx    # Wheelchair & boarding assistance
    ├── DashboardPage.tsx        # Passenger home hub & nearby departures
    ├── StopsPage.tsx            # Stop catalog & bay departure boards
    ├── AlertsPage.tsx           # Disruptions, diversions & delay bulletins
    └── InfoPages.tsx            # About Wayzo, Privacy, Terms, Contact
```

---

## Demonstration Notice

Wayzo is a demonstration prototype for passenger transit mobility. All bus positions, arrival times, occupancy estimates, and service alerts are simulated sample data generated in the browser. Wayzo has no official affiliation with MTC, SETC, TNSTC, or private operators.
