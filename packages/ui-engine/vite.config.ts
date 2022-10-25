import { resolve } from "path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import importHttp from 'import-http';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "Patente",
      formats: ["iife"],
    },
    rollupOptions: {
      plugins: [importHttp],
      output: {
        entryFileNames: `patente.min.js`,
      },
    },
  },
});
