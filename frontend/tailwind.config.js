/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'baby-pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        }
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        'gradient-primary': 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
      }
    },
  },
  plugins: [],
}