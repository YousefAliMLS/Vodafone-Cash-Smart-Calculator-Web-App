/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vodafone: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#e60000',
          600: '#cc0000',
          700: '#b30000',
          800: '#990000',
          900: '#7f0000',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
