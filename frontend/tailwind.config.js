/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E4DB7',
        'primary-dark': '#1a3f9e',
        // B2B construction-supply palette. Additive only — the two tokens
        // above are untouched so the original renovation page is unaffected.
        ink: {
          DEFAULT: '#080C15',
          900: '#0B1220',
          800: '#111A2E',
          700: '#1A2540',
          600: '#26334F',
          500: '#3A4A6B',
        },
        safety: {
          DEFAULT: '#F5A524',
          dark: '#D98800',
          light: '#FFC65C',
        },
        steel: {
          50: '#F6F8FB',
          100: '#ECF0F6',
          200: '#D9E1EC',
          300: '#B9C6D8',
          400: '#8698B4',
          500: '#5F7291',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(.16,1,.3,1) both',
        'toast-in': 'toast-in .35s cubic-bezier(.16,1,.3,1) both',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
}
