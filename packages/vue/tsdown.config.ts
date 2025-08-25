import { defineConfig } from "tsdown";
import Vue from "unplugin-vue/rolldown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  platform: "neutral",
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
  minify: true,
  clean: true,
  external: ["vue"],
});
