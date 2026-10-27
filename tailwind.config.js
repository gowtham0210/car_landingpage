/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#060606',
        graphite: '#111112',
        char: '#1a1a1b',
        steel: '#2b2b2d',
        burnt: '#d2581c',
        copper: '#c07a4a',
        bone: '#ece8e0',
        mute: '#9b9a97',
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'Archivo', 'system-ui', 'Arial', 'sans-serif'],
      },
      transitionTimingFunction: {
        apex: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apex-io': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
};
