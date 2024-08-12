import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

let env = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: parseInt(env.LOCAL_PORT || "8080"),
    strictPort: true,
    proxy: {
      "/images": {
        target: `http://localhost:${env.BACKEND_PORT}`,
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: `http://localhost:${env.BACKEND_PORT}`,
        rewriteWsOrigin: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
