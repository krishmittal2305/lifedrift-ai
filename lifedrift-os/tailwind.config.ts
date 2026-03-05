import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        os: ["var(--font-orbitron)"],
        body: ["var(--font-rajdhani)"],
        mono: ["var(--font-share-tech-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
