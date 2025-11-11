import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Gripetime.com/", // must match repo name exactly (case-sensitive)
  plugins: [react()],
});
