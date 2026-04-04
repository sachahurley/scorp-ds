const path = require("path");

/** Tailwind for Storybook: scan stories + component sources for class names. */
module.exports = {
  presets: [require("@scorp-ds/tokens/tailwind.preset")],
  content: [
    path.join(__dirname, "stories/**/*.{ts,tsx,mdx}"),
    path.join(__dirname, "presets/**/*.{ts,tsx}"),
    path.join(__dirname, "../components/src/**/*.{ts,tsx}"),
  ],
  darkMode: "class",
};
