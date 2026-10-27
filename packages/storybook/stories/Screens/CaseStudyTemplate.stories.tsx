import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyPage } from '@scorp-ds/components';

import { caseStudyTemplate, scorpionCaseStudy } from '../../presets/caseStudy';

/**
 * Screens / CaseStudyTemplate
 *
 * Whole case-study pages rendered end to end from the shared preset (the
 * story is a thin shell; all content lives in `presets/caseStudy.ts`). The
 * page sits in an inline-size container, so `wide` and `full` figures break
 * out at real size.
 *
 * - Case study template: placeholder copy using every block type.
 * - Scorp DS: the portfolio's real case study.
 */
const meta: Meta = {
  title: 'Screens/CaseStudyTemplate',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const page = (study: typeof caseStudyTemplate) => (
  <div className="min-h-screen bg-[var(--surface-page)] px-6 py-16 [container-type:inline-size]">
    <CaseStudyPage study={study} className="mx-auto max-w-2xl" />
  </div>
);

export const CaseStudyTemplate: Story = {
  name: 'Case study template',
  render: () => page(caseStudyTemplate),
};

export const ScorpDs: Story = {
  name: 'Scorp DS',
  render: () => page(scorpionCaseStudy),
};
