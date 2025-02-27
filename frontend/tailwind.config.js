/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // For Google Font
        // custom: ['CustomFont', 'sans-serif'], // For local font
      },
    },
  },
  plugins: [
  ],
}

