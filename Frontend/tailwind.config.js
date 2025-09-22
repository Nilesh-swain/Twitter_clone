/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1d9bf0",
          hover: "#1a8cd8",
        },
        twitter: {
          blue: "#1d9bf0",
          "blue-hover": "#1a8cd8",
          dark: "#16181c",
          "dark-hover": "#1a1a1a",
          border: "#2f3336",
          "text-secondary": "#71767b",
          "text-muted": "#536471",
        },
        background: "#000000",
        surface: "#16181c",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        twitter: {
          primary: "#1d9bf0",
          secondary: "#16181c",
          accent: "#1d9bf0",
          neutral: "#2f3336",
          "base-100": "#000000",
          "base-200": "#16181c",
          "base-300": "#2f3336",
          info: "#1d9bf0",
          success: "#00ba7c",
          warning: "#ffd400",
          error: "#f4212e",
        },
      },
    ],
    darkTheme: "twitter",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
