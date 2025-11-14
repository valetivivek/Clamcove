import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Mixer components (heavy audio logic)
          if (id.includes('mixer')) {
            return 'mixer'
          }
          // Player components
          if (id.includes('player')) {
            return 'player'
          }
          // Large components
          if (id.includes('PomodoroPanel') || id.includes('TasksNotesPanel')) {
            return 'panels'
          }
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  publicDir: 'public',
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})

