const path = require("path");

module.exports = {
  presets: [require("@scorp-ds/tokens/tailwind.preset")],
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "src/**/*.{ts,tsx}"),
    path.join(__dirname, "../components/src/**/*.{ts,tsx}"),
  ],
  darkMode: "class",
};
