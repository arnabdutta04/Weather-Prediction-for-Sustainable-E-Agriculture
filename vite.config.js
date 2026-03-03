import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Weather-Prediction-for-Sustainable-E-Agriculture/',
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
})