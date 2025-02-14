import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  outDir: "dist",
  format: "cjs",
  dts: true,
  minify: true,
  clean: true,
  noExternal: ["@django-bridge/common", "telepath-unpack"],
});
