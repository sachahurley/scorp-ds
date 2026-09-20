import type { ReactNode } from 'react';
import type { Decorator, Preview } from '@storybook/react';
import { DocsContainer, type DocsContainerProps } from '@storybook/blocks';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { ThemeProvider } from '@scorp-ds/components';
import '../styles/global.css';

declare global {
  interface Window {
    /** Set by test-runner `preVisit` so CI can force light/dark per Jest process. */
    __STORYBOOK_TEST_THEME__?: 'light' | 'dark';
  }
}

function resolveTheme(globalsTheme: unknown): 'light' | 'dark' {
  const w = typeof window !== 'undefined' ? window.__STORYBOOK_TEST_THEME__ : undefined;
  if (w === 'dark' || w === 'light') return w;
  // Dark is the default theme (DS five laws); light is the explicit opt-in.
  return globalsTheme === 'light' ? 'light' : 'dark';
}

/**
 * Use `context.globals` instead of `useGlobals()`. Preview hooks are unreliable when the same
 * decorator runs for Docs (inline stories + docs shell); `StoryContext` always carries `globals`.
 */
const withThemeToolbarAndLandmark: Decorator = (Story, context) => {
  const globalTheme = context.globals.theme;
  const toolbarTheme = globalTheme === 'light' ? 'light' : 'dark';
  const fromWindow =
    typeof window !== 'undefined' &&
    (window.__STORYBOOK_TEST_THEME__ === 'dark' || window.__STORYBOOK_TEST_THEME__ === 'light')
      ? window.__STORYBOOK_TEST_THEME__
      : undefined;
  const forcedTheme = fromWindow;

  return (
    <ThemeProvider
      key={forcedTheme ?? toolbarTheme}
      enableSystem={false}
      defaultTheme={toolbarTheme}
      forcedTheme={forcedTheme}
    >
      <div className="min-h-full bg-[var(--surface-page)] text-secondary-900 antialiased dark:text-secondary-50">
        <main className="min-h-0 min-w-0" aria-label="Story preview">
          <Story />
        </main>
      </div>
    </ThemeProvider>
  );
};

/**
 * Read toolbar theme for Docs without `useGlobals()` — preview hooks are only valid in decorators / story
 * functions, not in `parameters.docs.container`.
 */
function themeFromDocsContext(context: DocsContainerProps['context']): 'light' | 'dark' {
  try {
    const story = context.storyById();
    const storyContext = context.getStoryContext(story);
    const g = storyContext.globals as Record<string, unknown> | undefined;
    return resolveTheme(g?.theme);
  } catch {
    return resolveTheme(undefined);
  }
}

/** Autodocs page: wrap in `.dark` + page background so semantic tokens match the Theme toolbar / CI. */
function ThemedDocsContainer(props: DocsContainerProps & { children?: ReactNode }) {
  const resolved = themeFromDocsContext(props.context);
  return (
    <div
      className={
        resolved === 'dark'
          ? 'dark min-h-full bg-[var(--surface-page)] text-secondary-900 antialiased dark:text-secondary-50'
          : 'min-h-full bg-[var(--surface-page)] text-secondary-900 antialiased dark:text-secondary-50'
      }
    >
      <DocsContainer {...props} />
    </div>
  );
}

const SCORP_VIEWPORTS = {
  mobileSmall: {
    name: 'Mobile S (375)',
    styles: { width: '375px', height: '812px' },
    type: 'mobile' as const,
  },
  mobileMed: {
    name: 'Mobile M (390)',
    styles: { width: '390px', height: '844px' },
    type: 'mobile' as const,
  },
  mobileLarge: {
    name: 'Mobile L (430)',
    styles: { width: '430px', height: '932px' },
    type: 'mobile' as const,
  },
  mobileWeb: {
    name: 'Mobile Web (375)',
    styles: { width: '375px', height: '667px' },
    type: 'mobile' as const,
  },
  tabletPortrait: {
    name: 'Tablet Portrait (768)',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet' as const,
  },
  tabletLandscape: {
    name: 'Tablet Landscape (1024)',
    styles: { width: '1024px', height: '1024px' },
    type: 'tablet' as const,
  },
  desktopSm: {
    name: 'Desktop S (1280)',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop' as const,
  },
  desktopMd: {
    name: 'Desktop M (1440)',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop' as const,
  },
  desktopLg: {
    name: 'Desktop L (1920)',
    styles: { width: '1920px', height: '1080px' },
    type: 'desktop' as const,
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Light or dark preview (semantic tokens + Tailwind dark:)',
    defaultValue: 'dark',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [withThemeToolbarAndLandmark],
  parameters: {
    viewport: {
      viewports: {
        ...SCORP_VIEWPORTS,
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
      defaultViewport: 'desktopSm',
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    docs: {
      container: ThemedDocsContainer,
    },
  },
};

export default preview;
