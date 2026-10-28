import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
  CaseStudyContent,
  CaseStudyHeader,
  CaseStudyPage,
  CaseStudySections,
  type CaseStudyContentBlock,
} from '@scorp-ds/components';

import { scorpionCaseStudy } from '../../presets/caseStudy';

/**
 * Patterns / CaseStudy
 *
 * Long-form narrative pages authored as data. `CaseStudyPage` takes a
 * structured `CaseStudy` (header fields, then ordered sections that can be
 * moved or hidden) and draws the whole page; `CaseStudyHeader`,
 * `CaseStudySections` and `CaseStudyContent` are the same parts on their own.
 * Each story below shows one part. The full page is `Screens/CaseStudy`.
 *
 * Don't use for app UI: these are editorial blocks.
 *
 * Composed of: Avatar (quote attribution) + plate/hatch/accent/rule tokens.
 */
const meta: Meta<typeof CaseStudyPage> = {
  title: 'Patterns/CaseStudy',
  component: CaseStudyPage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CaseStudyPage>;

/** A reading column inside an inline-size container, so `wide` breakouts
 *  have room to break out. */
const Column = ({ children }: { children: ReactNode }) => (
  <div className="px-6 [container-type:inline-size]">
    <div className="mx-auto max-w-2xl">{children}</div>
  </div>
);

const demo = (blocks: CaseStudyContentBlock[]) => (
  <Column>
    <CaseStudyContent blocks={blocks} />
  </Column>
);

/** Title (the page's h1 and its largest type), one-line summary, outcome
 *  figures hanging from a shared top line, and label | value meta rows. */
export const Header: Story = {
  render: () => (
    <Column>
      <CaseStudyHeader study={scorpionCaseStudy} />
    </Column>
  ),
};

/** Below `sm` the title and summary step down a size, outcomes go two up and
 *  meta drops to one label | value pair per row. */
export const HeaderMobile: Story = {
  name: 'Header: mobile',
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  render: () => (
    <Column>
      <CaseStudyHeader study={scorpionCaseStudy} />
    </Column>
  ),
};

/** Each section opens on a rule with its number and name beneath it, then the
 *  title and an optional intro. Numbers are counted, never authored. */
export const Sections: Story = {
  render: () => (
    <Column>
      <CaseStudySections sections={[scorpionCaseStudy.sections[1], scorpionCaseStudy.sections[4]]} />
    </Column>
  ),
};

/** Sections are an ordered array: move one by moving it, drop one with
 *  `hidden: true`. Here "tooling" is hidden, so "the problem" and "in
 *  production" number 01 and 02 with no gap. */
export const ReorderAndHide: Story = {
  name: 'Reorder and hide',
  render: () => (
    <Column>
      <CaseStudySections
        sections={[
          scorpionCaseStudy.sections[1],
          { ...scorpionCaseStudy.sections[4], hidden: true },
          { ...scorpionCaseStudy.sections[5], blocks: [] },
        ]}
      />
    </Column>
  ),
};

export const Prose: Story = {
  render: () =>
    demo([
      { type: 'prose', text: 'Prose blocks are plain paragraphs on the body text pair.' },
      { type: 'prose', text: 'They own their vertical margins, so consecutive paragraphs space themselves.' },
    ]),
};

/** Figures sit on the plate ring with the hatch until they have art. Captions
 *  carry a figure number, counted across the page in reading order. */
export const Figures: Story = {
  render: () =>
    demo([
      { type: 'image', caption: 'Placeholder figure (16:9) on the plate ring with the hatch texture' },
      { type: 'imagePair', captions: ['Direction A (4:3)', 'Direction B (4:3)'] },
    ]),
};

/**
 * An image pair below `sm` (640px): the two figures stack into one column, so a
 * side-by-side comparison becomes a sequence and each figure gets the full
 * measure. A second frame rather than a note, because the track count changes
 * and one frame shows one width.
 */
export const FiguresStacked: Story = {
  name: 'Figures: stacked',
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  render: () => demo([{ type: 'imagePair', captions: ['Direction A (4:3)', 'Direction B (4:3)'] }]),
};

// Inline specimen art, so the story has no network dependency in the
// test-runner. Real pages pass a URL.
const specimenArt = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">` +
      `<rect width="160" height="90" fill="dimgray"/>` +
      `<text x="80" y="49" fill="white" font-family="monospace" font-size="9" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

/** An `src` swaps the hatch for real artwork; ring, breakout and caption are
 *  unchanged. */
export const RealArtwork: Story = {
  render: () =>
    demo([
      {
        type: 'image',
        src: specimenArt('artwork'),
        caption: 'A figure given an src renders the image instead of the placeholder',
      },
      {
        type: 'imagePair',
        srcs: [specimenArt('A'), undefined],
        captions: ['Real artwork on the left', 'Placeholder on the right'],
      },
    ]),
};

/** Box-drawing diagrams stay live text: selectable, themed, and carrying an
 *  aria-label because the characters themselves read as noise. */
export const AsciiDiagram: Story = {
  render: () =>
    demo([
      {
        type: 'ascii',
        label: 'Package layering: tokens, then tui-art, then components, then storybook',
        caption: 'A tui-art frame rendered as text, not an image',
        text: [
          '┌────────────────────────────────┐',
          '│  storybook                     │',
          '├────────────────────────────────┤',
          '│  components                    │',
          '├────────────────────────────────┤',
          '│  tui-art          tokens       │',
          '└────────────────────────────────┘',
        ].join('\n'),
      },
    ]),
};

/** The escape hatch: the page passes live markup in, the library only
 *  supplies the frame. An unfilled slot falls back to the placeholder. */
export const Slots: Story = {
  render: () => (
    <Column>
      <CaseStudyContent
        slots={{
          swatches: (
            <div className="flex">
              {['bg-primary-300', 'bg-primary-500', 'bg-primary-700', 'bg-secondary-500'].map((c) => (
                <div key={c} className={`h-20 flex-1 ${c}`} />
              ))}
            </div>
          ),
        }}
        blocks={[
          { type: 'slot', name: 'swatches', caption: 'A filled slot renders whatever the page passes' },
          { type: 'slot', name: 'nothing-here', aspect: '21 / 9', caption: 'An empty slot keeps the placeholder' },
        ]}
      />
    </Column>
  ),
};

/** Steps, flows or principles: one connected tree, drawn with rules so the
 *  trunk and branches meet exactly. */
export const List: Story = {
  render: () => demo(scorpionCaseStudy.sections[2].blocks!.filter((b) => b.type === 'list')),
};

/** Findings: the loudest block, with large accent numerals and ruled rows. */
export const Insights: Story = {
  render: () =>
    demo([
      {
        type: 'insights',
        items: [
          { title: 'People trust what they can see', text: 'The observation, then the implication for the design.' },
          { title: 'Defaults do the heavy lifting', text: 'A second finding written the same way.' },
        ],
      },
    ]),
};

/** Pillars as cards. Three break out wide so each keeps a readable measure in
 *  a monospace face; two (or four) sit two up in the column. */
export const Callouts: Story = {
  render: () =>
    demo([
      ...scorpionCaseStudy.sections[5].blocks!.filter((b) => b.type === 'callouts'),
      {
        type: 'callouts',
        items: [
          { title: 'Independence', text: 'Two cards sit two up inside the column.' },
          { title: 'Ecosystem lock-in', text: 'No breakout needed at this count.' },
        ],
      },
    ]),
};

/** A testimonial hangs off an accent rule; a name adds the Avatar row. */
export const Quote: Story = {
  render: () =>
    demo([
      { type: 'quote', text: 'A bare quote is set large on the accent rule.' },
      {
        type: 'quote',
        text: 'With a name it grows an attribution row using the DS Avatar.',
        name: 'Firstname Lastname',
        role: 'Research participant',
      },
    ]),
};

/** The thesis or challenge, set large between rules and broken out wide. */
export const Statement: Story = {
  render: () =>
    demo([
      {
        type: 'statement',
        kicker: 'the challenge',
        text: 'How do you constrain the experience so the hardware never has to apologise for itself?',
      },
    ]),
};

/** Results as accent figures inside a section. Every figure hangs from the
 *  same top line however its label wraps. */
export const Outcomes: Story = {
  render: () =>
    demo([
      {
        type: 'outcomes',
        items: [
          { value: '3x', label: 'faster to first prototype' },
          { value: '40%', label: 'fewer review rounds before a release' },
          { value: '12', label: 'teams on the system' },
        ],
      },
    ]),
};
