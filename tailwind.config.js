/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin: {
        130: "130px",
        500: "500px",
        300: "300px",
        400: "400px",
        200: "200px",
        90: "90px",
        355: "355px",
        57: "57px",
        105: "105px",
        60: "60px",
        20: "20px",
        450: "450px",
      },

      maxWidth: {
        "500px": "500px",
      },
      width: {
        400: "400px",
        425: "425px",
        377: "377px",
        115: "115px",
        174: "174px",
        128: "128px",
        163: "163px",
        230: "230px",
        232: "232px",
        925: "925px",
        29: "29px",
        245: "245px",
        335: "335px",
      },
      height: {
        222: "222px",
        33: "33px",
        60: "60px",
        26: "26px",
        93: "93vh",
        48: "48px",
      },
      colors: {
        yellow: "#EFC35A",
        "yellow-2": "rgba(245, 193, 67, 0.5)",
        gray: "#D9D9D9",
        "gray-2": "rgba(30, 30, 30, 0.5)",
        purple: "#6743ee",
      },
      fontFamily: {
        indie: ["var(--font-indie)"],
        sans: ["Mona Sans", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },

  plugins: [],
};
