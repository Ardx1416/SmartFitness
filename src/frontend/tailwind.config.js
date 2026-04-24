/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        electric: {
          300: "oklch(0.82 0.18 250)",
          400: "oklch(0.74 0.22 250)",
          500: "oklch(0.65 0.25 250)",
          600: "oklch(0.56 0.22 250)",
          700: "oklch(0.46 0.20 250)",
        },
        neon: {
          300: "oklch(0.86 0.20 145)",
          400: "oklch(0.78 0.24 145)",
          500: "oklch(0.70 0.27 145)",
          600: "oklch(0.60 0.24 145)",
        },
        surface: {
          900: "oklch(0.09 0.012 260)",
          800: "oklch(0.14 0.018 260)",
          700: "oklch(0.20 0.020 260)",
          600: "oklch(0.28 0.025 260)",
          500: "oklch(0.34 0.025 260)",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        electric: "0 0 20px oklch(0.65 0.25 250 / 0.45), 0 0 40px oklch(0.65 0.25 250 / 0.18)",
        neon: "0 0 20px oklch(0.70 0.27 145 / 0.45), 0 0 40px oklch(0.70 0.27 145 / 0.18)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-electric': 'linear-gradient(135deg, oklch(0.65 0.25 250), oklch(0.70 0.27 145))',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 12px oklch(0.65 0.22 250 / 0.4)" },
          "50%": { boxShadow: "0 0 32px oklch(0.65 0.22 250 / 0.8)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}
