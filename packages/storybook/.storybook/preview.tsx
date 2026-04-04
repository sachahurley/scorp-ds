import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { ThemeProvider } from '@scorp-ds/components';
import '../styles/global.css';

/**
 * Scorp DS Storybook Preview Configuration
 *
 * ThemeProvider enables next-themes (class on html) for components like ThemeToggle
 * and dark-mode Tailwind variants across all stories.
 */
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
    styles: { width: '1024px', height: '768px' },
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

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="text-secondary-900 dark:text-secondary-50 antialiased">
          {/* One landmark per Storybook iframe — satisfies axe region / document-structure rules */}
          <main className="min-h-0 min-w-0" aria-label="Story preview">
            <Story />
          </main>
        </div>
      </ThemeProvider>
    ),
  ],
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
  },
};

export default preview;
