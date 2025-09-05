/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#8B9D83", // primary
        },
        cream: {
          DEFAULT: "#F5F1EB", // secondary
        },
        gold: {
          DEFAULT: "#D4A574", // accent
        },
        charcoal: {
          DEFAULT: "#2C2C2C", // dark
        },
      },
    },
  },
  plugins: [],
}
