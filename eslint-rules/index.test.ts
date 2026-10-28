// @vitest-environment node
/**
 * Pins the scorp/* rules added for the agent-readiness work (decisions 0023 and
 * 0025). Each rule gets the case it exists to catch and the legitimate code it
 * must leave alone, so a regex tweak cannot quietly widen or blind it.
 */
import { RuleTester } from "eslint";
import { afterAll, describe, it } from "vitest";
import tseslint from "typescript-eslint";

import scorp from "./index.js";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const rules = scorp.rules as Record<string, Parameters<RuleTester["run"]>[1]>;

tester.run("no-undefined-css-var", rules["no-undefined-css-var"], {
  valid: [
    { code: `const c = "bg-[var(--surface-page)] text-[var(--text-primary)]";` },
    // A file may declare its own variables, as an arbitrary property or a style key.
    { code: `const c = "[--local:1px] w-[var(--local)]";` },
    { code: `const s = { ["--tree-level" as string]: 1 }; const c = "pl-[calc(var(--tree-level)*2)]";` },
    // A dynamic suffix is fine when some declared variable has the prefix.
    { code: "const c = `shadow-[var(--elevation-${level})]`;" },
    { code: `const c = "max-h-[var(--popover-available-height)]";`, options: [{ allow: ["--popover-available-height"] }] },
  ],
  invalid: [
    { code: `const c = "bg-[var(--surface-default)]";`, errors: [{ messageId: "undefined" }] },
    { code: `const c = "text-[var(--text-primry)]";`, errors: [{ messageId: "undefined" }] },
    { code: "const c = `bg-[var(--nope-${x})]`;", errors: [{ messageId: "undefined" }] },
  ],
});

tester.run("no-default-tailwind", rules["no-default-tailwind"], {
  valid: [
    { code: `const c = "bg-secondary-900 text-[var(--text-primary)] rounded-none plate-round";` },
    { code: `const c = "duration-[var(--duration-fast)] ease-[var(--easing-ease-out)] font-mono";` },
    // Prose under a Storybook docs key is not a class list.
    { code: `const meta = { parameters: { docs: { description: { component: "a drop-shadow filter, not rounded" } } } };` },
  ],
  invalid: [
    { code: `const c = "bg-gray-900";`, errors: [{ messageId: "palette" }] },
    { code: `const c = "hover:!text-white";`, errors: [{ messageId: "palette" }] },
    { code: `const c = "shadow-lg";`, errors: [{ messageId: "shadow" }] },
    { code: `const c = "rounded";`, errors: [{ messageId: "rounded" }] },
    { code: `const c = "duration-300";`, errors: [{ messageId: "motion" }] },
    { code: `const c = "ease-[cubic-bezier(0.4,0,0.2,1)]";`, errors: [{ messageId: "motion" }] },
    { code: `const c = "font-['Inter']";`, errors: [{ messageId: "font" }] },
  ],
});

tester.run("no-slow-motion", rules["no-slow-motion"], {
  valid: [
    { code: `const c = "duration-[var(--duration-fast)]";` },
    {
      code: `const s = { animationDuration: "var(--duration-slow)" };`,
      filename: "/repo/packages/components/src/components/BottomSheet.tsx",
      options: [{ overlayFiles: ["packages/components/src/components/BottomSheet.tsx"] }],
    },
  ],
  invalid: [
    { code: `const s = { animationDuration: "var(--duration-slow)" };`, errors: [{ messageId: "slow" }] },
    {
      code: `const s = { animationDuration: "var(--duration-slower)" };`,
      filename: "/repo/packages/components/src/components/BottomSheet.tsx",
      options: [{ overlayFiles: ["packages/components/src/components/BottomSheet.tsx"] }],
      errors: [{ messageId: "slow" }],
    },
    { code: `const s = { transition: "opacity 300ms" };`, errors: [{ messageId: "raw" }] },
    { code: `const s = { transitionDuration: 300 };`, errors: [{ messageId: "raw" }] },
  ],
});

tester.run("no-style-literals", rules["no-style-literals"], {
  valid: [
    { code: `const a = <div style={{ zIndex: "var(--z-index-modal)", flex: 1, margin: 0 }} />;` },
    { code: `const a = <div style={{ width: \`\${pct}%\` }} />;` },
    { code: `const a = <div style={{ ["--local" as string]: 4 }} />;` },
  ],
  invalid: [
    { code: `const a = <div style={{ padding: 12 }} />;`, errors: [{ messageId: "number" }] },
    { code: `const a = <div style={{ zIndex: 9999 }} />;`, errors: [{ messageId: "number" }] },
    { code: `const a = <div style={{ fontFamily: "Arial, sans-serif" }} />;`, errors: [{ messageId: "string" }] },
    { code: `const a = <div style={{ margin: "4px 8px" }} />;`, errors: [{ messageId: "string" }] },
  ],
});

tester.run("no-deep-import", rules["no-deep-import"], {
  valid: [
    { code: `import { Button } from "@scorp-ds/components";` },
    { code: `import "@scorp-ds/tokens/styles/tokens.css";` },
    { code: `import "@scorp-ds/components/styles";` },
  ],
  invalid: [
    { code: `import { Button } from "@scorp-ds/components/src/components/Button";`, errors: [{ messageId: "deep" }] },
    { code: `import tokens from "@scorp-ds/tokens/src/tokens.json";`, errors: [{ messageId: "deep" }] },
    { code: `const m = import("@scorp-ds/components/src/lib/utils");`, errors: [{ messageId: "deep" }] },
  ],
});

tester.run("no-legacy-package", rules["no-legacy-package"], {
  valid: [{ code: `import { Button } from "@scorp-ds/components";` }],
  invalid: [
    { code: `import x from "@sachahurley/scorpion-ui";`, errors: [{ messageId: "legacy" }] },
    { code: `const m = import("@sachahurley/scorpion-ui/button");`, errors: [{ messageId: "legacy" }] },
  ],
});

tester.run("no-arbitrary-values", rules["no-arbitrary-values"], {
  valid: [{ code: `const c = "w-[var(--control-height-md)] max-h-[70vh]";`, options: [{ allow: ["max-h-[70vh]"] }] }],
  invalid: [
    { code: `const c = "w-[13px]";`, errors: [{ messageId: "bare" }] },
    { code: `const c = "duration-[400ms]";`, errors: [{ messageId: "bare" }] },
  ],
});
