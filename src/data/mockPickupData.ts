export interface SampleServiceRecord {
  id: string;
  operator: string;
  serviceType: string;
  destination: string;
  authorizedPickupPoint: string;
  terminalCode: "KCBT" | "CMBT" | "MMBT" | "TAMBARAM" | "OTHER";
  prohibitedPoints: string[];
  departureWindow: string;
  operatorHelpline: string;
  officialAdvisory: string;
  dataSource: string;
  lastUpdated: string;
  isVerifiedInSample: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  tag: string;
  operator: string;
  destination: string;
  ticketPickup: string;
  travelDate: string;
  departureTime: string;
  notes: string;
  expectedOutcome: "MATCH" | "MISMATCH" | "UNVERIFIED";
  scenarioSummary: string;
}

export interface VerificationResult {
  status: "MATCH" | "MISMATCH" | "UNVERIFIED";
  enteredPickup: string;
  expectedPickup: string;
  operator: string;
  destination: string;
  isMatch: boolean;
  warningTitle: string | null;
  warningReason: string;
  recommendedSteps: string[];
  operatorContact: {
    phone: string;
    note: string;
  };
  dataSource: string;
  lastUpdated: string;
  reliabilityNote: string;
}

export interface ConfusionReport {
  id: string;
  createdAt: string;
  operator: string;
  destination: string;
  ticketPickup: string;
  actualPointReported: string;
  issueCategory: "confusing_instructions" | "conflicting_points" | "unexpected_change" | "missing_bay";
  description: string;
  bookingRef?: string;
  status: "Submitted in Demo";
}

export const CHENNAI_TERMINALS = [
  {
    code: "KCBT",
    name: "Kalaignar Centenary Bus Terminus (Kilambakkam)",
    routesHandled: "All South-bound intercity buses (Madurai, Trichy, Tirunelveli, Kanyakumari, Tuticorin, Salem, Coimbatore).",
    location: "Vandalur-Kelambakkam Road / GST Road, Kilambakkam",
    relocationNote: "Strict relocation policy active: Government SETC/TNSTC and most private omnibuses bound for Southern Tamil Nadu must depart from here. Entering Chennai city core is prohibited.",
  },
  {
    code: "CMBT",
    name: "Chennai Mofussil Bus Terminus (Koyambedu)",
    routesHandled: "West-bound buses via Bengaluru Highway (Bengaluru, Hosur, Vellore, Kanchipuram, Arcot).",
    location: "Jawaharlal Nehru Road, Koyambedu",
    relocationNote: "Retained for Westbound services. South-bound services have moved to Kilambakkam KCBT.",
  },
  {
    code: "MMBT",
    name: "Madhavaram Mofussil Bus Terminus",
    routesHandled: "North-bound services into Andhra Pradesh & Northern Tamil Nadu (Nellore, Tirupati, Vijayawada).",
    location: "Madhavaram Roundabout, GNT Road",
    relocationNote: "Designated hub for all Northern interstate bus traffic.",
  },
  {
    code: "TAMBARAM",
    name: "Tambaram / MEPZ Intercity Boarding Point",
    routesHandled: "Select private and SETC pickups along the GST highway corridor.",
    location: "MEPZ Service Road / Tambaram Sanatorium (NOT Tambaram Railway Station main gate)",
    relocationNote: "Heavy omnibuses are barred from stopping directly opposite Tambaram Railway Station to prevent severe traffic bottlenecks.",
  },
];

export const SAMPLE_OPERATORS = [
  "SETC (State Express Transport)",
  "TNSTC (Tamil Nadu State Transport)",
  "KPN Travels",
  "Parveen Travels",
  "SRS Travels",
  "YBM Travels",
  "SRM Transports",
  "City Travels",
  "Intrcity SmartBus",
  "Hebron Transports",
];

export const SAMPLE_DESTINATIONS = [
  "Madurai",
  "Bengaluru",
  "Coimbatore",
  "Tiruchirappalli (Trichy)",
  "Salem",
  "Tirunelveli",
  "Pondicherry",
  "Kanyakumari",
  "Vellore",
  "Hosur",
];

