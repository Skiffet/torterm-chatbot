/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E4DB7',
        'primary-dark': '#1a3f9e',
      },
    },
  },
  plugins: [],
}
