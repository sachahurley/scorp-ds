import "@testing-library/jest-dom/vitest";

// jsdom has no scrollIntoView. Stub it so menus that keep the highlighted
// row in view (Dropdown, Select) can render under test.
if (typeof Element !== "undefined" && typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom has no matchMedia. Stub it (never matching) so components that read
// media queries render in tests; override per test to simulate a match.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
