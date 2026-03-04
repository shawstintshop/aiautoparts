import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060608",
        surface: "#0d0d10",
        panel: "#12121a",
        border: "#1e1e2e",
        accent: {
          DEFAULT: "#C45000",
          light: "#FF6A00",
        },
        success: "#4AFF8A",
        warning: "#FF9500",
        error: "#FF6A6A",
        muted: "#6b7280",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #C45000, #FF6A00)",
      },
    },
  },
  plugins: [],
};

export default config;
