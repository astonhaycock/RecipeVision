import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    proxy: {
      "/images": {
        target: "https://dont-pani.cc:8443",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "https://dont-pani.cc:8443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
