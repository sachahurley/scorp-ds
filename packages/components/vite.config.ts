import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    // `build:css` writes dist/styles.css separately, and Vite empties outDir by
    // default when it sits inside root. Without this, every `build:js` deletes
    // styles.css. `npm run dev` reruns build:js on each watch rebuild, and the
    // portfolio's dev.sh syncs that gap straight into its vendor/ copy.
    emptyOutDir: false,
    lib: {
      entry: path.resolve(dirname, "src/index.ts"),
      name: "ScorpDSComponents",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.js"),
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "next-themes",
      ],
      output: {
        exports: "named",
        interop: "auto",
      },
    },
    sourcemap: true,
  },
});
