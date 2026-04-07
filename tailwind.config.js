/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B1220',
          card: '#111827',
          primary: '#7C3AED',
          accent: '#06B6D4',
        },
      },
    },
  },
  presets: [require('nativewind/preset')],
  plugins: [],
};
