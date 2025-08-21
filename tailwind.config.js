/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        'tt-dark-violet': '#151440',
        'tt-medium-violet': '#6366F1',
        'tt-light-violet': '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'button-glow': 'button-glow 0.7s ease-in-out infinite alternate',
        'text-glow': 'text-glow 1.5s ease-in-out infinite alternate',
        'rocket-float': 'rocket-float 2s ease-in-out infinite',
      },
      keyframes: {
        'button-glow': {
          '0%': { boxShadow: '0 0 5px #6366F1, 0 0 10px #6366F1' },
          '100%': { boxShadow: '0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
        },
        'text-glow': {
          'from': { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #8B5CF6, 0 0 20px #8B5CF6' },
          'to': { textShadow: '0 0 10px #fff, 0 0 15px #fff, 0 0 20px #6366F1, 0 0 25px #6366F1' },
        },
        'rocket-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}
