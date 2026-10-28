/**
 * caseStudy preset: the canonical case-study pages, shared by the
 * Patterns/CaseStudy and Screens stories so the demo content never forks.
 *
 * - `caseStudyTemplate`: placeholder copy exercising every block type, in
 *   the order a typical case study uses them.
 * - `scorpionCaseStudy`: the portfolio's real Scorp DS case study. Its live
 *   slots and dithered Storybook image are left empty here, so they render
 *   the hatch placeholder.
 */

import type { CaseStudy } from '@scorp-ds/components';

export const caseStudyTemplate: CaseStudy = {
  title: 'Case Study Template',
  summary:
    'Placeholder summary: one sentence on what this was and what it changed, so a reader who stops here still leaves with the point.',
  outcomes: [
    { value: '3x', label: 'placeholder result' },
    { value: '40%', label: 'placeholder result' },
    { value: '12', label: 'placeholder result' },
  ],
  meta: [
    { label: 'Role', value: 'Product Designer' },
    { label: 'Timeline', value: 'Aug to Sep 2026' },
    { label: 'Team', value: '3 designers' },
    { label: 'Skills', value: 'Strategy, prototyping' },
  ],
  sections: [
    {
      kicker: 'overview',
      title: 'What should the first device in this space look like?',
      intro:
        'Placeholder intro: two or three sentences framing the project, who it was for, and the question it set out to answer.',
      blocks: [
        {
          type: 'callouts',
          items: [
            { title: 'Product strategy', text: 'Placeholder blurb for the first pillar of the approach.' },
            { title: 'Prototyping & testing', text: 'Placeholder blurb for the second pillar.' },
            { title: 'Iterating with feedback', text: 'Placeholder blurb for the third pillar.' },
          ],
        },
      ],
    },
    {
      kicker: 'the problem',
      title: 'The stack everyone builds on belongs to someone else.',
      intro:
        'Placeholder problem statement: what was broken, the constraints in play, and why it mattered enough to work on.',
      blocks: [
        { type: 'image', aspect: '21 / 9', caption: 'Wide diagram placeholder (21:9, breaks the column)', width: 'wide' },
      ],
    },
    {
      kicker: 'the opportunity',
      title: 'Memory as the competitive advantage.',
      blocks: [
        {
          type: 'callouts',
          items: [
            { title: 'Independence', text: 'Placeholder benefit blurb one.' },
            { title: 'Ecosystem lock-in', text: 'Placeholder benefit blurb two.' },
            { title: 'New input modalities', text: 'Placeholder benefit blurb three.' },
          ],
        },
      ],
    },
    {
      kicker: 'the solution',
      title: 'Meet the product.',
      intro: 'Placeholder solution description: name the thing and say what it does in one breath.',
      blocks: [{ type: 'image', caption: 'Hero product image placeholder (16:9, full page margins)', width: 'full' }],
    },
    {
      kicker: 'core flows',
      title: 'Six moments the product has to nail.',
      blocks: [
        {
          type: 'list',
          items: [
            { title: 'Capture', text: 'Placeholder flow description: the trigger, the action, the payoff.' },
            { title: 'Recall', text: 'Placeholder flow description for the second scenario.' },
            { title: 'Handoff', text: 'Placeholder flow description for the third scenario.' },
            { title: 'Review', text: 'Placeholder flow description for the fourth scenario.' },
          ],
        },
      ],
    },
    {
      kicker: 'research',
      title: 'What the field already taught us.',
      intro: 'Placeholder research summary: interviews, teardown notes, comparative scans.',
      blocks: [{ type: 'image', caption: 'Research documentation placeholder (16:9)' }],
    },
    {
      kicker: 'form factors',
      title: 'Three directions, one bet.',
      intro: 'Placeholder exploration text: the shapes considered and how the field narrowed.',
      blocks: [
        { type: 'imagePair', captions: ['Direction A placeholder (4:3)', 'Direction B placeholder (4:3)'] },
        {
          type: 'statement',
          kicker: 'the challenge',
          text: 'How do you constrain the experience so the hardware never has to apologise for itself?',
        },
      ],
    },
    {
      kicker: 'key insights',
      title: 'What testing kept saying.',
      blocks: [
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
      ],
    },
    {
      kicker: 'design decisions',
      title: 'Where the insights landed.',
      intro: 'Placeholder synthesis: the system-level decisions the insights forced.',
      blocks: [{ type: 'image', aspect: '21 / 9', caption: 'Systems diagram placeholder (21:9)' }],
    },
    {
      kicker: 'reflection',
      title: 'What I would carry forward.',
      blocks: [
        {
          type: 'list',
          items: [
            { title: 'Constraints are the brief', text: 'Placeholder learning: one honest sentence about what this project taught.' },
            { title: 'Prototype the risky part first', text: 'Placeholder learning: a second takeaway written the same way.' },
          ],
        },
      ],
    },
  ],
};

// ── Scorp DS, the portfolio's real case study ─────────────────────────────

