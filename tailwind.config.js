/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        display: ["Permanent Marker", "cursive"],
      },
      colors: {
        brand: {
          dark: "#281d51",
          medium: "#55478f",
          light: "#8e7bb7",
          pale: "#c0bad4",
          magenta: "#ff3467",
          teal: "#42778c",
          cyan: "#00e6c3",
        },
        text: {
          dark: "#474747",
          light: "#b2b2b2",
        },
      },
    },
  },
  plugins: [],
};
