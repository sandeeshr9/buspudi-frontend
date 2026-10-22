import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
      },
      colors: {
        border: "#374151",
        input: "#374151",
        ring: "#64748B",
        background: "#0B1220",
        foreground: "#F9FAFB",
        navy: {
          950: "#0B1220",
          900: "#111827",
          850: "#172033",
          800: "#1E293B",
        },
        card: {
          DEFAULT: "#1F2937",
          foreground: "#F9FAFB",
        },
        secondary: {
          DEFAULT: "#111827",
          foreground: "#D1D5DB",
        },
        muted: {
          DEFAULT: "#1F2937",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#64748B",
          foreground: "#F9FAFB",
        },
        popover: {
          DEFAULT: "#1F2937",
          foreground: "#F9FAFB",
        },
        // Outcome Status Colors
        status: {
          match: "#10B981",
          "match-bg": "#064E3B",
          mismatch: "#EF4444",
          "mismatch-bg": "#7F1D1D",
          unverified: "#F59E0B",
          "unverified-bg": "#78350F",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
        glow: "0 0 25px -5px rgba(100, 116, 139, 0.2)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out both",
      },
    },
  },
  plugins: [animate],
};
