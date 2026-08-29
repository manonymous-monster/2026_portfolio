import { defineConfig } from "vite";

// Multi-page site: do NOT fall back missing URLs to /index.html
// (that was why /works/... showed WORKS + PROFILE).
export default defineConfig({
  appType: "mpa",
  server: {
    port: 5173,
    strictPort: true,
  },
});
