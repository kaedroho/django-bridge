import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/static/",
  build: {
    manifest: true,
    rollupOptions: {
      input: "/src/main.tsx",
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@django-bridge/react": "/code/packages/react/src/index.tsx",
      "@common": "/code/packages/common/index.ts",
    },
  },
});
