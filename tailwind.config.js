/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1320px',
      },
    },
    extend: {
      colors: {
        'brand-charcoal': '#0B0D0E',
        'brand-cream': '#F5F7F6',
        'brand-red': '#D31A20',
        'brand-maroon': '#AC192C',
        'brand-green': '#3E7136',
        'brand-forest': '#17492E',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        logo: ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}
