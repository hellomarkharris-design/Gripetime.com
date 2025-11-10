import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Gripetime.com/",  // 👈 ADD THIS LINE
  plugins: [react()],
});
