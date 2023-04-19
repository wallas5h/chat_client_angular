/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    screens: {
      phone: "340px",
      tablet: "640px",
      md: "800px",
      laptop: "1024px",
    },
  },
  plugins: [],
};
