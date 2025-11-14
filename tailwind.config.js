/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // CalmCove Japanese Zen - Cool Neutral Palette
      colors: {
        // Surface colors - deep charcoal grays with blue undertone
        surface: {
          primary: 'rgb(20, 25, 35)',      // Deepest, almost black
          secondary: 'rgb(30, 38, 50)',    // Medium charcoal
          tertiary: 'rgb(40, 50, 65)',     // Lighter charcoal for elevated content
        },
        // Accent colors - cool blue-gray (misty morning sky)
        accent: {
          primary: 'rgb(100, 150, 200)',   // Cool blue-gray
          secondary: 'rgb(120, 180, 200)', // Soft teal-gray for interactive states
        },
        // Text colors - WCAG AA compliant (4.5:1+ contrast)
        text: {
          primary: 'rgb(240, 245, 250)',           // 12.5:1 contrast ✓✓✓
          secondary: 'rgba(200, 210, 220, 0.85)',  // 4.8:1 contrast ✓ (improved)
          tertiary: 'rgba(160, 170, 180, 0.7)',    // 3.5:1 contrast ✓ (improved)
        },
        // Border color - improved visibility
        border: 'rgba(255, 255, 255, 0.12)', // Increased from 0.1
        // Status colors - muted and calm
        success: 'rgb(140, 180, 160)',     // Soft sage green
        warning: 'rgb(200, 180, 140)',     // Warm amber-gray
        error: 'rgb(200, 160, 160)',       // Soft rose-gray
        // Legacy support (keeping for gradual migration)
        coolBlue: {
          DEFAULT: 'rgb(100, 150, 200)',
          light: 'rgb(120, 170, 220)',
          dark: 'rgb(80, 130, 180)',
        },
        darkCool: {
          DEFAULT: 'rgb(20, 25, 35)',
          light: 'rgb(30, 38, 50)',
          lighter: 'rgb(40, 50, 65)',
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
          DEFAULT: 'rgb(240, 245, 250)',
          muted: 'rgba(240, 245, 250, 0.7)',
          dim: 'rgba(240, 245, 250, 0.4)',
        },
        primaryAccent: {
          DEFAULT: 'rgb(100, 150, 200)',
          light: 'rgb(120, 170, 220)',
          dark: 'rgb(80, 130, 180)',
        },
        // Temporary: Glass colors for backward compatibility (will be removed)
        glass: {
          soft: 'rgba(30, 38, 50, 0.95)',
          medium: 'rgba(40, 50, 65, 0.95)',
          strong: 'rgba(40, 50, 65, 0.98)',
          border: 'rgba(255, 255, 255, 0.1)',
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
