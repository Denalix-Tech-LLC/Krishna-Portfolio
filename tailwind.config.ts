import type { Config } from "tailwindcss";

/**
 * Industrial-modern dark theme:
 *  - charcoal: deep near-black backgrounds
 *  - steel:    metallic steel-blue accent
 *  - ember:    brushed-orange accent
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          700: "#1b212c",
          800: "#131820",
          900: "#0c1017",
          950: "#080b10",
        },
        steel: {
          300: "#9dc1de",
          400: "#77a3c9",
          500: "#5b8db8",
          600: "#44719a",
          700: "#345876",
        },
        ember: {
          300: "#f0ac82",
          400: "#e8935f",
          500: "#e07a3f",
          600: "#c76229",
          700: "#a04e20",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        "spin-slower": "spin-slow 48s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(91,141,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,141,184,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
