/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Storybook URL for the “Open component library” link (e.g. production Chromatic URL). */
  readonly VITE_STORYBOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
