/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        librebaskervilleregular: [
          "librebaskerville-regular",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        librebaskervillebold: [
          "librebaskerville-bold",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        librebaskervilleitalic: [
          "librebaskerville-italic",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        arial: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
