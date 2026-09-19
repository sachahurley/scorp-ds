import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyBlocks } from '@scorp-ds/components';

import { caseStudyTemplateBlocks } from '../../presets/caseStudy';

/**
 * Screens / CaseStudyTemplate
 *
 * The portfolio's full case-study demo page rendered end-to-end from the
 * shared preset (Pattern A: the story is a thin shell; all content lives in
 * `presets/caseStudy.ts`). Exercises every block type in sequence, including
 * the wide/full figure breakouts against an inline-size container.
 */
const meta: Meta = {
  title: 'Screens/CaseStudyTemplate',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const CaseStudyTemplate: Story = {
  name: 'Case study template',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] px-6 py-16 [container-type:inline-size]">
      <div className="mx-auto max-w-2xl">
        <CaseStudyBlocks blocks={caseStudyTemplateBlocks} />
      </div>
    </div>
  ),
};
