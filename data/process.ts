/**
 * PROCESS — DISCOVER → DIAGNOSE → STRATEGIZE → DESIGN → BUILD → OPTIMIZE → LAUNCH.
 * Rendered as a spatial journey (sticky diagram that evolves on scroll), never as a card grid.
 * Each step maps to the Commerce Engine layer it moves forward.
 */
import type { EngineLayerId } from './engine'

export interface ProcessStep {
  id: string
  index: number
  name: string
  question: string
  happens: string[]
  youGet: string
  needFromYou: string
  engine: EngineLayerId | null
}

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    index: 0,
    name: 'Discover',
    question: 'What are you selling, to whom, and what is not working?',
    happens: ['Short brief and store walkthrough', 'Goals, constraints and deadline captured', 'Access requested only if needed'],
    youGet: 'A shared understanding of the problem, in writing.',
    needFromYou: 'Store URL (if live), products, and what success looks like.',
    engine: null,
  },
  {
    id: 'diagnose',
    index: 1,
    name: 'Diagnose',
    question: 'Where does the store lose people — and can we trust the data?',
    happens: ['Tracking checked for gaps and duplicates', 'Key templates reviewed on mobile and desktop', 'Speed baseline recorded'],
    youGet: 'A list of issues ranked by impact and effort.',
    needFromYou: 'Read access to analytics and ad accounts, if available.',
    engine: 'conversion',
  },
  {
    id: 'strategize',
    index: 2,
    name: 'Strategize',
    question: 'Which changes matter most, and in what order?',
    happens: ['Scope agreed: pages, features, integrations', 'Each change written as What → Why → Expected effect', 'Timeline and price agreed before work starts'],
    youGet: 'A written scope with what is in and what is out.',
    needFromYou: 'Decisions on priorities and budget.',
    engine: 'cro',
  },
  {
    id: 'design',
    index: 3,
    name: 'Design',
    question: 'What should each page say first?',
    happens: ['Page structure agreed (wireframe or preview theme)', 'Visual direction applied to key templates', 'Mobile layouts designed first'],
    youGet: 'Approved page structure and design direction.',
    needFromYou: 'Brand assets, product content and feedback.',
    engine: 'design',
  },
  {
    id: 'build',
    index: 4,
    name: 'Build',
    question: 'How do we build it so you can keep editing it?',
    happens: ['Theme sections, templates or builder pages assembled', 'Apps and tracking integrated', 'Work done on an unpublished theme'],
    youGet: 'A working preview you can click through.',
    needFromYou: 'Timely review of the preview.',
    engine: 'development',
  },
  {
    id: 'optimize',
    index: 5,
    name: 'Optimize',
    question: 'Is it fast, clear and measured?',
    happens: ['Speed housekeeping and image delivery', 'Tracking verified with test events', 'Device and browser QA'],
    youGet: 'A QA’d build with verified tracking.',
    needFromYou: 'A test order, if purchase tracking is in scope.',
    engine: 'performance',
  },
  {
    id: 'launch',
    index: 6,
    name: 'Launch',
    question: 'What happens on publish day — and after?',
    happens: ['Launch checklist run', 'Theme published, events monitored', 'Hand-off notes and walkthrough'],
    youGet: 'A live store and the notes to run it.',
    needFromYou: 'Final approval to publish.',
    engine: 'ux',
  },
]
