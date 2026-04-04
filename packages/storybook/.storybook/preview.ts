import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../styles/global.css';

/**
 * Scorp DS Storybook Preview Configuration
 *
 * Viewport presets cover three environments:
 * - Mobile (native app conventions: 375px, 390px, 430px)
 * - Mobile web (browser chrome, smaller safe area: 375px @ 667px)
 * - Tablet (768px, 1024px)
 * - Desktop web (1280px, 1440px, 1920px)
 */

const SCORP_VIEWPORTS = {
  // Mobile — native app dimensions (no browser chrome)
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
  // Mobile web — browser chrome accounts for ~80px
  mobileWeb: {
    name: 'Mobile Web (375)',
    styles: { width: '375px', height: '667px' },
    type: 'mobile' as const,
  },
  // Tablet
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
  // Desktop web
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
      // Disable backgrounds addon — Scorp DS manages its own theming via ThemeProvider
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
