/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // components
        "main": "var(--main)",
        "light-gray": "#E9ECEF",

        // backgrounds
        "bg-color": "#fbf9f9",

        // text
        text: {
          "light-blue": "#067ECF",
          "light-green": "#3ABF38",
          "main-blue": "#2957A4",
          "dark-blue": "#001434",
        }
      },
      maxWidth: {
        'custom': 'calc(100% - 105px)',
      },
    },
  },
  plugins: [],
};
