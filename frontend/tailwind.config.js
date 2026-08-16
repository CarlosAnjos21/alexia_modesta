/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          champagne: "#FAF8F5",
          cream: "#F4EFEA",
          sand: "#EADCD0",
          rose: "#C89B7B",
          rosedark: "#A67A5B",
          rose light: "#E0BFA8",
          bronze: "#8C6347",
          charcoal: "#2D241E",
          dark: "#1C1714",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(200, 155, 123, 0.15)",
        "luxury-lg": "0 20px 40px -15px rgba(200, 155, 123, 0.25)",
      },
    },
  },
  plugins: [],
};
