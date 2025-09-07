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
      // UX: Enhanced animation suite
      animation: {
        'rocket-float': 'rocket-float 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'gentle-drift': 'gentle-drift 25s ease-in-out infinite alternate',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'button-lift-glow': 'button-lift 0.2s ease-out forwards, gentle-glow 0.2s ease-out forwards',
      },
      keyframes: {
        'rocket-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'gentle-drift': {
          '0%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(20px, -10px, 0) rotate(10deg)' },
          '100%': { transform: 'translate3d(-5px, 15px, 0) rotate(-5deg)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, 25px, 0)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)'
          },
        },
        'button-lift': {
          '100%': { transform: 'translateY(-2px)' }
        },
        'gentle-glow': {
          '100%': { boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)' }
        }
      }
    },
  },
  plugins: [],
}
