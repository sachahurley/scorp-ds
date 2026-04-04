import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@scorp-ds/components": path.resolve(dirname, "packages/components/src/index.ts"),
      "@scorp-ds/tokens": path.resolve(dirname, "packages/tokens/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: false,
    include: ["packages/**/*.test.{ts,tsx}"],
  },
});
