// tailwind.config.js
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        twitter: {
          primary: "#1d9bf0",
          secondary: "#1a8cd8",
          accent: "#ff6b35",
          neutral: "#16181c",
          "base-100": "#ffffff",
          "base-200": "#f7f9fa",
          "base-300": "#eff3f4",
          info: "#1d9bf0",
          success: "#00ba7c",
          warning: "#ff6b35",
          error: "#f4212e",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
