import animate from "tailwindcss-animate";
<<<<<<< HEAD

=======
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: { DEFAULT: "hsl(var(--primary) / <alpha-value>)", foreground: "hsl(var(--primary-foreground) / <alpha-value>)" },
        secondary: { DEFAULT: "hsl(var(--secondary) / <alpha-value>)", foreground: "hsl(var(--secondary-foreground) / <alpha-value>)" },
        destructive: { DEFAULT: "hsl(var(--destructive) / <alpha-value>)", foreground: "hsl(var(--destructive-foreground) / <alpha-value>)" },
        muted: { DEFAULT: "hsl(var(--muted) / <alpha-value>)", foreground: "hsl(var(--muted-foreground) / <alpha-value>)" },
        accent: { DEFAULT: "hsl(var(--accent) / <alpha-value>)", foreground: "hsl(var(--accent-foreground) / <alpha-value>)" },
        popover: { DEFAULT: "hsl(var(--popover) / <alpha-value>)", foreground: "hsl(var(--popover-foreground) / <alpha-value>)" },
        card: { DEFAULT: "hsl(var(--card) / <alpha-value>)", foreground: "hsl(var(--card-foreground) / <alpha-value>)" },
        navy: { DEFAULT: "#0b1b3a", 50: "#eef2fa", 100: "#d6deef", 700: "#13295a", 800: "#0f2149", 900: "#0b1b3a", 950: "#071229" },
        teal: { DEFAULT: "#14b8a6" },
        brand: "hsl(var(--brand) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        op: { mtc: "#2563eb", setc: "#dc2626", tnstc: "#16a34a", private: "#9333ea" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)", xl: "calc(var(--radius) + 4px)", "2xl": "calc(var(--radius) + 8px)" },
      boxShadow: {
        soft: "0 1px 2px rgba(11,27,58,.04), 0 4px 16px rgba(11,27,58,.06)",
        lift: "0 2px 4px rgba(11,27,58,.06), 0 12px 32px rgba(11,27,58,.10)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "none" } },
        pulse2: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
        ping2: { "0%": { transform: "scale(1)", opacity: 0.6 }, "100%": { transform: "scale(2.4)", opacity: 0 } },
      },
      animation: { "fade-in": "fade-in .25s ease-out both", pulse2: "pulse2 1.6s ease-in-out infinite", ping2: "ping2 1.8s ease-out infinite" },
>>>>>>> origin/main
    },
  },
  plugins: [animate],
};
