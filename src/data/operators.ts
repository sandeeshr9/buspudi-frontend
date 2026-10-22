import type { Operator, OperatorCode } from "@/types";

/**
 * Operator categories shown in Wayzo.
 * Wayzo has no partnership with any of these operators — this is a demo.
 */
export const OPERATORS: Record<OperatorCode, Operator> = {
  MTC: {
    code: "MTC",
    name: "Metropolitan Transport Corporation",
    shortName: "MTC",
    category: "City",
    color: "#2563eb",
    description: "City buses across Chennai and suburbs.",
  },
  SETC: {
    code: "SETC",
    name: "State Express Transport Corporation",
    shortName: "SETC",
    category: "Intercity",
    color: "#dc2626",
    description: "Long-distance express services across Tamil Nadu.",
  },
  TNSTC: {
    code: "TNSTC",
    name: "Tamil Nadu State Transport Corporation",
    shortName: "TNSTC",
    category: "Regional",
    color: "#16a34a",
    description: "Regional and district services connecting towns.",
  },
  PRIVATE: {
    code: "PRIVATE",
    name: "Private operators",
    shortName: "Private",
    category: "Private",
    color: "#9333ea",
    description: "Private omni-bus services (sample operators only).",
  },
};

export const OPERATOR_LIST = Object.values(OPERATORS);
export const OPERATOR_CODES = Object.keys(OPERATORS) as OperatorCode[];
