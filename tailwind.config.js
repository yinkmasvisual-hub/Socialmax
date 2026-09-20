/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f0",
          100: "#ffe1de",
          400: "#ff7a6b",
          500: "#f5442e",
          600: "#dc2f1c",
          700: "#b82415",
        },
      },
    },
  },
  plugins: [],
};
