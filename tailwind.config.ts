import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f172a",
          2: "#1e293b",
          3: "#334155",
        },
        brand: {
          DEFAULT: "#ed6120",
          hover: "#ff7a3a",
          soft: "#fff1ea",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#e2e8f2",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'Bebas Neue'", "'Arial Black'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