export const SAMPLE_SERVICES: SampleServiceRecord[] = [
  {
    id: "srv-setc-madurai",
    operator: "SETC (State Express Transport)",
    serviceType: "Ultra Deluxe AC Sleeper",
    destination: "Madurai",
    authorizedPickupPoint: "Kilambakkam (KCBT) - Platform Bay 4",
    terminalCode: "KCBT",
    prohibitedPoints: ["Vadapalani", "Koyambedu CMBT", "Ashok Pillar", "T.Nagar", "Guindy"],
    departureWindow: "19:00 - 23:30",
    operatorHelpline: "044-24794707",
    officialAdvisory: "Under the Chennai Southern Relocation Order, all SETC services to Madurai depart exclusively from Kilambakkam KCBT. No buses will pick up passengers inside central Chennai.",
    dataSource: "TN State Express Transport Advisory (Sample Dataset v2026.3)",
    lastUpdated: "2026-10-14",
    isVerifiedInSample: true,
  },
  {
    id: "srv-kpn-bengaluru",
    operator: "KPN Travels",
    serviceType: "Multi-Axle Volvo AC Sleeper",
    destination: "Bengaluru",
    authorizedPickupPoint: "Koyambedu (CMBT) - Private Omnibus Bay",
    terminalCode: "CMBT",
    prohibitedPoints: ["Kilambakkam KCBT", "Tambaram MEPZ"],
    departureWindow: "21:00 - 23:45",
    operatorHelpline: "044-24792000",
    officialAdvisory: "Bengaluru bound services continue to depart from Koyambedu CMBT via Poonamallee bypass. Please arrive at the Koyambedu private bay 30 minutes prior to departure.",
    dataSource: "Private Operators Association Feed (Sample Extract)",
    lastUpdated: "2026-10-18",
    isVerifiedInSample: true,
  },
  {
    id: "srv-parveen-coimbatore",
    operator: "Parveen Travels",
    serviceType: "Premium Mercedes Sleeper",
    destination: "Coimbatore",
    authorizedPickupPoint: "Tambaram (MEPZ Gate / Kilambakkam Bay 6)",
    terminalCode: "TAMBARAM",
    prohibitedPoints: ["Tambaram Railway Station Front Gate", "Vadapalani"],
    departureWindow: "20:30 - 22:30",
    operatorHelpline: "044-24794711",
    officialAdvisory: "Boarding for Tambaram passengers is strictly at MEPZ Service Road. Do not wait at Tambaram Railway Station Main Gate as police restrict heavy bus halt there.",
    dataSource: "Intercity Operator Advisory Hub (Sample Feed)",
    lastUpdated: "2026-10-12",
    isVerifiedInSample: true,
  },
  {
    id: "srv-tnstc-trichy",
    operator: "TNSTC (Tamil Nadu State Transport)",
    serviceType: "Classic Express 3x2",
    destination: "Tiruchirappalli (Trichy)",
    authorizedPickupPoint: "Kilambakkam (KCBT) - Intercity Bay 7",
    terminalCode: "KCBT",
    prohibitedPoints: ["Koyambedu CMBT", "Vadapalani Metro", "Guindy"],
    departureWindow: "Every 15 mins (24x7)",
    operatorHelpline: "044-24793839",
    officialAdvisory: "All TNSTC buses to Trichy depart from KCBT Kilambakkam. MTC shuttle buses are available from Guindy and Koyambedu to reach Kilambakkam.",
    dataSource: "TNSTC Operational Bulletin (Sample)",
    lastUpdated: "2026-10-19",
    isVerifiedInSample: true,
  },
  {
    id: "srv-ybm-salem",
    operator: "YBM Travels",
    serviceType: "BharatBenz 2+1 AC Sleeper",
    destination: "Salem",
    authorizedPickupPoint: "Kilambakkam (KCBT) - Private Omnibus Zone",
    terminalCode: "KCBT",
    prohibitedPoints: ["Koyambedu CMBT", "Ashok Pillar"],
    departureWindow: "21:30 - 23:00",
    operatorHelpline: "044-48556677",
    officialAdvisory: "Private omnibuses bound for Salem via Ulundurpet must originate from Kilambakkam. Secondary boarding at MEPZ Tambaram allowed only with pre-confirmed manifest.",
    dataSource: "Sample Transport Portal Dataset",
    lastUpdated: "2026-10-10",
    isVerifiedInSample: true,
  },
  {
    id: "srv-srs-vellore",
    operator: "SRS Travels",
    serviceType: "Scania Multi-Axle AC",
    destination: "Vellore",
    authorizedPickupPoint: "Koyambedu (CMBT) - Bay 3",
    terminalCode: "CMBT",
    prohibitedPoints: ["Kilambakkam KCBT"],
    departureWindow: "06:00 - 21:00",
    operatorHelpline: "044-24795555",
    officialAdvisory: "Vellore services route through Poonamallee Highway originating from Koyambedu CMBT.",
    dataSource: "Sample State Intercity Index",
    lastUpdated: "2026-10-16",
    isVerifiedInSample: true,
  },
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "scenario-1",
    title: "Scenario 1: Southbound Relocation Mismatch",
    tag: "MISMATCH",
    operator: "SETC (State Express Transport)",
    destination: "Madurai",
    ticketPickup: "Vadapalani",
    travelDate: "2026-10-24",
    departureTime: "21:30",
    notes: "Old ticket printed before the Kilambakkam shift. Passenger expects to board at Vadapalani.",
    expectedOutcome: "MISMATCH",
    scenarioSummary: "Ticket says Vadapalani, but all Southbound SETC buses to Madurai depart exclusively from Kilambakkam (KCBT).",
  },
  {
    id: "scenario-2",
    title: "Scenario 2: Westbound Authorized Departure",
    tag: "MATCH",
    operator: "KPN Travels",
    destination: "Bengaluru",
    ticketPickup: "Koyambedu (CMBT)",
    travelDate: "2026-10-24",
    departureTime: "22:00",
    notes: "Valid ticket to Bengaluru boarding at the official CMBT Westbound omnibus platform.",
    expectedOutcome: "MATCH",
    scenarioSummary: "Ticket pickup matches authorized Koyambedu CMBT terminal for Bengaluru highway services.",
  },
  {
    id: "scenario-3",
    title: "Scenario 3: Private Sleeper Stop Bottleneck",
    tag: "MISMATCH",
    operator: "Parveen Travels",
    destination: "Coimbatore",
    ticketPickup: "Tambaram Railway Station",
    travelDate: "2026-10-25",
    departureTime: "20:45",
    notes: "Online aggregator ticket says Tambaram Railway Station, but heavy buses are prohibited there.",
    expectedOutcome: "MISMATCH",
    scenarioSummary: "Ticket says Tambaram Railway Station, but authorized highway boarding is at MEPZ Service Road.",
  },
  {
    id: "scenario-4",
    title: "Scenario 4: Unverified Tour Operator Point",
    tag: "UNVERIFIED",
    operator: "City Travels",
    destination: "Tirunelveli",
    ticketPickup: "Guindy (Near Kathipara)",
    travelDate: "2026-10-26",
    departureTime: "18:30",
    notes: "Passenger received a text message mentioning a roadside landmark with no bay information.",
    expectedOutcome: "UNVERIFIED",
    scenarioSummary: "No verified record in the sample dataset for Guindy pickup on this service. Missing official confirmation.",
  },
  {
    id: "scenario-5",
    title: "Scenario 5: Verified Kilambakkam Southbound",
    tag: "MATCH",
    operator: "TNSTC (Tamil Nadu State Transport)",
    destination: "Tiruchirappalli (Trichy)",
    ticketPickup: "Kilambakkam (KCBT)",
    travelDate: "2026-10-24",
    departureTime: "19:15",
    notes: "Passenger confirmed departure directly from the newly commissioned KCBT terminal.",
    expectedOutcome: "MATCH",
    scenarioSummary: "Ticket pickup matches the state-mandated KCBT intercity departures terminal.",
  },
];

