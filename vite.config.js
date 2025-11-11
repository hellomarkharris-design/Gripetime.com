import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Gripetime.com/', // ✅ YOUR repo folder name for GitHub Pages
})
