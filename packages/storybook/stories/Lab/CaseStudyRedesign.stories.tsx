import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
  CaseStudyBlocks,
  CaseStudyContent,
  CaseStudyHeader,
  CaseStudyPage,
  CaseStudySections,
  type CaseStudySectionStyle,
} from '@scorp-ds/components';

import { caseStudyTemplateBlocks } from '../../presets/caseStudy';
import {
  caseStudyTemplateV2,
  scorpionBlocksV1,
  scorpionMetaV1,
  scorpionV2,
} from '../../presets/caseStudyV2';

/**
 * Lab / Case study redesign
 *
 * Review surface for `CaseStudyPage` (v2) against `CaseStudyBlocks` (v1):
 * every story sets the current block on the left and the proposed one on
 * the right, on the same content. Each side is its own inline-size
 * container, so wide and full breakouts are clamped to their half; the
 * "Proposed, full width" story shows the breakouts at real size.
 *
 * Below the lg breakpoint the two sides stack, current above proposed, so
 * every comparison also reads at phone width (pick a Mobile viewport).
 *
 * The v1 page header is not part of the system yet: the portfolio draws it
 * (`h1.page` at 16px plus the role line), so the left side of "Page header"
 * reproduces that markup.
 */
const meta: Meta = {
  title: 'Lab/Case study redesign',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

function Side({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 px-6 py-10 first:pt-0 lg:py-0 [container-type:inline-size]">
      <div className="mx-auto mb-10 flex max-w-2xl items-center gap-3 text-xs uppercase tracking-wider">
        <span className="text-[var(--accent)]">{label}</span>
        <span aria-hidden="true" className="flex-1 border-t-hairline border-[var(--surface-container-stroke)]" />
      </div>
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}

function Compare({ note, current, proposed }: { note: string; current: ReactNode; proposed: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-page)] py-12 font-mono">
      <p className="mx-auto mb-12 mt-0 max-w-5xl px-6 text-sm leading-relaxed text-secondary-700 dark:text-secondary-600">
        {note}
      </p>
      <div className="grid grid-cols-1 divide-y-hairline divide-[var(--surface-container-stroke)] lg:grid-cols-2 lg:divide-x-hairline lg:divide-y-0">
        <Side label="current">{current}</Side>
        <Side label="proposed">{proposed}</Side>
      </div>
    </div>
  );
}

/** The portfolio's current header markup: 16px h1, role line, then the meta block. */
function CurrentHeader({ title, role, metaItems }: { title: string; role: string; metaItems: typeof scorpionMetaV1 }) {
  return (
    <div className="font-mono">
      <h1 className="m-0 text-base text-[var(--text-primary)]">{title}</h1>
      <div className="mt-1 text-sm text-secondary-700 dark:text-secondary-600">{role}</div>
      <CaseStudyBlocks blocks={[{ type: 'meta', items: metaItems }]} />
    </div>
  );
}

export const PageHeader: Story = {
  name: 'Page header',
  render: () => (
    <Compare
      note="The title becomes the largest type on the page (it was smaller than every section title). The repeated role line goes; a one-line summary and big outcome figures take its place, and meta becomes label | value rows instead of four squeezed columns."
      current={<CurrentHeader title="Scorpion Design System" role="Designer & Builder" metaItems={scorpionMetaV1} />}
      proposed={<CaseStudyHeader study={scorpionV2} />}
    />
  ),
};

export const SectionHeader: Story = {
  name: 'Section header',
  render: () => (
    <Compare
      note="Each section opens on a numbered rule (counted automatically, so hiding or moving a section renumbers the rest). The title steps up from 20px to 24px."
      current={
        <CaseStudyBlocks
          blocks={[
            { type: 'headline', kicker: 'the problem', title: scorpionV2.sections[1].title, text: scorpionV2.sections[1].intro },
            { type: 'headline', kicker: 'tooling', title: scorpionV2.sections[4].title, text: scorpionV2.sections[4].intro },
          ]}
        />
      }
      proposed={<CaseStudySections sections={[scorpionV2.sections[1], scorpionV2.sections[4]]} />}
    />
  ),
};

