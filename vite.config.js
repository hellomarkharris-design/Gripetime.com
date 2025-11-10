import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Gripetime.com/",   // 👈 important for GitHub Pages subpath
  plugins: [react()],
});
