// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // DELETE or CHANGE this line:
  base: '/', 
  plugins: [react()],
})

