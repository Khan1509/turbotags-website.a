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
        // Logo-based professional color palette
        'tt-primary': '#1a1a4f', // Deep blue from actual logo
        'tt-primary-dark': '#141140', // Darker version for depth
        'tt-primary-light': '#2d2d80', // Lighter version for variations
        'tt-accent': '#4a90e2', // Complementary blue for highlights
        'tt-accent-dark': '#357abd', // Darker accent
        'tt-accent-light': '#6ba3eb', // Lighter accent
        'tt-neutral': '#f8fafc', // Light neutral for backgrounds
        'tt-neutral-dark': '#64748b', // Dark neutral for text
        'tt-neutral-light': '#ffffff', // Pure white for contrast
        // Legacy color support (will be gradually removed)
        'tt-dark-violet': '#1a1a4f', // Map to primary for backwards compatibility
        'tt-medium-violet': '#2d2d80', // Map to primary-light
        'tt-light-violet': '#4a90e2', // Map to accent
        // Functional colors that complement the scheme
        'tt-success': '#10b981', // Success green
        'tt-warning': '#f59e0b', // Warning amber
        'tt-error': '#ef4444', // Error red
        'tt-info': '#3b82f6', // Info blue
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
