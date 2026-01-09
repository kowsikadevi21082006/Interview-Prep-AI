/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1b6fb',
          400: '#6d8bf7',
          500: '#3b5df2',
          600: '#253ee7',
          700: '#1d2eca',
          800: '#1c28a3',
          900: '#1c2681',
          950: '#11174b',
        }
      }
    },
  },
  plugins: [],
}

