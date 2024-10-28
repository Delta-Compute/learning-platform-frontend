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
        "text-color": "rgba(52, 58, 64, 1)",
        border: "rgba(206, 212, 218, 1)",
        placholderText: "rgba(134, 142, 150, 1)",
        brownText: "rgba(54, 45, 46, 1)",

        // contentBrandPrimaryMedium: 'black',
      },
    },
  },
  plugins: [],
};