export const List: Story = {
  name: 'List (steps, principles)',
  render: () => (
    <Compare
      note="Lists read as one connected set: a box-drawing tree whose trunk runs the height of each item, so long items no longer look like loose paragraphs."
      current={<CaseStudyBlocks blocks={scorpionBlocksV1.filter((b) => b.type === 'list').slice(0, 1)} />}
      proposed={<CaseStudyContent blocks={scorpionV2.sections[2].blocks!.filter((b) => b.type === 'list')} />}
    />
  ),
};

export const Insights: Story = {
  name: 'Insights (findings)',
  render: () => (
    <Compare
      note="Findings become the loudest block: 24px accent numerals, larger titles, and ruled rows."
      current={<CaseStudyBlocks blocks={caseStudyTemplateBlocks.filter((b) => b.type === 'insights')} />}
      proposed={<CaseStudyContent blocks={caseStudyTemplateV2.sections[7].blocks!.filter((b) => b.type === 'insights')} />}
    />
  ),
};

export const Callouts: Story = {
  name: 'Callouts (pillars)',
  render: () => (
    <Compare
      note="Pillars become cards. Three cards break out wide so each keeps a readable measure in a monospace face (in this half-width view the breakout is clamped; see 'Proposed, full width')."
      current={<CaseStudyBlocks blocks={scorpionBlocksV1.filter((b) => b.type === 'callouts')} />}
      proposed={<CaseStudyContent blocks={scorpionV2.sections[5].blocks!.filter((b) => b.type === 'callouts')} />}
    />
  ),
};

export const QuoteAndStatement: Story = {
  name: 'Quote and statement',
  render: () => (
    <Compare
      note="One quote style was doing two jobs. A testimonial now hangs off an accent rule; the challenge or thesis becomes a statement, set large between rules."
      current={<CaseStudyBlocks blocks={caseStudyTemplateBlocks.filter((b) => b.type === 'quote')} />}
      proposed={
        <CaseStudyContent
          blocks={[
            ...caseStudyTemplateV2.sections[6].blocks!.filter((b) => b.type === 'statement'),
            ...caseStudyTemplateV2.sections[7].blocks!.filter((b) => b.type === 'quote'),
          ]}
        />
      }
    />
  ),
};

export const Figures: Story = {
  name: 'Figures',
  render: () => (
    <Compare
      note="Figures keep their shape and gain a numbered caption, counted across the page in reading order."
      current={
        <CaseStudyBlocks
          blocks={[
            { type: 'image', caption: 'Research documentation placeholder (16:9)' },
            { type: 'imagePair', captions: ['Direction A placeholder (4:3)', 'Direction B placeholder (4:3)'] },
          ]}
        />
      }
      proposed={
        <CaseStudyContent
          blocks={[
            { type: 'image', caption: 'Research documentation placeholder (16:9)' },
            { type: 'imagePair', captions: ['Direction A placeholder (4:3)', 'Direction B placeholder (4:3)'] },
          ]}
        />
      }
    />
  ),
};

export const FullPageScorpion: Story = {
  name: 'Full page: Scorp DS',
  render: () => (
    <Compare
      note="The real case study, same words on both sides. Live slots and the Storybook image are empty here, so they show the hatch."
      current={
        <>
          <CurrentHeader title="Scorpion Design System" role="Designer & Builder" metaItems={[]} />
          <CaseStudyBlocks blocks={scorpionBlocksV1} />
        </>
      }
      proposed={<CaseStudyPage study={scorpionV2} />}
    />
  ),
};

export const FullPageTemplate: Story = {
  name: 'Full page: template',
  render: () => (
    <Compare
      note="The placeholder template, every block type in use."
      current={
        <>
          <CurrentHeader title="Case Study Template" role="Template" metaItems={[]} />
          <CaseStudyBlocks blocks={caseStudyTemplateBlocks} />
        </>
      }
      proposed={<CaseStudyPage study={caseStudyTemplateV2} />}
    />
  ),
};

