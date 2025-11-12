import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: replace with your repo name exactly as it appears on GitHub.
// If your repo is "Gripetime.com", keep "/Gripetime.com/".
const base = "/Gripetime.com/";

export default defineConfig({
  plugins: [react()],
  base
});
