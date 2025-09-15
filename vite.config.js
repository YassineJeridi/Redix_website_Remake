// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Redix_website_Remake/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
