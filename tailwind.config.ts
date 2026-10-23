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
        felt: {
          DEFAULT: "var(--felt)",
          dark: "var(--felt-dark)",
        },
        brass: {
          DEFAULT: "var(--brass)",
          dark: "var(--brass-dark)",
        },
        charcoal: {
          DEFAULT: "var(--charcoal)",
          card: "var(--charcoal-card)",
        },
        ivory: {
          DEFAULT: "var(--ivory)",
        },
        ink: {
          DEFAULT: "var(--ink)",
        },
        stone: {
          DEFAULT: "var(--stone)",
        },
        table: {
          free: "var(--table-free)",
          booked: "var(--table-booked)",
          running: "var(--table-running)",
          maintenance: "var(--table-maintenance)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "Cinzel", "serif"],
        playfair: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        outfit: ["var(--font-outfit)", "Outfit", "sans-serif"],
        sans: ["var(--font-outfit)", "var(--font-inter)", "Outfit", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "14px",
        "2xl": "20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
