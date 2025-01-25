import type { Config } from "tailwindcss";
const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', ...fontFamily.sans],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'dark-pastel-base': '#1E1E2E', // Base dark color
        'dark-pastel-text': '#E0E0E0', // Light text
        'dark-pastel-muted': '#2A2A3A', // Muted backgrounds
        'dark-pastel-border': '#3E3E4E', // Borders
        'dark-pastel-sky': '#89CFF0', // Pastel blue
        'dark-pastel-aqua': '#A2DDF0', // Pastel aqua
        'dark-pastel-peach': '#FFB6B9', // Pastel peach
        'dark-pastel-coral': '#FF8C94', // Pastel coral
        'dark-pastel-charcoal': '#2C2C3C', // Dark charcoal
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

    },
  },
  plugins: [],
} satisfies Config;
