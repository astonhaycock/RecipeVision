import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    server: {
      host: true,
      port: `${env.LOCAL_PORT}`,
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
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  } as any;
});
