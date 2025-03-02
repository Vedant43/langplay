/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // For Google Font
        // custom: ['CustomFont', 'sans-serif'], // For local font
      },
      colors: {
        primary: "#616494",
        "gray-1":"#8D8E8D",
        "h-primary": "#4d5078"
      }
    },
  },
  plugins: [
  ],
}

