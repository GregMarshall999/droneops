/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#197FE6',
        'background-dark': '#111a22',
        'surface-dark': '#1a2632',
        'surface-highlight': '#243647',
        'text-secondary': '#93adc8',
      },
      fontFamily: {
        body: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.7s ease-in-out',
        'slide-in-from-bottom-4': 'slide-in-from-bottom 0.7s ease-in-out',
      },
    },
  },
  plugins: [],
}
