/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // components
        "main-red": "#CC1316",
        "light-gray": "#E9ECEF",

        // backgrounds
        "bg-color": "#fbf9f9",

        // text
        "light-blue": "#067ECF",
        "dark-blue": "#001434",
      },
    },
  },
  plugins: [],
};
