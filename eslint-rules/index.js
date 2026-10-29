/**
 * scorp/* — ESLint rules that enforce the "No Hardcoding" and "What NOT to Do"
 * sections of CLAUDE.md.
 *
 * Every rule here exists because the repo already complies with it. They are
 * ratchets that keep a clean baseline clean, not a cleanup backlog.
 *
 * Scope is set in eslint.config.mjs: the full set on packages/components/src,
 * the colour, shape, type and token-name rules on stories, presets and the site.
 * They deliberately do NOT run against packages/tokens, which is the one place
 * raw values are allowed to live. eslint-rules/index.test.ts pins each rule's
 * valid and invalid cases.
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

const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * Stylesheets whose custom properties count as declared. tokens.css is the token
 * contract; the others declare a handful of app-level variables of their own.
 */
const DECLARING_STYLESHEETS = [
  "packages/tokens/src/styles/tokens.css",
  "packages/components/src/styles.css",
  "packages/storybook/styles/global.css",
  "packages/site/src/index.css",
];

let declaredCache = null;
/** Every custom property declared in the stylesheets above, read once per lint run. */
function declaredVariables() {
  if (declaredCache) return declaredCache;
  declaredCache = new Set();
  for (const rel of DECLARING_STYLESHEETS) {
    let css = "";
    try {
      css = fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");
    } catch {
      continue;
    }
    for (const m of matchAll(/(--[a-zA-Z0-9-]+)\s*:/, css)) declaredCache.add(m[1]);
  }
  return declaredCache;
}

/**
 * Variables a file declares for itself: `[--name:…]` arbitrary properties, and
 * `"--name"` keys in style objects. These are component-local plumbing, not tokens.
 */
function locallyDeclared(sourceText) {
  const out = new Set();
  for (const m of matchAll(/(?:\[|["'`])(--[a-zA-Z0-9-]+)(?=["'`]|\s*:)/, sourceText)) out.add(m[1]);
  return out;
}

let spacingCache = null;
/** Tailwind step names for global.spacing in tokens.json: `0-5` becomes `0.5`. */
function spacingScale() {
  if (spacingCache) return spacingCache;
  const tokens = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "packages/tokens/src/tokens.json"), "utf8"));
  spacingCache = new Set(Object.keys(tokens.global.spacing).map((k) => k.replace("-", ".")));
  return spacingCache;
}

/**
 * True when a string sits under a Storybook `docs` / `description` key: that is
 * prose about the system ("a drop-shadow filter on a wrapper"), not class names.
 */
function isDocsProse(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === "Property") {
      const key = p.key && (p.key.name || p.key.value);
      if (key === "docs" || key === "description") return true;
    }
  }
  return false;
}

