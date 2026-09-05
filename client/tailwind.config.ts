/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bbdaff',
          300: '#8cc3ff',
          400: '#55a1ff',
          500: '#2e7dff',
          600: '#1a5df5',
          700: '#1248e1',
          800: '#163cb6',
          900: '#18368f',
          950: '#0f1f4d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
