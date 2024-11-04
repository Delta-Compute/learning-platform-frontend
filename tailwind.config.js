/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // components
        "main-red": "#CC1316",
        "light-gray": "#E9ECEF",
        "bg-color": "rgba(251, 249, 249, 1)",
        // text
        "dark-blue": "#001434",

        // contentBrandPrimaryMedium: 'black',
      },
    },
  },
  plugins: [],
};