const S = {
  overviewTitle: 'A terminal-flavoured design system I build everything else on.',
  overviewText:
    'Scorp DS is a token-based React library with a TUI look: sharp corners, one monospace face, a warm amber and sepia palette, and interaction states that never run past 200ms. This site is built out of it.',
  interfaceCaption: 'Not a screenshot: Window, Table, Badge, Meter and StatusLine, live on this page',
  problemTitle: 'It took three rewrites to get the foundation right.',
  problemText:
    'Scorpion UI shipped in 2025 as a folder of components with hardcoded values. v2 introduced tokens but left them tangled with the showcase site that displayed them. Either way, starting a new project meant copying components across and re-deciding colour and spacing by hand.',
  paletteCaption: 'The two scales a component is allowed to name, at every step that exists',
  principles: [
    {
      title: 'One source of truth',
      text: 'Every colour, size and duration lives in a single tokens.json in W3C design token format. Components are not allowed raw values. A parser turns the file into CSS custom properties and a Tailwind preset, so consumers get the whole theme from one import.',
    },
    {
      title: 'Semantic aliasing',
      text: 'Components reference primary and secondary, never amber and sepia, even though they resolve to the same value. That one rule is what makes retheming possible: the unlockable colour themes on this site work by overriding those variables at runtime, with no component aware of it.',
    },
    {
      title: 'Packages that point one way',
      text: 'Tokens, then tui-art (box-drawing frames as plain strings, no React), then components, then Storybook. Dependencies only flow downhill, so the token layer can never accidentally import a button.',
    },
  ],
  asciiLabel:
    'The four packages in dependency order: storybook, components, tokens, tui-art. Every import points down the list, never back up.',
  asciiCaption: 'Drawn by the system’s own tui-art package, so the diagram is text, not a picture',
  ascii: [
    '┌────────────────────────────────────────────────────────────┐',
    '│scorp-ds  ·  package layering                               │',
    '├────────────────────────────────────────────────────────────┤',
    '│storybook     65 stories, axe in light and dark             │',
    '│components    43 components, zero raw values                │',
    '│tokens        378 tokens, one source of truth               │',
    '│tui-art       box frames as plain strings                   │',
    '│                                                            │',
    '│every import points down this list, never back up           │',
    '└────────────────────────────────────────────────────────────┘',
  ].join('\n'),
  docsTitle: 'Storybook is the contract, not a gallery.',
  docsText:
    '65 stories cover foundations, every component, and full screen samples. Accessibility is tested rather than asserted: the test runner replays each story through axe in both light and dark themes, so a contrast regression fails the build instead of shipping.',
  docsCaption: 'The Storybook, run through the same 1-bit dither the rest of the site uses',
  toolingTitle: 'The chores are automated, because I am the only one doing them.',
  toolingText:
    'Nineteen Claude Code skills live in the repo: add a component, audit the tokens, check a story against the documentation rules, cut release notes, and push the built packages out to all three consumers. A solo system dies of admin, so the admin is the part that got written down first.',
  sites: [
    { title: 'This portfolio', text: 'Every page, and the case study sections you are reading, are scorp-ds components.' },
    { title: 'The showcase', text: 'A public front door for the system, deployed from its own repo on merge.' },
    { title: 'Protodash', text: 'A prototyping dashboard where new patterns get pressure-tested before they graduate.' },
  ],
  vendoring:
    'None of the three install from a registry. Each vendors a committed copy of the built packages, so any checkout builds offline and an upgrade is a reviewable diff rather than a version bump that silently moves a hundred pixels.',
  learnings: [
    {
      title: 'Constraints travel further than components',
      text: 'The rules that earned their keep are the boring prohibitions: no raw hex, no border radius, no sans-serif. They hold across every new component without anyone re-litigating them.',
    },
    {
      title: 'A system is only real once something depends on it',
      text: 'The library was tidy in isolation and full of wrong assumptions the moment a second site consumed it. Shipping the portfolio on it found more gaps than any amount of reviewing the components alone.',
    },
  ],
};

export const scorpionCaseStudy: CaseStudy = {
  title: 'Scorpion Design System',
  summary:
    'A token-based React component library with a terminal look, built solo and now running three production sites.',
  outcomes: [
    { value: '43', label: 'components' },
    { value: '378', label: 'tokens' },
    { value: '65', label: 'stories, axe-tested' },
    { value: '3', label: 'sites in production' },
  ],
  meta: [
    { label: 'Role', value: 'Designer and builder, solo' },
    { label: 'Timeline', value: 'Aug 2025 to now' },
    { label: 'Stack', value: 'React, TypeScript, Tailwind, Storybook' },
  ],
  sections: [
    {
      kicker: 'overview',
      title: S.overviewTitle,
      intro: S.overviewText,
      blocks: [{ type: 'slot', name: 'scorp-interface', caption: S.interfaceCaption }],
    },
    { kicker: 'the problem', title: S.problemTitle, intro: S.problemText },
    {
      kicker: 'the system',
      title: 'Tokens first, then everything else.',
      blocks: [
        { type: 'slot', name: 'scorp-palette', caption: S.paletteCaption },
        { type: 'list', items: S.principles },
        { type: 'ascii', width: 'wide', label: S.asciiLabel, caption: S.asciiCaption, text: S.ascii },
      ],
    },
    {
      kicker: 'documentation',
      title: S.docsTitle,
      intro: S.docsText,
      blocks: [{ type: 'image', caption: S.docsCaption }],
    },
    { kicker: 'tooling', title: S.toolingTitle, intro: S.toolingText },
    {
      kicker: 'in production',
      title: 'Three sites run on it.',
      blocks: [
        { type: 'callouts', items: S.sites },
        { type: 'prose', text: S.vendoring },
      ],
    },
    {
      kicker: 'reflection',
      title: 'What building it actually taught me.',
      blocks: [{ type: 'list', items: S.learnings }],
    },
  ],
};
