import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyBlocks, type CaseStudyBlock } from '@scorp-ds/components';

/**
 * Patterns / CaseStudyBlocks
 *
 * The long-form section library for narrative pages: author a
 * `CaseStudyBlock[]` array and one renderer draws every section. Upstreamed
 * from the portfolio's case-study template. Don't use for app UI — these
 * are editorial blocks.
 *
 * Composed of: Avatar (quote attribution) + plate/hatch/accent tokens.
 */
const meta: Meta<typeof CaseStudyBlocks> = {
  title: 'Patterns/CaseStudyBlocks',
  component: CaseStudyBlocks,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CaseStudyBlocks>;

const demo = (blocks: CaseStudyBlock[]) => (
  <div className="mx-auto max-w-2xl [container-type:inline-size]">
    <CaseStudyBlocks blocks={blocks} />
  </div>
);

export const MetaGrid: Story = {
  render: () =>
    demo([
      {
        type: 'meta',
        items: [
          { label: 'Role', value: 'Product Designer' },
          { label: 'Timeline', value: 'Aug to Sep 2026' },
          { label: 'Team', value: '3 designers' },
          { label: 'Skills', value: 'Strategy, prototyping' },
        ],
      },
    ]),
};

export const Headline: Story = {
  render: () =>
    demo([
      {
        type: 'headline',
        kicker: 'overview',
        title: 'What should the first device in this space look like?',
        text: 'A headline block carries an optional kicker and an optional intro paragraph.',
      },
      { type: 'prose', text: 'Prose blocks are plain paragraphs riding the body text tokens.' },
    ]),
};

export const Figures: Story = {
  render: () =>
    demo([
      { type: 'image', caption: 'Placeholder figure (16:9) on the plate ring with the hatch texture' },
      { type: 'imagePair', captions: ['Direction A (4:3)', 'Direction B (4:3)'] },
    ]),
};

export const Callouts: Story = {
  render: () =>
    demo([
      {
        type: 'callouts',
        items: [
          { title: 'Product strategy', text: 'Bodies align via subgrid no matter how titles wrap.' },
          { title: 'Prototyping & testing', text: 'Second pillar blurb.' },
          { title: 'Iterating with feedback', text: 'Third pillar blurb.' },
        ],
      },
    ]),
};

export const Insights: Story = {
  render: () =>
    demo([
      {
        type: 'insights',
        items: [
          { title: 'People trust what they can see', text: 'Numbered findings carry accent numerals.' },
          { title: 'Defaults do the heavy lifting', text: 'The observation, then the implication.' },
        ],
      },
    ]),
};

export const Quote: Story = {
  render: () =>
    demo([
      { type: 'quote', text: 'A bare pull quote gets the accent glyph and larger type.' },
      {
        type: 'quote',
        text: 'With a name it grows an attribution row using the DS Avatar.',
        name: 'Firstname Lastname',
        role: 'Research participant',
      },
    ]),
};

export const DefinitionList: Story = {
  render: () =>
    demo([
      {
        type: 'list',
        items: [
          { title: 'Capture', text: 'The trigger, the action, the payoff.' },
          { title: 'Recall', text: 'Stacked titled blurbs for flows and learnings.' },
        ],
      },
    ]),
};
