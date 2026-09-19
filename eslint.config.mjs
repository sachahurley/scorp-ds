import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/storybook-static/**"],
  },
  {
    files: [
      "packages/*/src/**/*.{ts,tsx}",
      "packages/storybook/stories/**/*.{ts,tsx}",
      "packages/storybook/presets/**/*.{ts,tsx}",
      "packages/storybook/.storybook/**/*.{ts,tsx}",
    ],
    rules: {
      // Design-system code often uses `any` during migration; tighten over time.
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
