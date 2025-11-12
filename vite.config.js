import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: this must match your repo name exactly (case-sensitive)
export default defineConfig({
  plugins: [react()],
  base: '/Gripetime.com/',
})
