import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        velvet: "#c084fc",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        glow: "0 0 120px rgba(99,102,241,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
