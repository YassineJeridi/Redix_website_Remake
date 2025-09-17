// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Redix_website_Remake/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public', // Ensure this is set
  server: {
    fs: {
      strict: false // Allow serving files outside of root if needed
    }
  }
})
