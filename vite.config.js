
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// HashRouter in the app means no special rewrites needed on Vercel
export default defineConfig({
  base: '/',
  plugins: [react()]
})
