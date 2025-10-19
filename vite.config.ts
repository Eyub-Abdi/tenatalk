import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@features": "/src/features",
      "@lib": "/src/lib",
      "@theme": "/src/theme",
      "@components": "/src/components",
    },
  },
  build: {
    sourcemap: true,
  },
});
