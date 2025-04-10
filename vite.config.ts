/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Vitest configuration
  test: {
    globals: true, // Use Vitest global APIs
    environment: 'jsdom', // Simulate browser environment
    setupFiles: './src/setupTests.ts', // Setup file
    css: true, // Process CSS
  },
})
