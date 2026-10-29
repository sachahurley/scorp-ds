import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import jsxA11y from "eslint-plugin-jsx-a11y";

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
      "scorp/prop-jsdoc": "error",
      "scorp/no-default-tailwind": "error",
      "scorp/no-style-literals": "error",
      "scorp/no-off-scale-spacing": [
        "error",
        {
          // Off-scale steps that are derived geometry, not spacing choices.
          allow: [
            // Field message indent: the 20px box plus the 8px label gap (Checkbox, Radio).
            "pl-7",
            // Combobox text clears the chevron: its right inset plus the icon box, sm and lg.
            "pr-9",
            "pr-11",
            // CaseStudy section rhythm at sm and up (#98): page-level, above the control scale.
            "mt-32",
          ],
        },
      ],
      "scorp/no-slow-motion": [
        "error",
        {
          // Overlays entering or leaving the viewport may use --duration-slow
          // (docs/decisions/0025). Add a file here only for that reason.
          overlayFiles: ["packages/components/src/components/BottomSheet.tsx"],
        },
      ],
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
      "scorp/no-raw-color": "error",
      "scorp/no-raw-scale": "error",
      "scorp/no-default-tailwind": "error",
      "scorp/no-arbitrary-values": [
        "error",
        {
          // Story canvases, not component geometry. Each one sizes the frame so
          // the subject (an open panel, a dragged thumb, a wide table) fits in
          // the captured screenshot. They never reach a consumer.
          allow: [
            // Popover stories: room for the open panel on each side.
            "min-w-[420px]",
            "min-h-[360px]",
            "min-h-[420px]",
            // Slider: a track long enough to show step marks.
            "w-[32rem]",
            // Token doc tables: wide enough that values do not wrap.
            "min-w-[720px]",
          ],
        },
      ],
    },
  },
  // Every var(--name), everywhere outside packages/tokens, must name a custom
  // property that exists (docs/decisions/0023). The token stories are included:
  // a typo there documents a token that is not real. Deep imports into another
  // package's src/ are banned for the same audience: the barrel is the contract.
  {
    files: [
      "packages/components/src/**/*.{ts,tsx}",
      "packages/storybook/stories/**/*.{ts,tsx}",
      "packages/storybook/presets/**/*.{ts,tsx}",
      "packages/storybook/.storybook/**/*.{ts,tsx}",
      "packages/site/src/**/*.{ts,tsx}",
    ],
    ignores: ["packages/components/src/__tests__/**"],
    plugins: { scorp },
    rules: {
      "scorp/no-undefined-css-var": [
        "error",
        {
          allow: [
            // Set inline by Popover on its panel, read with a fallback by the
            // Combobox list it anchors. Runtime geometry, not a token.
            "--popover-available-height",
          ],
        },
      ],
      "scorp/no-deep-import": "error",
      "scorp/no-legacy-package": "error",
    },
  },
  // The site is a consumer of the system and gets the consumer rules.
  {
    files: ["packages/site/src/**/*.{ts,tsx}"],
    plugins: { scorp },
    rules: {
      "scorp/no-raw-color": "error",
      "scorp/no-raw-scale": "error",
      "scorp/no-rounded": "error",
      "scorp/no-sans": "error",
      "scorp/no-default-tailwind": "error",
      "scorp/no-arbitrary-values": ["error", { allow: [] }],
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
      "scorp/story-skip-visual-reason": "error",
      "scorp/story-interaction-needs-play": "error",
    },
  },
  // Accessibility in the markup itself, before axe ever renders it: an icon-only
  // control with no name, a click handler on a div, an image with no alt. Axe
  // only sees what a story renders; this sees every branch of the source.
  {
    files: [
      "packages/components/src/**/*.tsx",
      "packages/storybook/stories/**/*.tsx",
      "packages/storybook/presets/**/*.tsx",
      "packages/site/src/**/*.tsx",
    ],
    ignores: ["packages/components/src/__tests__/**"],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // `role` and `autoFocus` on our own components (Popover) are props, not DOM attributes.
      "jsx-a11y/aria-role": ["error", { ignoreNonDOM: true }],
      "jsx-a11y/no-autofocus": ["error", { ignoreNonDOM: true }],
    },
  }
);
