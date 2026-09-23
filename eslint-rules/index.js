/**
 * scorp/* — ESLint rules that enforce the "No Hardcoding" and "What NOT to Do"
 * sections of CLAUDE.md.
 *
 * Every rule here exists because the repo already complies with it. They are
 * ratchets that keep a clean baseline clean, not a cleanup backlog.
 *
 * Scope: these are applied to packages/components/src in eslint.config.mjs.
 * They deliberately do NOT run against packages/tokens, which is the one place
 * raw values are allowed to live.
 */

"use strict";

/** Walks every string a file contains: plain literals and template chunks. */
function stringVisitors(check) {
  return {
    Literal(node) {
      if (typeof node.value === "string") check(node, node.value);
    },
    TemplateElement(node) {
      const raw = node.value && node.value.raw;
      if (raw) check(node, raw);
    },
  };
}

/** Collects every match of `re` in `text`, resetting lastIndex for safety. */
function matchAll(re, text) {
  const out = [];
  const rx = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = rx.exec(text)) !== null) {
    out.push(m);
    if (m.index === rx.lastIndex) rx.lastIndex++;
  }
  return out;
}

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const COLOR_FN = /\b(?:rgba?|hsla?)\(/;
const RAW_SCALE =
  /\b(?:bg|text|border|ring|fill|stroke|from|via|to|decoration|outline|accent|caret|divide|placeholder)-(?:amber|sepia|green|blue|purple|red)-\d{2,3}\b/;
const ROUNDED = /\brounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|es|ee))?-(?:sm|md|lg|xl|2xl|3xl|full)\b/;
const SANS = /\bfont-(?:sans|serif)\b/;

/**
 * A Tailwind arbitrary value holding a bare numeric literal, e.g. `w-[18px]`.
 * Anything routed through a custom property, an intrinsic unit, a fraction or a
 * keyword is left alone: those are legitimate and make up the large majority.
 */
const ARBITRARY = /\b[a-z][a-z0-9-]*-\[([^\]]+)\]/;
const BARE_NUMBER = /^-?\d*\.?\d+(px|rem|em|%)?$/;

