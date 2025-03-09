/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{,js,jsx}"],
  theme: {
    extend: {
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // For Google Font
        // custom: ['CustomFont', 'sans-serif'], // For local font
      },
      colors: {
        primary: "#616494",
        "gray-1":"#8D8E8D",
        "gray-2":"#676867",
        "h-primary": "#4d5078"
      },
      border: {
        "custom": "1px solid #8D8D8D"
      }
    },
  },
  plugins: [
  ],
}

