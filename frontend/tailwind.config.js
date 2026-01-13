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
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#616494",
        "gray-1": "#8D8E8D",
        "gray-2": "#676867",
        "h-primary": "#4d5078"
      },
      border: {
        "custom": "1px solid #8D8D8D"
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
      },
    }
    
  },
  plugins: [
  ],
}

