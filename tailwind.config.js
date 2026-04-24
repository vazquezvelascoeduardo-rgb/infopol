/** @type {import('tailwindcss').Config} */
// Configuració de Tailwind. Fem servir `darkMode: 'class'` per controlar
// manualment el tema amb una classe `dark` al <html>.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
