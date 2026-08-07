/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // `primary` stays the brand blue that already ships in the PWA manifest
        // and <meta name="theme-color">, so existing components keep working.
        primary: '#1E4DB7',
        'primary-dark': '#16306E',
        // Cinematic surfaces — used for the hero and the storytelling band.
        ink: '#0E1420',
        'ink-soft': '#1A2233',
        // Hi-vis amber borrowed from site signage. Reserved for prices and the
        // single primary action; it loses its meaning if it spreads.
        signal: '#F2A63B',
        concrete: '#E9EAE6',
        line: '#D5D8DE',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', '"Noto Sans Thai"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        page: '80rem',
      },
      keyframes: {
        'tag-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'rail-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'tag-in': 'tag-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'rail-marquee': 'rail-marquee 40s linear infinite',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