/**
 * Normalizes string for comparative matching
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Pure verification logic for the BusPudi prototype
 */
export function verifyPickup(input: {
  operator: string;
  destination: string;
  ticketPickup: string;
  travelDate?: string;
  departureTime?: string;
  notes?: string;
}): VerificationResult {
  const normTicket = normalize(input.ticketPickup || "");
  const normDest = normalize(input.destination || "");
  const normOp = normalize(input.operator || "");

  // Find exact or closest matching sample service record
  const matchedService = SAMPLE_SERVICES.find((srv) => {
    const destMatch = normalize(srv.destination) === normDest || normDest.includes(normalize(srv.destination)) || normalize(srv.destination).includes(normDest);
    const opMatch = normalize(srv.operator).includes(normOp) || normOp.includes(normalize(srv.operator).slice(0, 4));
    return destMatch && opMatch;
  });

  const isSouthbound = [
    "madurai",
    "tiruchirappalli",
    "trichy",
    "tirunelveli",
    "kanyakumari",
    "tuticorin",
    "theni",
    "nagercoil",
    "virudhunagar",
    "dindigul",
    "salem",
  ].some((s) => normDest.includes(s));

  const isCityCenterBannedPoint = [
    "vadapalani",
    "koyambedu",
    "cmbt",
    "ashokpillar",
    "tnagar",
    "guindy",
    "egmore",
    "central",
  ].some((p) => normTicket.includes(p));

  // Case 1: Known Southbound relocation conflict
  if (isSouthbound && isCityCenterBannedPoint) {
    const expected = matchedService?.authorizedPickupPoint || "Kilambakkam (KCBT) - Kalaignar Centenary Bus Terminus";
    return {
      status: "MISMATCH",
      enteredPickup: input.ticketPickup || "Not specified",
      expectedPickup: expected,
      operator: input.operator,
      destination: input.destination,
      isMatch: false,
      warningTitle: "Potential Terminal Relocation Mismatch (Chennai Southbound Regulation)",
      warningReason: `The entered pickup point (${input.ticketPickup}) conflicts with Chennai's intercity terminal regulations in this demonstration dataset. All south-bound buses to ${input.destination} must depart from Kilambakkam (KCBT) and are restricted from entering central Chennai points such as Vadapalani or Koyambedu.`,
      recommendedSteps: [
        "1. Recheck your booking confirmation email and the latest SMS received from the bus operator.",
        "2. Check the operator's official advisory or terminal notices before heading to the pickup spot.",
        "3. Contact the operator customer care helpline directly to confirm whether a feeder shuttle or direct KCBT boarding applies.",
        "4. Do not wait at an unverified city-centre stop if the service has moved to Kilambakkam.",
      ],
      operatorContact: {
        phone: matchedService?.operatorHelpline || "044-24794707",
        note: `Contact ${input.operator || "the bus operator"} to verify your boarding bay before departure.`,
      },
      dataSource: matchedService?.dataSource || "TN Transport Advisory Sample Database (Demo Feed)",
      lastUpdated: matchedService?.lastUpdated || "2026-10-15",
      reliabilityNote: "Illustrative Demo Data — This discrepancy is identified based on Chennai terminal zoning records. Verify with your operator.",
    };
  }

  // Case 2: Tambaram Railway Station vs MEPZ Highway Service Road
  if (normTicket.includes("tambaramrailway") || (normTicket.includes("tambaram") && !normTicket.includes("mepz") && !normTicket.includes("sanatorium"))) {
    return {
      status: "MISMATCH",
      enteredPickup: input.ticketPickup,
      expectedPickup: "Tambaram (MEPZ Service Road / Kilambakkam KCBT)",
      operator: input.operator,
      destination: input.destination,
      isMatch: false,
      warningTitle: "Restricted Highway Boarding Zone (Tambaram)",
      warningReason: "In this sample dataset, heavy intercity buses do not stop at the front gates of Tambaram Railway Station due to municipal congestion rules. Authorized boarding takes place at the MEPZ Flyover Service Road or Kilambakkam.",
      recommendedSteps: [
        "1. Check your booking SMS for precise GPS coordinates or landmark instructions.",
        "2. Proceed to the designated MEPZ Service Road boarding shelter rather than the railway station entrance.",
        "3. Call the boarding point coordinator 45 minutes prior to scheduled time.",
        "4. Allow extra buffer time for traffic along the GST corridor.",
      ],
      operatorContact: {
        phone: matchedService?.operatorHelpline || "044-24794711",
        note: `Contact ${input.operator} Tambaram dispatcher.`,
      },
      dataSource: matchedService?.dataSource || "Chennai Traffic Police Advisory (Sample Extract)",
      lastUpdated: "2026-10-12",
      reliabilityNote: "Illustrative Demo Data — Landmark distinctions based on regional municipal boarding points.",
    };
  }

  // Case 3: Matched Service in Sample Records
  if (matchedService) {
    const authNorm = normalize(matchedService.authorizedPickupPoint);
    const matchesAuthorized = normTicket.length > 3 && (authNorm.includes(normTicket) || normTicket.includes(authNorm.slice(0, 8)));

    if (matchesAuthorized) {
      return {
        status: "MATCH",
        enteredPickup: input.ticketPickup,
        expectedPickup: matchedService.authorizedPickupPoint,
        operator: matchedService.operator,
        destination: matchedService.destination,
        isMatch: true,
        warningTitle: null,
        warningReason: `The entered pickup point corresponds with the authorized boarding terminal for this route in our demonstration records.`,
        recommendedSteps: [
          "1. Confirm your platform or bay number upon arrival at the terminal.",
          "2. Keep your digital ticket and passenger ID accessible for conductor inspection.",
          "3. Plan to arrive at the terminal at least 25 minutes prior to departure.",
          "4. Verify any gate changes announced on terminal display boards.",
        ],
        operatorContact: {
          phone: matchedService.operatorHelpline,
          note: `Authorized helpline for ${matchedService.operator}.`,
        },
        dataSource: matchedService.dataSource,
        lastUpdated: matchedService.lastUpdated,
        reliabilityNote: "Illustrative Demo Data — Confirmed against sample service records. Always keep your booking SMS handy.",
      };
    } else {
      return {
        status: "MISMATCH",
        enteredPickup: input.ticketPickup,
        expectedPickup: matchedService.authorizedPickupPoint,
        operator: matchedService.operator,
        destination: matchedService.destination,
        isMatch: false,
        warningTitle: "Entered Pickup Differs from Sample Service Record",
        warningReason: `The entered pickup (${input.ticketPickup}) does not match the registered terminal (${matchedService.authorizedPickupPoint}) recorded for this service in our demonstration database.`,
        recommendedSteps: [
          "1. Recheck your booking confirmation and any recent updates sent by the travel portal.",
          "2. Compare with the official operator advisory: " + matchedService.officialAdvisory,
          "3. Contact the operator directly at " + matchedService.operatorHelpline + " to clarify the exact location.",
          "4. Do not assume an alternative boarding point is valid without verbal confirmation from the operator.",
        ],
        operatorContact: {
          phone: matchedService.operatorHelpline,
          note: `Inquiry line for ${matchedService.operator}.`,
        },
        dataSource: matchedService.dataSource,
        lastUpdated: matchedService.lastUpdated,
        reliabilityNote: "Illustrative Demo Data — Comparison drawn against sample operating schedule.",
      };
    }
  }

  // Case 4: No matching service in sample database -> UNVERIFIED
  return {
    status: "UNVERIFIED",
    enteredPickup: input.ticketPickup || "Not provided",
    expectedPickup: "No Verified Schedule in Sample Dataset",
    operator: input.operator || "Unspecified Operator",
    destination: input.destination || "Unspecified Destination",
    isMatch: false,
    warningTitle: "Service Record Not Found in Demonstration Dataset",
    warningReason: `BusPudi's sample database does not currently have a verified schedule record for "${input.operator || 'this operator'}" to "${input.destination || 'this destination'}" with pickup at "${input.ticketPickup || 'this location'}".`,
    recommendedSteps: [
      "1. Check the official confirmation email or SMS received at the time of booking.",
      "2. Look up the operator's official customer support number on their website.",
      "3. Call the operator 2 hours before scheduled departure to confirm the exact boarding point and bus registration number.",
      "4. Do not travel to an assumed terminal without confirmation.",
    ],
    operatorContact: {
      phone: "+91 94444 00000 (Sample Placeholder)",
      note: "Sample placeholder — check your ticket for the operator's verified contact details.",
    },
    dataSource: "BusPudi Prototype Registry (Unlisted Entry)",
    lastUpdated: "Not available",
    reliabilityNote: "Illustrative Demo Data — Never claim a pickup point is confirmed using information that has not actually been verified.",
  };
}
