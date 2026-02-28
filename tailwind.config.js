/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-blue-100", "text-blue-800",
    "bg-purple-100", "text-purple-800",
    "bg-green-100", "text-green-800",
    "bg-orange-100", "text-orange-800",
    "bg-pink-100", "text-pink-800",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