module.exports = {
  rules: {
    "no-raw-color": {
      meta: {
        type: "problem",
        docs: { description: "No hex, rgb() or hsl() colors in component code. Use token-backed classes or var(--token)." },
        schema: [],
        messages: {
          hex: "Raw hex color '{{value}}'. Use a token-backed Tailwind class (bg-primary-400) or var(--token).",
          fn: "Raw {{value}} color. Use a token-backed class or var(--token). Raw values belong in packages/tokens.",
        },
      },
      create: (context) =>
        stringVisitors((node, text) => {
          for (const m of matchAll(HEX, text)) {
            context.report({ node, messageId: "hex", data: { value: m[0] } });
          }
          for (const m of matchAll(COLOR_FN, text)) {
            context.report({ node, messageId: "fn", data: { value: m[0].replace("(", "()") } });
          }
        }),
    },

    "no-raw-scale": {
      meta: {
        type: "problem",
        docs: { description: "Use semantic aliases (primary-*, secondary-*) rather than raw color scales, so the system stays re-themeable." },
        schema: [],
        messages: {
          raw: "'{{value}}' uses a raw color scale. Use the semantic alias instead (primary, secondary, success, info, warning, error), so the system can be re-themed.",
        },
      },
      create: (context) =>
        stringVisitors((node, text) => {
          for (const m of matchAll(RAW_SCALE, text)) {
            context.report({ node, messageId: "raw", data: { value: m[0] } });
          }
        }),
    },

    "no-rounded": {
      meta: {
        type: "problem",
        docs: { description: "Scorp DS is sharp-cornered. Use rounded-none, or the plate-round silhouettes." },
        schema: [],
        messages: {
          rounded:
            "'{{value}}' is a border radius. Scorp DS uses sharp corners: use rounded-none, or plate-round / plate-round-lg for a softened corner. There are no radius tokens.",
        },
      },
      create: (context) =>
        stringVisitors((node, text) => {
          for (const m of matchAll(ROUNDED, text)) {
            context.report({ node, messageId: "rounded", data: { value: m[0] } });
          }
        }),
    },

    "no-sans": {
      meta: {
        type: "problem",
        docs: { description: "Monospace only (Fragment Mono)." },
        schema: [],
        messages: { sans: "'{{value}}' is not monospace. Scorp DS is monospace throughout (Fragment Mono)." },
      },
      create: (context) =>
        stringVisitors((node, text) => {
          for (const m of matchAll(SANS, text)) {
            context.report({ node, messageId: "sans", data: { value: m[0] } });
          }
        }),
    },

    "no-arbitrary-values": {
      meta: {
        type: "problem",
        docs: { description: "No bare numeric literals in Tailwind arbitrary values. Route through a token, or allowlist with a reason." },
        schema: [
          {
            type: "object",
            properties: {
              allow: {
                type: "array",
                items: { type: "string" },
                description: "Exact class strings permitted as one-off geometry.",
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          bare:
            "'{{value}}' hardcodes {{inner}}. Add a token and use -[var(--token)], or add it to the rule's allow list in eslint.config.mjs with a comment saying why it is one-off geometry.",
        },
      },
      create(context) {
        const allow = new Set((context.options[0] && context.options[0].allow) || []);
        return stringVisitors((node, text) => {
          for (const m of matchAll(ARBITRARY, text)) {
            const [full, inner] = m;
            if (allow.has(full)) continue;
            // Anything referencing a custom property is fine by definition.
            if (inner.includes("var(--")) continue;
            if (!BARE_NUMBER.test(inner.trim())) continue;
            context.report({ node, messageId: "bare", data: { value: full, inner } });
          }
        });
      },
    },

    "no-legacy-package": {
      meta: {
        type: "problem",
        docs: { description: "The old @sachahurley/scorpion-ui package must never be imported." },
        schema: [{ type: "object", properties: { packages: { type: "array", items: { type: "string" } } }, additionalProperties: false }],
        messages: { legacy: "'{{name}}' is a forbidden package. Import from @scorp-ds/* instead." },
      },
      create(context) {
        const forbidden = (context.options[0] && context.options[0].packages) || ["@sachahurley/scorpion-ui"];
        const check = (node, name) => {
          if (typeof name !== "string") return;
          if (forbidden.some((f) => name === f || name.startsWith(f + "/"))) {
            context.report({ node, messageId: "legacy", data: { name } });
          }
        };
        return {
          ImportDeclaration: (node) => check(node, node.source.value),
          ExportNamedDeclaration: (node) => node.source && check(node, node.source.value),
          ExportAllDeclaration: (node) => node.source && check(node, node.source.value),
        };
      },
    },

    "no-element-focus-in-story": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Story play functions must drive focus with the keyboard. :focus-visible does not match programmatic focus, so element.focus() renders no ring while still looking like passing coverage.",
        },
        schema: [],
        messages: {
          programmatic:
            "Focus a control with `await userEvent.tab()`, not `.focus()`. The focus ring recipe is `focus-visible`, which does not match programmatic focus: this would capture a frame with no ring in it and still look like passing coverage. Focusing the window (`canvasElement.ownerDocument.defaultView?.focus()`) is fine and is not what this flags.",
        },
      },
      create(context) {
        /** `window.focus()` and `…defaultView?.focus()` are legitimate: they focus the
         *  frame so that a subsequent Tab lands somewhere. Only element focus is wrong. */
        function isWindowFocus(object) {
          if (!object) return false;
          if (object.type === "Identifier") return object.name === "window";
          if (object.type === "MemberExpression" || object.type === "OptionalMemberExpression") {
            const prop = object.property;
            return prop && prop.type === "Identifier" && (prop.name === "defaultView" || prop.name === "window");
          }
          if (object.type === "TSNonNullExpression" || object.type === "ChainExpression") {
            return isWindowFocus(object.expression);
          }
          return false;
        }

        return {
          CallExpression(node) {
            const callee = node.callee;
            if (!callee) return;
            if (callee.type !== "MemberExpression" && callee.type !== "OptionalMemberExpression") return;
            if (!callee.property || callee.property.name !== "focus") return;
            if (isWindowFocus(callee.object)) return;
            context.report({ node, messageId: "programmatic" });
          },
        };
      },
    },

    "public-jsdoc": {
      meta: {
        type: "suggestion",
        docs: { description: "Every exported component needs a JSDoc comment explaining usage." },
        schema: [],
        messages: {
          missing: "Exported '{{name}}' has no JSDoc comment. Document what it is for, not just what it is named.",
        },
      },
      create(context) {
        const source = context.sourceCode || context.getSourceCode();

        function hasJsdoc(node) {
          const comments = source.getCommentsBefore(node);
          return comments.some((c) => c.type === "Block" && c.value.startsWith("*"));
        }

        function isComponentName(name) {
          return typeof name === "string" && /^[A-Z]/.test(name);
        }

        return {
          ExportNamedDeclaration(node) {
            const decl = node.declaration;
            if (!decl) return;

            if (decl.type === "FunctionDeclaration" && decl.id && isComponentName(decl.id.name)) {
              if (!hasJsdoc(node)) {
                context.report({ node: decl.id, messageId: "missing", data: { name: decl.id.name } });
              }
              return;
            }

            if (decl.type === "VariableDeclaration") {
              for (const d of decl.declarations) {
                if (!d.id || d.id.type !== "Identifier" || !isComponentName(d.id.name)) continue;
                if (!d.init) continue;
                const init = d.init;
                const isComponentish =
                  init.type === "ArrowFunctionExpression" ||
                  init.type === "FunctionExpression" ||
                  (init.type === "CallExpression" &&
                    init.callee &&
                    ((init.callee.name === "forwardRef") ||
                      (init.callee.property && init.callee.property.name === "forwardRef") ||
                      (init.callee.name === "memo")));
                if (!isComponentish) continue;
                if (!hasJsdoc(node) && !hasJsdoc(d)) {
                  context.report({ node: d.id, messageId: "missing", data: { name: d.id.name } });
                }
              }
            }
          },
        };
      },
    },
  },
};
