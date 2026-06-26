import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d'
            }
            if (id.includes('@theatre')) {
              return 'vendor-theatre'
            }
          }
        }
      }
    }
  }
})
