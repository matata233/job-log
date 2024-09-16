/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        light: {
          bgColor: {
            100: "#F1F3F4",
            200: "#FFFFFF",
          },

          purple: {
            100: "#D9D2F9",
            200: "#9982FF",
            300: "#6E57D6",
          },
          green: {
            100: "#DFEDDB",
            200: "#6FBD9B",
            300: "#4E9436",
          },
        },
        dark: {
          bgColor: {
            100: "#0D0F11",
            200: "#1A1D21",
            300: "#272C35",
          },
          purple: {
            100: "#7752FE",
            200: "#8E8FFA",
            300: "#C2D9FF",
          },
          green: {
            100: "#203024",
            200: "#61a487",
            300: "#4B8E36",
          },
        },
      },
    },
  },
  plugins: [],
};
