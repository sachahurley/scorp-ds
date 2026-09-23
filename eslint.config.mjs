import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import scorp from "./eslint-rules/index.js";

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
  },
  // ─── scorp/* design-system rules ──────────────────────────────────────────
  //
  // These enforce the "No Hardcoding" and "What NOT to Do" sections of
  // CLAUDE.md, which were previously prose that nothing checked. The codebase
  // already satisfies every one of them: they are ratchets, not a backlog.
  //
  // packages/tokens is deliberately excluded. It is the one place raw values
  // are allowed to live.
  {
    files: ["packages/components/src/**/*.{ts,tsx}"],
    ignores: ["packages/components/src/__tests__/**"],
    plugins: { scorp },
    rules: {
      "scorp/no-raw-color": "error",
      "scorp/no-raw-scale": "error",
      "scorp/no-rounded": "error",
      "scorp/no-sans": "error",
      "scorp/no-legacy-package": "error",
      "scorp/public-jsdoc": "error",
      "scorp/no-arbitrary-values": [
        "error",
        {
          // One-off geometry that no token would make clearer. Every entry
          // needs a reason; anything reusable belongs in tokens.json instead.
          allow: [
            // Viewport-relative ceilings: these track the window, not the scale.
            "max-h-[70vh]",
            "max-h-[80vh]",
            // Letter-spacing for the case-study eyebrow, in em so it tracks font size.
            "tracking-[0.08em]",
            // Intrinsic line-height box for the field message row.
            "h-[1lh]",
            // Bottom-sheet max width: a single layout ceiling, not a scale step.
            "w-[min(540px,100%)]",
            // Button outline recipe: local stacking inside an `isolate` context,
            // pushing the ::before fill behind the border. Not a system layer, so
            // it deliberately does not use the --z-index-* scale.
            "z-[1]",
          ],
        },
      ],
    },
  },
  // Stories and presets get the colour, shape and typography rules too: a
  // hardcoded value in a story is still a hardcoded value in the docs. The
  // token stories are exempt, since rendering raw values is their purpose.
  {
    files: ["packages/storybook/stories/**/*.{ts,tsx}", "packages/storybook/presets/**/*.{ts,tsx}"],
    ignores: [
      "packages/storybook/stories/Foundation/**",
      "packages/storybook/stories/Semantic/**",
    ],
    plugins: { scorp },
    rules: {
      "scorp/no-rounded": "error",
      "scorp/no-sans": "error",
      "scorp/no-legacy-package": "error",
    },
  },
  // Story files only. A `play` function that focuses an element in JS captures a
  // frame with no focus ring in it, because the ring recipe is `focus-visible`
  // and that does not match programmatic focus. The frame then matches its
  // baseline forever and reads as coverage, which is worse than having none.
  {
    files: ["packages/storybook/stories/**/*.stories.{ts,tsx}"],
    plugins: { scorp },
    rules: {
      "scorp/no-element-focus-in-story": "error",
    },
  }
);
