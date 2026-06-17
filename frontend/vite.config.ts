/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  test: {
    environment: 'jsdom', 
    globals: true, 
    setupFiles: './src/setupTests.ts', 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      
      include: ['src/app/pages/**/*.{ts,tsx}', 'src/app/components/**/*.{ts,tsx}'],
      exclude: ['src/app/components/ui/**', 'src/app/components/service/**'], 
      
    },
  },
})