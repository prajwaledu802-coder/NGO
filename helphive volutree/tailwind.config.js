/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        nexus: {
          bg: "#0b1220",
          panel: "#121c2e",
          accent: "#29d3a6",
          second: "#4aa3ff"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(41, 211, 166, 0.18)"
      }
    }
  },
  plugins: []
};
