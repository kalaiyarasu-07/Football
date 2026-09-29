import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0d0c",
        surface: {
          DEFAULT: "#121614",
          light: "#171d1a",
          border: "#232b27",
        },
        accent: {
          DEFAULT: "#22c55e",
          dim: "#16a34a",
          bright: "#4ade80",
          soft: "#0f2e1c",
        },
        zone: {
          g1: "#22c55e",
          g2: "#38bdf8",
          g3: "#f59e0b",
          g4: "#f472b6",
        },
        muted: "#8b978f",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
        glow: "0 0 24px 0 rgba(34, 197, 94, 0.15)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
