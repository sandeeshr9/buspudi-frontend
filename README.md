# BusPudi — Verify Your Pickup Before You Travel

**BusPudi** is a transport-tech platform that helps passengers verify their intercity bus pickup locations and avoid missing buses due to incorrect, confusing, or outdated boarding information.

> **Illustrative Demonstration Prototype.** BusPudi uses curated sample datasets based on published transport regulations (e.g., Chennai's intercity bus terminal reorganization). It does not access private ticketing APIs or guarantee bus departures.

---

## The Problem Solved

Passengers traveling from major transit hubs frequently face boarding discrepancies:
1. **Outdated Booking Receipts**: Aggregator portals continue to print legacy boarding points (e.g., Vadapalani or Koyambedu) even after services have moved to Kilambakkam (KCBT).
2. **Curbside / Municipal Restrictions**: Intercity omnibuses are barred from stopping at certain locations (such as the main gates of Tambaram Railway Station) to prevent gridlock.
3. **Multi-Terminal Zonal Split**: Chennai divides services across multiple regional hubs:
   - **KCBT (Kilambakkam)**: Southbound services (Madurai, Trichy, Tirunelveli, Kanyakumari, etc.)
   - **CMBT (Koyambedu)**: Westbound services (Bengaluru, Hosur, Vellore)
   - **MMBT (Madhavaram)**: Northbound services (Andhra Pradesh, Nellore, Tirupati)
   - **Tambaram / MEPZ**: Highway pickup point for select manifest-cleared services

BusPudi provides a **pre-travel verification checkpoint** so passengers check before leaving home.

---

## Core Features

- **Interactive Pickup Verifier ("Verify My Bus Pickup")**:
  - Compares operator, destination, and ticketed pickup point against authorized sample records.
  - Three distinct outcomes:
    - **`MATCH`** (Green): Boarding point aligns with registered terminal platforms.
    - **`MISMATCH`** (Red): Ticketed point conflicts with regional terminal regulations.
    - **`UNVERIFIED`** (Amber): Missing, unlisted, or ambiguous records requiring operator confirmation.
  - 1-click **Interactive Demonstration Scenarios** to test all three outcomes dynamically.
  - Actionable 4-step protocol and operator helpline placeholder.
- **Searchable Service Directory**:
  - Filter by terminal (KCBT, CMBT, MMBT, Tambaram), operator, or destination city.
  - View authorized bays, prohibited stops, and official operating advisories.
- **Pickup Confusion Reporting Form**:
  - Allows passengers to log ambiguous boarding instructions or unnotified terminal shifts.
  - Stored locally in `localStorage` (`buspudi:confusion_reports`) with "Submitted in Demo" status.
  - Interactive "Local Reports" management tab to review or clear submissions.
- **Chennai Terminal Relocation Guide**:
  - Practical hub breakdown and advisory steps for passengers navigating the Chennai Metropolitan Area.
- **Transparent Data Reliability & Limitations**:
  - Explicit disclosures clarifying prototype scope, independent status, and absence of official government/operator partnerships.

---

## Visual Design & Palette

Built with a dark navy blue, grey, and white palette:
- **Primary Background**: Deep Navy `#0B1220`
- **Secondary Background**: Dark Blue `#111827`
- **Card Background**: Slate Grey `#1F2937`
- **Borders & Dividers**: Cool Grey `#374151`
- **Primary Text**: White `#F9FAFB`
- **Secondary Text**: Light Grey `#D1D5DB`
- **Muted Text**: Grey `#9CA3AF`
- **Accent**: Muted Steel Blue `#64748B`
- **Status Indicators**:
  - `MATCH`: `#10B981` (Green)
  - `MISMATCH`: `#EF4444` (Red)
  - `UNVERIFIED`: `#F59E0B` (Amber)

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui primitives
- **Icons**: Lucide React
- **Persistence**: `localStorage` (client-side only)
- **Deployment**: Zero backend requirement; runs client-side

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
│   ├── layout/
│   │   ├── Navbar.tsx             # Responsive dark navy header with anchor navigation
│   │   └── Footer.tsx             # Footer with About, Contact, Privacy, Terms modals
│   ├── pickup/
│   │   ├── VerificationTool.tsx   # Interactive verification engine & scenario bar
│   │   ├── ServiceDirectory.tsx   # Filterable authorized service directory
│   │   ├── ReportConfusionForm.tsx# Confusion logging form with localStorage
│   │   ├── TerminalGuide.tsx      # Chennai KCBT/CMBT/MMBT guide
│   │   └── DataReliabilitySection.tsx # Limitations & academic prototype scope
│   └── ui/                        # Reusable shadcn/ui components
├── data/
│   └── mockPickupData.ts          # Zonal rules, scenarios, services, and matching logic
├── pages/
│   └── LandingPage.tsx            # Main unified product experience
├── App.tsx                        # Routing & top-level providers
└── index.css                      # Base tokens and dark theme configuration
```

---

## Academic / Competition Note

BusPudi was created as a student innovation concept demonstrating how simple, accessible information technology can solve critical transit information gaps without waiting for complex enterprise backend integration.
