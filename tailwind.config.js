/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // CalmCove Cool Modern Color Palette
      colors: {
        // Primary cool accents - soft and calming
        coolBlue: {
          DEFAULT: 'rgb(100, 150, 200)',
          light: 'rgb(120, 170, 220)',
          dark: 'rgb(80, 130, 180)',
          glow: 'rgba(100, 150, 200, 0.2)',
        },
        softTeal: 'rgb(100, 200, 180)',
        softPurple: 'rgb(150, 130, 200)',
        softCyan: 'rgb(100, 200, 220)',
        // Secondary cool tones
        mintGreen: 'rgb(150, 220, 180)',
        lavender: 'rgb(180, 160, 220)',
        skyBlue: 'rgb(140, 180, 220)',
        // Cool dark backgrounds
        darkCool: {
          DEFAULT: 'rgb(20, 25, 35)',
          light: 'rgb(30, 38, 50)',
          lighter: 'rgb(40, 50, 65)',
        },
        // Glassmorphism surfaces - consistent transparent style
        glass: {
          soft: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        // Text colors
        textPrimary: {
          DEFAULT: 'rgb(240, 245, 250)',
          muted: 'rgba(240, 245, 250, 0.7)',
          dim: 'rgba(240, 245, 250, 0.4)',
        },
        // Primary accent (replaces warmAmber)
        primaryAccent: {
          DEFAULT: 'rgb(100, 150, 200)',
          light: 'rgb(120, 170, 220)',
          dark: 'rgb(80, 130, 180)',
          glow: 'rgba(100, 150, 200, 0.2)',
        },
        surfaceDark: {
          DEFAULT: 'rgba(30, 38, 50, 0.8)',
          hover: 'rgba(40, 50, 65, 0.9)',
        },
        surfaceDarker: {
          DEFAULT: 'rgba(20, 25, 35, 0.9)',
          hover: 'rgba(30, 38, 50, 0.95)',
        },
      },
      // Font families
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
      },
      // Spacing scale (4px base)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Border radius
      borderRadius: {
        '4xl': '2rem',
      },
      // Box shadows
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 15px rgba(100, 150, 200, 0.15)',
        'glow-lg': '0 0 25px rgba(100, 150, 200, 0.2)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      // Custom animations - smooth and warm
      animation: {
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scale-in': 'scaleIn 0.3s ease-out',
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
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(100, 150, 200, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(100, 150, 200, 0.15)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
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