const SECTION_STYLES: { style: CaseStudySectionStyle; name: string; note: string }[] = [
  { style: 'rule', name: 'A. Rule', note: 'Number, name, then a rule to the edge. The current proposal.' },
  { style: 'leadIn', name: 'B. Lead-in rule', note: 'A short rule before the number, like a terminal window title.' },
  { style: 'count', name: 'C. Count', note: 'Rule above; name left, position right, so you know how far in you are.' },
  { style: 'bracket', name: 'D. Bracket', note: 'A terminal tag. No rule; the quietest option.' },
  { style: 'numeral', name: 'E. Numeral', note: 'A large accent number over the name. Editorial, no rule.' },
  { style: 'path', name: 'F. Path', note: 'The section as a file path. No rule.' },
];

/** Two consecutive sections, so each style is seen with a section break. */
const PAIR = [scorpionV2.sections[1], scorpionV2.sections[4]];

function SectionStyles() {
  return (
    <div className="min-h-screen bg-[var(--surface-page)] px-6 py-12 font-mono">
      <p className="mx-auto mb-12 mt-0 max-w-5xl text-sm leading-relaxed text-secondary-700 dark:text-secondary-600">
        Six ways to label a section, each shown on two consecutive sections. Only the label changes; the title
        and intro are the same in all six. To see one across a whole page, open "Proposed, full width" and pick a
        sectionStyle in Controls.
      </p>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-20 lg:grid-cols-2">
        {SECTION_STYLES.map(({ style, name, note }) => (
          <div key={style} className="min-w-0 [container-type:inline-size]">
            <div className="mb-1 text-sm text-[var(--accent)]">{name}</div>
            <p className="mb-10 mt-0 text-xs leading-relaxed text-secondary-700 dark:text-secondary-600">{note}</p>
            <CaseStudySections sections={PAIR} sectionStyle={style} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const SectionHeaderOptions: Story = {
  name: 'Section header options',
  render: () => <SectionStyles />,
};

export const SectionHeaderOptionsMobile: Story = {
  name: 'Section header options, mobile',
  parameters: { viewport: { defaultViewport: 'mobileMed' } },
  render: () => <SectionStyles />,
};

type PageArgs = { sectionStyle: CaseStudySectionStyle };

const fullPage = ({ sectionStyle }: PageArgs) => (
  <div className="min-h-screen bg-[var(--surface-page)] px-6 py-16 [container-type:inline-size]">
    <CaseStudyPage study={scorpionV2} sectionStyle={sectionStyle} className="mx-auto max-w-2xl" />
  </div>
);

const pageControls = {
  args: { sectionStyle: 'rule' as CaseStudySectionStyle },
  argTypes: {
    sectionStyle: {
      control: 'select',
      options: SECTION_STYLES.map((s) => s.style),
    },
  },
};

export const ProposedFullWidth: StoryObj<PageArgs> = {
  name: 'Proposed, full width',
  ...pageControls,
  render: fullPage,
};

export const ProposedMobile: StoryObj<PageArgs> = {
  name: 'Proposed, mobile',
  ...pageControls,
  parameters: { viewport: { defaultViewport: 'mobileMed' } },
  render: fullPage,
};

export const ReorderAndHide: Story = {
  name: 'Reorder and hide',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] px-6 py-16 [container-type:inline-size]">
      <p className="mx-auto mb-12 mt-0 max-w-2xl font-mono text-sm leading-relaxed text-secondary-700 dark:text-secondary-600">
        The same Scorp DS page with "in production" moved up to second and "tooling" and "documentation" set to
        hidden: true. Section numbers close up on their own.
      </p>
      <CaseStudyPage
        className="mx-auto max-w-2xl"
        study={{
          ...scorpionV2,
          sections: [
            scorpionV2.sections[0],
            scorpionV2.sections[5],
            ...scorpionV2.sections
              .slice(1, 5)
              .map((s) => (s.kicker === 'tooling' || s.kicker === 'documentation' ? { ...s, hidden: true } : s)),
            scorpionV2.sections[6],
          ],
        }}
      />
    </div>
  ),
};