/** Splits a string into Tailwind-looking tokens, stripping variants (`hover:`, `dark:`) and `!`. */
function classTokens(text) {
  const out = [];
  for (const raw of text.split(/\s+/)) {
    if (!raw) continue;
    // Variant prefixes are everything up to the last top-level colon (not inside brackets).
    let depth = 0;
    let cut = -1;
    for (let i = 0; i < raw.length; i++) {
      const c = raw[i];
      if (c === "[") depth++;
      else if (c === "]") depth--;
      else if (c === ":" && depth === 0) cut = i;
    }
    let token = cut >= 0 ? raw.slice(cut + 1) : raw;
    token = token.replace(/^!/, "").replace(/^-/, "");
    out.push(token);
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
const BARE_NUMBER = /^-?\d*\.?\d+(px|rem|em|%|ms|s)?$/;

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

    "no-undefined-css-var": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Every var(--name) must be a custom property that exists: declared in tokens.css (or one of the app stylesheets), or declared by the same file. Decision 0023.",
        },
        schema: [
          {
            type: "object",
            properties: { allow: { type: "array", items: { type: "string" } } },
            additionalProperties: false,
          },
        ],
        messages: {
          undefined:
            "'{{name}}' is not declared in tokens.css or in this file. Copy the exact name from packages/tokens/src/styles/tokens.css; if the token you need does not exist, add it to tokens.json and tokens.css first (docs/decisions/0023).",
        },
      },
      create(context) {
        const allow = new Set((context.options[0] && context.options[0].allow) || []);
        const source = context.sourceCode || context.getSourceCode();
        const declared = declaredVariables();
        const local = locallyDeclared(source.getText());
        const known = (name) => declared.has(name) || local.has(name) || allow.has(name);

        return {
          Literal(node) {
            if (typeof node.value === "string") checkText(node, node.value, false);
          },
          TemplateElement(node) {
            const raw = node.value && node.value.raw;
            // A chunk followed by an interpolation may end in a name prefix: `var(--elevation-${level})`.
            if (raw) checkText(node, raw, !node.tail);
          },
        };

        function checkText(node, text, endsAtInterpolation) {
          for (const m of matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/, text)) {
            const name = m[1];
            const atEnd = m.index + m[0].length === text.length;
            if (endsAtInterpolation && atEnd && name.endsWith("-")) {
              // Dynamic suffix: at least one declared variable must start with the prefix.
              if ([...declared].some((d) => d.startsWith(name)) || [...local].some((d) => d.startsWith(name))) continue;
            } else if (known(name)) {
              continue;
            }
            context.report({ node, messageId: "undefined", data: { name } });
          }
        }
      },
    },

    "no-default-tailwind": {
      meta: {
        type: "problem",
        docs: {
          description:
            "The preset extends Tailwind rather than replacing it, so Tailwind's own palette, shadows, radii, durations and fonts still compile. None of them are tokens.",
        },
        schema: [],
        messages: {
          palette: "'{{value}}' is Tailwind's default palette, not a token. Use a semantic variable (text-[var(--text-primary)]) or a semantic alias scale (bg-secondary-900).",
          shadow: "'{{value}}' is a Tailwind default shadow. Depth is carried by borders; use an --elevation-* variable if a shadow is genuinely needed.",
          rounded: "'{{value}}' is a border radius. Use rounded-none, or plate-round / plate-round-lg.",
          motion: "'{{value}}' is a raw duration, delay or easing. Use the motion tokens: duration-[var(--duration-fast)], ease-[var(--easing-ease-out)] (docs/decisions/0025).",
          font: "'{{value}}' sets a font outside the system. Scorp DS is Fragment Mono throughout: use font-mono.",
        },
      },
      create(context) {
        const PALETTE =
          /^(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|fill|stroke|from|via|to|divide|outline|decoration|placeholder|caret|accent|shadow)-(?:white|black|slate|gray|zinc|neutral|stone|orange|yellow|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d+)?$/;
        const SHADOW = /^(?:drop-)?shadow(?:-(?:sm|md|lg|xl|2xl|inner))?$/;
        const ROUNDED = /^rounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|es|ee))?$/;
        const MOTION = /^(?:duration|delay)-\d+$|^(?:duration|delay|ease)-\[(?!var\(--)[^\]]+\]$/;
        const FONT = /^font-\[(?!var\(--)[^\]]+\]$/;
        return stringVisitors((node, text) => {
          if (isDocsProse(node)) return;
          for (const token of classTokens(text)) {
            let id = null;
            if (PALETTE.test(token)) id = "palette";
            else if (SHADOW.test(token)) id = "shadow";
            else if (ROUNDED.test(token)) id = "rounded";
            else if (MOTION.test(token)) id = "motion";
            else if (FONT.test(token)) id = "font";
            if (id) context.report({ node, messageId: id, data: { value: token } });
          }
        });
      },
    },

    "no-slow-motion": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Interactive states animate in at most --duration-normal (200ms). --duration-slow and --duration-slower are for overlays entering or leaving, in allowlisted files. Decision 0025.",
        },
        schema: [
          {
            type: "object",
            properties: { overlayFiles: { type: "array", items: { type: "string" } } },
            additionalProperties: false,
          },
        ],
        messages: {
          slow:
            "'{{name}}' is longer than the 200ms cap for interactive states. Use --duration-fast or --duration-normal. An overlay entering or leaving may use --duration-slow: add the file to overlayFiles in eslint.config.mjs (docs/decisions/0025).",
          raw: "'{{value}}' is a raw duration. Use a --duration-* token (docs/decisions/0025).",
        },
      },
      create(context) {
        const overlayFiles = (context.options[0] && context.options[0].overlayFiles) || [];
        const filename = (context.filename || context.getFilename()).split(path.sep).join("/");
        const isOverlay = overlayFiles.some((f) => filename.endsWith(f));
        const check = (node, text) => {
          for (const m of matchAll(/--duration-(slow|slower)\b/, text)) {
            if (m[1] === "slow" && isOverlay) continue;
            context.report({ node, messageId: "slow", data: { name: m[0] } });
          }
          for (const m of matchAll(/(?:^|[\s(,:])(\d*\.?\d+m?s)(?=[\s),;]|$)/, text)) {
            if (/^0m?s$/.test(m[1])) continue;
            context.report({ node, messageId: "raw", data: { value: m[1] } });
          }
        };
        return {
          ...stringVisitors(check),
          // Style objects: `{ transitionDuration: 300 }` or `{ animationDelay: "1s" }`.
          Property(node) {
            const key = node.key && (node.key.name || node.key.value);
            if (typeof key !== "string" || !/^(transition|animation)/.test(key)) return;
            if (node.value.type === "Literal" && typeof node.value.value === "number" && node.value.value !== 0) {
              context.report({ node: node.value, messageId: "raw", data: { value: String(node.value.value) } });
            }
          },
        };
      },
    },

    "no-style-literals": {
      meta: {
        type: "problem",
        docs: {
          description:
            "No raw sizes, colours, durations or fonts in inline style objects. Class rules cannot see style={{}}; values there go through var(--token) too.",
        },
        schema: [],
        messages: {
          number:
            "Inline style '{{key}}: {{value}}' hardcodes a number. Use a class, or var(--token) in the style value.",
          string:
            "Inline style '{{key}}: \"{{value}}\"' hardcodes a raw value. Use var(--token), or compute it from a token.",
        },
      },
      create(context) {
        // Unitless properties where a number is the honest value, not a hardcoded size.
        const UNITLESS = new Set(["flex", "flexGrow", "flexShrink", "order", "gridRow", "gridColumn", "aspectRatio", "columnCount"]);
        const RAW_STRING = /\d(?:px|rem|em|ms|s)\b|#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(|\b(?:Arial|Helvetica|Inter|sans-serif|serif|system-ui)\b/;

        function isStyleObject(obj) {
          const parent = obj.parent;
          return (
            parent &&
            parent.type === "JSXExpressionContainer" &&
            parent.parent &&
            parent.parent.type === "JSXAttribute" &&
            parent.parent.name &&
            parent.parent.name.name === "style"
          );
        }

        return {
          ObjectExpression(obj) {
            if (!isStyleObject(obj)) return;
            for (const prop of obj.properties) {
              if (prop.type !== "Property") continue;
              const key = prop.key && (prop.key.name || prop.key.value);
              if (typeof key !== "string" || key.startsWith("--")) continue;
              const v = prop.value;
              if (v.type === "Literal" && typeof v.value === "number") {
                if (v.value === 0 || UNITLESS.has(key)) continue;
                context.report({ node: v, messageId: "number", data: { key, value: String(v.value) } });
              } else if (v.type === "Literal" && typeof v.value === "string" && RAW_STRING.test(v.value)) {
                context.report({ node: v, messageId: "string", data: { key, value: v.value } });
              }
            }
          },
        };
      },
    },

    "no-deep-import": {
      meta: {
        type: "problem",
        docs: { description: "Import other packages through their public barrel, never from their src/ internals." },
        schema: [],
        messages: {
          deep: "'{{name}}' reaches into another package's internals. Import from the package barrel ('@scorp-ds/components', '@scorp-ds/tokens').",
        },
      },
      create(context) {
        // Public entry points other than the barrel, from each package.json `exports`.
        const PUBLIC_SUBPATHS = new Set([
          "@scorp-ds/tokens/tailwind.preset",
          "@scorp-ds/tokens/styles/tokens.css",
          "@scorp-ds/components/styles",
        ]);
        const check = (node, name) => {
          if (typeof name !== "string" || !name.startsWith("@scorp-ds/")) return;
          const parts = name.split("/");
          if (parts.length <= 2 || PUBLIC_SUBPATHS.has(name)) return;
          context.report({ node, messageId: "deep", data: { name } });
        };
        return {
          ImportDeclaration: (node) => check(node, node.source.value),
          ImportExpression: (node) => node.source.type === "Literal" && check(node, node.source.value),
          ExportNamedDeclaration: (node) => node.source && check(node, node.source.value),
          ExportAllDeclaration: (node) => node.source && check(node, node.source.value),
        };
      },
    },

    "prop-jsdoc": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Every member of an exported *Props interface or type has a JSDoc comment. JSDoc on the prop is what autodocs, the IDE and api-surface.json read; @param on the function reaches none of them.",
        },
        schema: [],
        messages: {
          missing:
            "Prop '{{name}}' of {{owner}} has no JSDoc comment. Say how to use it (what it changes, when to set it), not what it is called.",
          empty: "Prop '{{name}}' of {{owner}} has an empty JSDoc comment.",
        },
      },
      create(context) {
        const source = context.sourceCode || context.getSourceCode();
        const jsdocBefore = (node) =>
          source.getCommentsBefore(node).filter((c) => c.type === "Block" && c.value.startsWith("*")).pop();

        function checkMembers(members, owner) {
          for (const m of members) {
            if (m.type !== "TSPropertySignature" && m.type !== "TSMethodSignature") continue;
            const name = m.key && (m.key.name ?? m.key.value);
            if (typeof name !== "string") continue;
            // `as?: never` in a discriminated union is a guard, not a prop anyone sets.
            if (m.typeAnnotation && m.typeAnnotation.typeAnnotation.type === "TSNeverKeyword") continue;
            const doc = jsdocBefore(m);
            if (!doc) context.report({ node: m.key, messageId: "missing", data: { name, owner } });
            else if (!doc.value.replace(/^\*/, "").replace(/[\s*]/g, "")) {
              context.report({ node: m.key, messageId: "empty", data: { name, owner } });
            }
          }
        }

        /** Walks a type: object literals are checked, unions and intersections are entered. */
        function checkType(type, owner) {
          if (!type) return;
          if (type.type === "TSTypeLiteral") checkMembers(type.members, owner);
          else if (type.type === "TSUnionType" || type.type === "TSIntersectionType") type.types.forEach((t) => checkType(t, owner));
        }

        return {
          ExportNamedDeclaration(node) {
            const decl = node.declaration;
            if (!decl || !decl.id || !/Props$/.test(decl.id.name)) return;
            if (decl.type === "TSInterfaceDeclaration") checkMembers(decl.body.body, decl.id.name);
            else if (decl.type === "TSTypeAliasDeclaration") checkType(decl.typeAnnotation, decl.id.name);
          },
        };
      },
    },

    "no-off-scale-spacing": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Padding, margin, gap and space utilities use a step from global.spacing (whole or half). Tailwind's own extra steps (7, 9, 11, 14, 28, …) are not tokens. Decision 0027.",
        },
        schema: [
          {
            type: "object",
            properties: { allow: { type: "array", items: { type: "string" } } },
            additionalProperties: false,
          },
        ],
        messages: {
          offScale:
            "'{{value}}' uses spacing step {{step}}, which is not in global.spacing ({{scale}}). Use a step on the scale, or add it to the rule's allow list in eslint.config.mjs with a reason (docs/decisions/0027).",
        },
      },
      create(context) {
        const allow = new Set((context.options[0] && context.options[0].allow) || []);
        const scale = spacingScale();
        const SPACING = /^(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?)$/;
        return stringVisitors((node, text) => {
          if (isDocsProse(node)) return;
          for (const token of classTokens(text)) {
            const m = SPACING.exec(token);
            if (!m || scale.has(m[1]) || allow.has(token)) continue;
            context.report({ node, messageId: "offScale", data: { value: token, step: m[1], scale: [...scale].join(", ") } });
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
          ImportExpression: (node) => node.source.type === "Literal" && check(node, node.source.value),
          ExportNamedDeclaration: (node) => node.source && check(node, node.source.value),
          ExportAllDeclaration: (node) => node.source && check(node, node.source.value),
        };
      },
    },

    "story-skip-visual-reason": {
      meta: {
        type: "problem",
        docs: {
          description:
            "A `skip-visual` tag removes a story from visual regression, so it must say why in a comment (decision 0012). Usually a timer or randomness.",
        },
        schema: [],
        messages: {
          reason:
            "'skip-visual' needs a comment directly above or beside it saying why this story cannot render a stable frame (docs/decisions/0012). It is not a fix for a red visual run.",
        },
      },
      create(context) {
        const source = context.sourceCode || context.getSourceCode();
        return {
          Literal(node) {
            if (node.value !== "skip-visual") return;
            // The tags property: `tags: ['skip-visual']`. Look for a comment on it or the array.
            const array = node.parent && node.parent.type === "ArrayExpression" ? node.parent : null;
            const prop = array && array.parent && array.parent.type === "Property" ? array.parent : null;
            const anchors = [node, array, prop].filter(Boolean);
            const hasComment = anchors.some(
              (n) => source.getCommentsBefore(n).length > 0 || source.getCommentsAfter(n).length > 0
            );
            if (!hasComment) context.report({ node, messageId: "reason" });
          },
        };
      },
    },

    "story-interaction-needs-play": {
      meta: {
        type: "problem",
        docs: {
          description:
            "A story named for a state no prop can set (focus, hover, press, drag) must drive itself there with a play function, or visual regression captures the resting state (decision 0012).",
        },
        schema: [],
        messages: {
          play:
            "Story '{{name}}' is named for an interaction state but has no `play` function, so its frame shows the resting state. Drive it there (focus: `await userEvent.tab()`), or rename it (docs/decisions/0012).",
        },
      },
      create(context) {
        const STATE = /(?:Focus|Focused|Hover|Hovered|Pressed|Dragging)(?:[A-Z]|$)/;
        return {
          ExportNamedDeclaration(node) {
            const decl = node.declaration;
            if (!decl || decl.type !== "VariableDeclaration") return;
            for (const d of decl.declarations) {
              if (!d.id || d.id.type !== "Identifier" || !STATE.test(d.id.name)) continue;
              const init = d.init && (d.init.type === "TSSatisfiesExpression" || d.init.type === "TSAsExpression") ? d.init.expression : d.init;
              if (!init || init.type !== "ObjectExpression") continue;
              // A play function inherited through a spread (`...Primary`) does not count:
              // the story that is about the state should say so itself.
              const hasPlay = init.properties.some(
                (p) => p.type === "Property" && p.key && (p.key.name || p.key.value) === "play"
              );
              if (!hasPlay) context.report({ node: d.id, messageId: "play", data: { name: d.id.name } });
            }
          },
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
          // An empty `/** */` is not documentation.
          return comments.some((c) => c.type === "Block" && c.value.startsWith("*") && c.value.replace(/[\s*]/g, "") !== "");
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
