import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Gripetime.com/", // 👈 IMPORTANT for GitHub Pages (project site)
});
