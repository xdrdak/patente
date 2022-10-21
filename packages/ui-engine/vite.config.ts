import { resolve } from "path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "Patente",
      formats: ["iife"],
      // the proper extensions will be added
    },
    rollupOptions: {
      output: {
        entryFileNames: `patente.min.js`,
      },
    },
  },
});
