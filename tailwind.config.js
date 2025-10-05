/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#6EE7F9',
          600: '#22D3EE',
          700: '#0891B2',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
};


