import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Gripetime.com/',      // EXACT repo name, case-sensitive
  plugins: [react()]
})
