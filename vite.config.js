import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 7001,
    proxy: {
      '*': { target: 'https://diary-notes-v1-backend.vercel.app' }
    } // change as needed
  }
})
