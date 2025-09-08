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
        // Enhanced vibrant color palette
        'tt-primary': '#2563eb', // Bright blue - more vibrant
        'tt-primary-dark': '#1d4ed8', // Darker vibrant blue
        'tt-primary-light': '#3b82f6', // Lighter vibrant blue
        'tt-accent': '#f59e0b', // Vibrant amber/orange for highlights
        'tt-accent-dark': '#d97706', // Darker vibrant orange
        'tt-accent-light': '#fbbf24', // Lighter vibrant yellow
        'tt-secondary': '#8b5cf6', // Vibrant purple for variety
        'tt-secondary-dark': '#7c3aed', // Darker purple
        'tt-secondary-light': '#a78bfa', // Lighter purple
        'tt-success': '#10b981', // Vibrant green
        'tt-warning': '#f59e0b', // Vibrant orange
        'tt-error': '#ef4444', // Vibrant red
        'tt-info': '#06b6d4', // Vibrant cyan
        'tt-neutral': '#f8fafc', // Light neutral for backgrounds
        'tt-neutral-dark': '#64748b', // Dark neutral for text
        'tt-neutral-light': '#ffffff', // Pure white for contrast
        // Legacy color support (will be gradually removed)
        'tt-dark-violet': '#2563eb', // Map to primary for backwards compatibility
        'tt-medium-violet': '#3b82f6', // Map to primary-light
        'tt-light-violet': '#8b5cf6', // Map to secondary
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
