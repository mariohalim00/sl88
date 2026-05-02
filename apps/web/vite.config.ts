import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Production build config for apps/web.
// Development serving is handled by Bun's fullstack dev server via apps/api.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": resolve(__dirname, "../api/src"),
      "@sl88/shared": resolve(__dirname, "../../packages/shared/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
