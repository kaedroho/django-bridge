import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/static/",
  build: {
    manifest: true,
    rollupOptions: {
      input: "/src/main.ts",
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@django-bridge/vue": "/code/packages/vue/src/index.ts",
      "@common": "/code/packages/common/index.ts",
    },
  },
});
