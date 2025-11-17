/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // CalmCove - Lofizen.co Inspired Design
      colors: {
        // Surface colors - dark backgrounds matching lofizen
        surface: {
          primary: 'rgb(18, 18, 20)',      // Deep dark
          secondary: 'rgb(26, 26, 30)',    // Medium dark
          tertiary: 'rgb(34, 34, 40)',      // Elevated content
        },
          // Accent colors - teal/green matching lofizen (uses CSS variables for dynamic theming)
          accent: {
            primary: 'var(--theme-color)',    // Main accent color - dynamically updated
            secondary: 'var(--theme-color-light)',  // Lighter variant for hover
            dark: 'var(--theme-color-dark)',       // Darker variant for accents
          },
        // Text colors - clean white
        text: {
          primary: 'rgb(255, 255, 255)',           // Pure white
          secondary: 'rgba(255, 255, 255, 0.7)',  // Muted white
          tertiary: 'rgba(255, 255, 255, 0.5)',    // Dimmed white
        },
        // Border color - subtle
        border: 'rgba(255, 255, 255, 0.1)', // Subtle border
        // Status colors
        success: 'rgb(34, 197, 94)',     // Green
        warning: 'rgb(251, 191, 36)',      // Yellow
        error: 'rgb(239, 68, 68)',        // Red
        // Legacy support (keeping for gradual migration)
        coolBlue: {
          DEFAULT: 'rgb(120, 120, 120)',
          light: 'rgb(140, 140, 140)',
          dark: 'rgb(100, 100, 100)',
        },
        darkCool: {
          DEFAULT: 'rgb(18, 18, 20)',      // Deep dark
          light: 'rgb(26, 26, 30)',        // Medium dark
          lighter: 'rgb(34, 34, 40)',     // Light dark
        },
        charcoal: {
          DEFAULT: '#2a2a2a',
          dark: '#1a1a1a',
          light: '#3a3a3a',
        },
        emerald: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        textPrimary: {
          DEFAULT: 'rgb(255, 255, 255)',      // Pure white
          muted: 'rgba(255, 255, 255, 0.7)', // Muted
          dim: 'rgba(255, 255, 255, 0.5)',    // Dimmed
        },
        primaryAccent: {
          DEFAULT: 'rgb(34, 197, 94)',       // Teal green
          light: 'rgb(74, 222, 128)',       // Light teal
          dark: 'rgb(22, 163, 74)',        // Dark teal
        },
          // Glass colors - lofizen style glassmorphism
          glass: {
            soft: 'rgba(26, 26, 30, 0.8)',      // Translucent dark
            medium: 'rgba(26, 26, 30, 0.9)',   // Medium translucent
            strong: 'rgba(18, 18, 20, 0.95)',      // Strong dark panel
            border: 'rgba(34, 197, 94, 0.3)',     // Theme color border glow (will be overridden by CSS variable)
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
        'soft': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.25)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.1)',
        'glow-lg': '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.15)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
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
          '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.2)' },
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
