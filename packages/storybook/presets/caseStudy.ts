/**
 * caseStudy preset — the canonical case-study template content, ported from
 * the portfolio's `case-study-template` project. The Screens story and the
 * portfolio share this one configuration so the demo page never forks.
 */

import type { CaseStudyBlock } from '@scorp-ds/components';

export const caseStudyTemplateBlocks: CaseStudyBlock[] = [
  {
    type: 'meta',
    items: [
      { label: 'Role', value: 'Product Designer' },
      { label: 'Timeline', value: 'Aug to Sep 2026' },
      { label: 'Team', value: '3 designers' },
      { label: 'Skills', value: 'Strategy, prototyping' },
    ],
  },
  {
    type: 'headline',
    kicker: 'overview',
    title: 'What should the first device in this space look like?',
    text:
      'Placeholder intro: two or three sentences framing the project, who it was for, and the question it set out to answer. This block is a headline with an optional kicker and intro text.',
  },
  {
    type: 'callouts',
    items: [
      { title: 'Product strategy', text: 'Placeholder blurb for the first pillar of the approach.' },
      { title: 'Prototyping & testing', text: 'Placeholder blurb for the second pillar.' },
      { title: 'Iterating with feedback', text: 'Placeholder blurb for the third pillar.' },
    ],
  },
  {
    type: 'headline',
    kicker: 'the problem',
    title: 'The stack everyone builds on belongs to someone else.',
    text:
      'Placeholder problem statement: what was broken, the constraints in play, and why it mattered enough to work on.',
  },
  { type: 'image', aspect: '21 / 9', caption: 'Wide diagram placeholder (21:9, breaks the column)', width: 'wide' },
  {
    type: 'headline',
    kicker: 'the opportunity',
    title: 'Memory as the competitive advantage.',
  },
  {
    type: 'callouts',
    items: [
      { title: 'Independence', text: 'Placeholder benefit blurb one.' },
      { title: 'Ecosystem lock-in', text: 'Placeholder benefit blurb two.' },
      { title: 'New input modalities', text: 'Placeholder benefit blurb three.' },
    ],
  },
  {
    type: 'headline',
    kicker: 'the solution',
    title: 'Meet the product.',
    text: 'Placeholder solution description: name the thing and say what it does in one breath.',
  },
  { type: 'image', caption: 'Hero product image placeholder (16:9, full page margins)', width: 'full' },
  {
    type: 'headline',
    kicker: 'core flows',
    title: 'Six moments the product has to nail.',
  },
  {
    type: 'list',
    items: [
      { title: 'Capture', text: 'Placeholder flow description: the trigger, the action, the payoff.' },
      { title: 'Recall', text: 'Placeholder flow description for the second scenario.' },
      { title: 'Handoff', text: 'Placeholder flow description for the third scenario.' },
      { title: 'Review', text: 'Placeholder flow description for the fourth scenario.' },
    ],
  },
  {
    type: 'headline',
    kicker: 'research',
    title: 'What the field already taught us.',
    text: 'Placeholder research summary: interviews, teardown notes, comparative scans.',
  },
  { type: 'image', caption: 'Research documentation placeholder (16:9)' },
  {
    type: 'headline',
    kicker: 'form factors',
    title: 'Three directions, one bet.',
    text: 'Placeholder exploration text: the shapes considered and how the field narrowed.',
  },
  {
    type: 'imagePair',
    captions: ['Direction A placeholder (4:3)', 'Direction B placeholder (4:3)'],
  },
  {
    type: 'quote',
    text: 'How do you constrain the experience so the hardware never has to apologise for itself?',
  },
  {
    type: 'headline',
    kicker: 'key insights',
    title: 'What testing kept saying.',
  },
  {
    type: 'insights',
    items: [
      { title: 'People trust what they can see', text: 'Placeholder insight text: the observation, then the implication for the design.' },
      { title: 'Defaults do the heavy lifting', text: 'Placeholder insight text for the second numbered finding.' },
    ],
  },
  {
    type: 'quote',
    text: 'Placeholder testimonial: one sentence a real participant or teammate actually said.',
    name: 'Firstname Lastname',
    role: 'Research participant',
  },
  {
    type: 'headline',
    kicker: 'design decisions',
    title: 'Where the insights landed.',
    text: 'Placeholder synthesis: the system-level decisions the insights forced.',
  },
  { type: 'image', aspect: '21 / 9', caption: 'Systems diagram placeholder (21:9)' },
  {
    type: 'headline',
    kicker: 'reflection',
    title: 'What I would carry forward.',
  },
  {
    type: 'list',
    items: [
      { title: 'Constraints are the brief', text: 'Placeholder learning: one honest sentence about what this project taught.' },
      { title: 'Prototype the risky part first', text: 'Placeholder learning: a second takeaway written the same way.' },
    ],
  },
];
