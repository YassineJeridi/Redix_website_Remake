// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }),
  ],
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    // Proxy API calls if needed
    proxy: {
      '/api': {
        target: 'https://api.redixsolutions.pro',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015',
    
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils/helpers.js', './src/utils/constants.js']
        }
      }
    },
    
    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    
    // CSS configuration
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@data': resolve(__dirname, 'src/data'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services')
    }
  },
  
  // CSS configuration
  css: {
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.css";`
      }
    }
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Preview server (for production build testing)
  preview: {
    port: 4173,
    host: true,
    open: true
  },
  
  // ESBuild configuration
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  
  // Base public path
  base: '/',
  
  // Public directory
  publicDir: 'public',
  
  // Environment directory
  envDir: '.',
  
  // Worker configuration
  worker: {
    format: 'es'
  }
})
