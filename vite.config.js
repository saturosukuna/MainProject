import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/MainProject/',
  plugins: [
    tailwindcss(),
    react()],
    
})
 // build: {
    //   outDir: path.resolve(__dirname, 'backend/dist'), 
    //   chunkSizeWarningLimit: 1600,// Output build to backend folder
    //   emptyOutDir: true
    // },
    // server: {
    //   proxy: {
    //     '/api': 'http://localhost:5000' // Proxy API requests to Express
    //   }
    // },