// CalmCove Complete Redesign Plan
// This file contains the complete strategy for transforming CalmCove into a premium lofi experience

export const REDESIGN_STRATEGY = {
  // I. HIGH-LEVEL REDESIGN STRATEGY
  strategy: {
    phase1: 'Visual Identity Overhaul - Warm palette, glassmorphism, depth',
    phase2: 'Atmosphere & Backgrounds - Animated scenes, warm gradients, textures',
    phase3: 'Component Polish - Player, mixer, sidebar, timer refinement',
    phase4: 'UX Enhancement - Navigation, onboarding, micro-interactions',
    priority: 'Warmth and atmosphere before features - polish over quantity'
  },

  // II. NEW VISUAL IDENTITY
  visualIdentity: {
    colorPalette: {
      primary: {
        warmAmber: 'rgb(255, 183, 77)',      // Main accent - warm, inviting
        softPeach: 'rgb(255, 218, 185)',     // Secondary accent
        cream: 'rgb(255, 248, 240)',         // Light backgrounds
        ochre: 'rgb(204, 153, 102)',         // Earth tone
      },
      secondary: {
        sageGreen: 'rgb(188, 204, 180)',     // Calming green
        dustyRose: 'rgb(230, 200, 190)',     // Soft pink
        warmBrown: 'rgb(139, 115, 85)',      // Coffee tones
      },
      backgrounds: {
        darkWarm: 'rgb(30, 25, 20)',         // Deep warm dark
        mediumWarm: 'rgb(45, 38, 32)',       // Mid-tone warm
        lightWarm: 'rgb(60, 52, 45)',        // Lighter warm
        overlay: 'rgba(20, 15, 10, 0.7)',    // Scene overlay
      },
      glassmorphism: {
        panel: 'rgba(255, 248, 240, 0.1)',   // Translucent panels
        strong: 'rgba(255, 248, 240, 0.15)', // Stronger panels
        border: 'rgba(255, 183, 77, 0.2)',   // Warm border glow
      },
      text: {
        primary: 'rgb(255, 248, 240)',       // Cream white
        secondary: 'rgba(255, 248, 240, 0.7)', // Muted
        accent: 'rgb(255, 183, 77)',         // Warm amber
      }
    },
    typography: {
      primary: "'Inter', -apple-system, sans-serif", // Clean, modern
      display: "'Nunito', sans-serif",                // Friendly, rounded
      sizes: {
        xs: '0.75rem',   // 12px
        sm: '0.875rem',  // 14px
        base: '1rem',    // 16px
        lg: '1.125rem',  // 18px
        xl: '1.25rem',   // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
      },
      weights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
      }
    },
    spacing: {
      scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128], // 4px base grid
      component: {
        tight: '0.5rem',    // 8px
        normal: '1rem',     // 16px
        relaxed: '1.5rem',  // 24px
        loose: '2rem',      // 32px
      }
    },
    borderRadius: {
      sm: '0.5rem',   // 8px
      md: '0.75rem',  // 12px
      lg: '1rem',     // 16px
      xl: '1.5rem',   // 24px
      full: '9999px',
    },
    shadows: {
      soft: '0 2px 8px rgba(0, 0, 0, 0.15)',
      medium: '0 4px 16px rgba(0, 0, 0, 0.2)',
      large: '0 8px 32px rgba(0, 0, 0, 0.25)',
      glow: '0 0 20px rgba(255, 183, 77, 0.3)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    }
  },

  // III. LAYOUT & UI ARCHITECTURE
  layout: {
    structure: {
      background: 'Full-screen animated scene with warm gradient overlay',
      center: 'Main content area - Pomodoro timer, tasks, or scene focus',
      sidebar: 'Right side - Grouped icon controls with labels on hover',
      player: 'Bottom - Glassmorphic bar with album art, progress, controls',
      mixer: 'Left slide-out or center modal - Layered sound controls',
    },
    zIndex: {
      background: 0,
      overlay: 10,
      scene: 20,
      content: 30,
      panels: 40,
      modals: 50,
      tooltips: 60,
    },
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px',
    }
  },

  // IV. COMPONENT OVERHAUL REQUIREMENTS
  components: {
    player: {
      mustHave: [
        'Album art thumbnail (64x64px minimum)',
        'Animated progress bar with warm glow',
        'Time stamps (current/total)',
        'Volume slider with visual feedback',
        'Smooth hover states on all buttons',
        'Glassmorphic background with backdrop blur',
        'Warm amber accent on active states',
      ],
      spacing: 'Padding: 16px, Gap between elements: 12px',
      height: '80px minimum for touch targets',
    },
    sidebar: {
      mustHave: [
        'Larger icons (48x48px touch targets)',
        'Grouped sections (Scenes, Tools, Settings)',
        'Labels on hover with smooth fade-in',
        'Active state with warm amber glow',
        'Smooth scale animation on hover',
        'Consistent rounded corners (12px)',
      ],
      grouping: {
        scenes: ['Background selector', 'Theme switcher'],
        tools: ['Pomodoro', 'Tasks', 'Timer'],
        settings: ['Mixer', 'Settings', 'Account'],
      }
    },
    mixer: {
      mustHave: [
        'Glassmorphic panel with strong blur',
        'Custom sliders with warm gradient fill',
        'Animated thumb with glow on hover',
        'Visual level indicators (dots/ticks)',
        'Smooth value transitions',
        'Group labels with warm typography',
        'Toggle buttons with amber accent',
      ],
      slider: {
        height: '8px',
        thumb: '20px circle with warm glow',
        fill: 'Gradient from warmAmber to softPeach',
        track: 'Dark warm background with subtle texture',
      }
    },
    pomodoro: {
      mustHave: [
        'Large, readable timer display (64px+ font)',
        'Warm amber glow when active',
        'Smooth countdown animation',
        'Mode switcher (Work/Break)',
        'Session counter',
        'Gentle notification when complete',
        'Center placement with glassmorphic card',
      ]
    },
    backgrounds: {
      mustHave: [
        'Scene selector UI with thumbnails',
        'Animated options (rain, fire, clouds)',
        'Static options (bedroom, café, forest)',
        'Warm gradient overlay on all scenes',
        'Smooth cross-fade transitions',
        'Parallax depth effect',
      ],
      scenes: [
        { id: 'rainy-window', name: 'Rainy Window', animated: true },
        { id: 'cozy-bedroom', name: 'Cozy Bedroom', animated: false },
        { id: 'cafe-corner', name: 'Café Corner', animated: false },
        { id: 'forest-path', name: 'Forest Path', animated: false },
        { id: 'fireplace', name: 'Fireplace', animated: true },
      ]
    }
  },

  // V. ATMOSPHERE & AESTHETIC ENHANCEMENTS
  atmosphere: {
    required: [
      'Warm gradient overlay (amber → peach → cream)',
      'Soft noise texture overlay (2-5% opacity)',
      'Vignette effect (darker edges, warm center)',
      'Depth shadows on all UI elements',
      'Ambient glow from active elements',
      'Smooth parallax on background layers',
      'Floating particle effects (optional, subtle)',
      'Gentle gradient shifts over time',
    ],
    animations: {
      fadeIn: '300ms ease-out',
      fadeOut: '200ms ease-in',
      slide: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      scale: '200ms ease-out',
      glow: '2s ease-in-out infinite alternate',
    }
  },

  // VI. UX FIXES
  ux: {
    navigation: [
      'Tooltips on all icons (show on hover after 500ms)',
      'Grouped sidebar sections with visual separators',
      'Clear active states (warm amber glow)',
      'Smooth transitions between views',
      'Keyboard shortcuts (documented in settings)',
    ],
    onboarding: [
      'Welcome overlay on first visit',
      'Quick tour of key features',
      'Preset suggestions (Rainy Study, Café Vibes)',
      'Dismissible hints for first-time actions',
    ],
    clarity: [
      'Labels on all interactive elements',
      'Visual feedback on all interactions',
      'Loading states for async actions',
      'Error states with helpful messages',
      'Empty states with helpful prompts',
    ]
  },

  // VII. FEATURE REQUIREMENTS
  features: {
    critical: [
      'Background scene selector with previews',
      'Theme switcher (warm dark, warm light, sepia)',
      'Pomodoro timer with session tracking',
      'Simple task list',
      'Sound mixer with visual feedback',
      'Music player with progress tracking',
    ],
    major: [
      'Scene presets (one-click ambiance)',
      'Custom sound mix saving',
      'Focus session statistics',
      'Keyboard shortcuts',
      'Fullscreen focus mode',
    ],
    niceToHave: [
      'User accounts',
      'Spotify integration',
      'Custom background uploads',
      'Collaborative focus rooms',
      'Mobile app',
    ]
  },

  // VIII. REDESIGN CHECKLIST
  checklist: {
    critical: [
      'Replace purple gradient with warm earth palette',
      'Implement glassmorphism on all panels',
      'Add actual background scenes (animated/static)',
      'Fix sidebar - larger icons, labels, grouping',
      'Add depth shadows and warm glows',
      'Improve player with album art and progress',
      'Implement proper spacing system (4px grid)',
      'Add warm gradient overlay on backgrounds',
    ],
    major: [
      'Background scene selector UI',
      'Pomodoro timer in center area',
      'Theme/mood presets',
      'Custom slider designs',
      'Typography overhaul',
      'Micro-interactions everywhere',
      'Visual audio feedback',
      'Task list component',
      'Ambient animations',
    ],
    minor: [
      'Rounded corners on all elements',
      'Soft noise texture overlay',
      'Loading states',
      'Keyboard shortcuts',
      'Tooltips on icons',
      'Smooth transitions',
      'Favicon and meta tags',
    ]
  },

  // IX. FINAL VISION
  vision: {
    feeling: 'Warm, safe, calm, focused - a digital sanctuary',
    aesthetic: 'Warm ochre/cream/sage with soft gradients and organic shadows',
    interaction: 'Every action has gentle micro-animation - sliders glow, buttons compress, panels fade',
    focus: 'Minimalism - only essential elements visible, everything else hides elegantly',
    atmosphere: 'Animated scenes with warm lighting, soft textures, ambient depth',
    polish: 'Premium feel - no rough edges, everything smooth and intentional',
  }
}

