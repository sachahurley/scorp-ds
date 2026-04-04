const path = require("path");

/** Tailwind for @scorp-ds/components dist/styles.css build */
module.exports = {
  presets: [require("@scorp-ds/tokens/tailwind.preset")],
  content: [path.join(__dirname, "src/**/*.{ts,tsx}")],
  darkMode: "class",
};
