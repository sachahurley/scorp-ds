import type { Meta, StoryObj } from '@storybook/react';
import { ListRow } from '@scorp-ds/components';

/**
 * Components / Display / ListRow
 *
 * The list/navigation tier of the container system: a plate row whose clip is
 * invisible until hover fills it. Don't use for framed panels (Card) or
 * tabular data (Table).
 *
 * Accessibility: renders a real `<a>` or `<button>` when interactive; focus
 * is an inset ring (the plate clip swallows outside outlines).
 */
const meta: Meta<typeof ListRow> = {
  title: 'Components/Display/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof ListRow>;

export const Default: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <ListRow
        href="#"
        meta="2026 · case study"
        title="Scorpion UI"
        titleSuffix={<span aria-hidden="true">↗</span>}
        description="A design system with a sting"
      />
      <ListRow
        onClick={() => {}}
        meta="2026 · lab"
        title="Tile atlas"
        description="Browse the Urizen 1-bit sprite sheet"
      />
      <ListRow meta="2026 · note" title="Display-only row" description="No link, no accent title" />
    </div>
  ),
};

/**
 * Selected: the row holds the hover state (surface.muted fill + accent
 * title) — the SideNavigation pattern's "fill + color, never color alone,
 * never weight". Nav consumers pair it with aria-current="page".
 */
export const Selected: Story = {
  render: () => (
    <nav aria-label="Demo" className="flex max-w-xl flex-col gap-1">
      <ListRow href="#" title="Home" />
      <ListRow href="#" title="Notes" selected aria-current="page" />
      <ListRow href="#" title="About" />
    </nav>
  ),
};

/**
 * Thumbnail slot: a fixed image beside the shrinking text column (long
 * titles ellipsize instead of pushing the image). thumbPosition="end"
 * mirrors it for the mobile right-thumb layout.
 */
export const WithThumbnail: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-1">
      <ListRow
        href="#"
        meta="2026"
        title="Sealed case study"
        description="A password-protected write-up with a cover image."
        thumb={<span className="block w-28 aspect-video bg-[var(--surface-muted)]" />}
      />
      <ListRow
        href="#"
        meta="2026"
        title="Right-hand thumb"
        description="The mobile variant keeps the image trailing."
        thumb={<span className="block w-16 aspect-[3/4] bg-[var(--surface-muted)]" />}
        thumbPosition="end"
      />
    </div>
  ),
};

/**
 * Router links: pass the router's Link via `as` and its props via
 * `asProps`, so client-side navigation keeps working. (Demoed with an
 * anchor stand-in; in an app: as={Link} asProps={{ to: '/projects/x' }}.)
 */
export const AsRouterLink: Story = {
  render: () => (
    <div className="w-96">
      <ListRow
        as="a"
        asProps={{ href: '#demo' }}
        meta="lab"
        title="Client-side navigation"
        description="Rendered through a custom link component."
      />
    </div>
  ),
};
