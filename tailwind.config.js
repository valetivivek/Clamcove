/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // CalmCove color palette - RGB and HSL values only
      colors: {
        // Primary accent - bright green/teal for active states
        primaryAccent: {
          DEFAULT: 'rgb(16, 185, 129)', // Emerald green
          light: 'rgb(52, 211, 153)',
          dark: 'rgb(5, 150, 105)',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        // Secondary accent - for secondary highlights
        secondaryAccent: {
          DEFAULT: 'rgb(139, 92, 246)', // Purple
          light: 'rgb(167, 139, 250)',
          dark: 'rgb(124, 58, 237)',
        },
        // Surface colors for glass panels
        surfaceDark: {
          DEFAULT: 'rgba(30, 30, 30, 0.75)',
          hover: 'rgba(40, 40, 40, 0.85)',
        },
        surfaceDarker: {
          DEFAULT: 'rgba(20, 20, 20, 0.9)',
          hover: 'rgba(25, 25, 25, 0.95)',
        },
        // Text colors
        textPrimary: {
          DEFAULT: 'rgb(255, 255, 255)',
          muted: 'rgba(255, 255, 255, 0.6)',
          dim: 'rgba(255, 255, 255, 0.4)',
        },
      },
      // Font families
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Custom animations
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
