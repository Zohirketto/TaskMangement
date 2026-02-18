import { defineConfig } from 'vite'
import dns from 'node:dns'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    allowedHosts: ['localhost'],
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 5173
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          dnd: ['@hello-pangea/dnd'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
