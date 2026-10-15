/**
 * CASE STUDIES — 20-section format (brief §14). Sections render ONLY when documented.
 *
 * Status:
 *  - 'case-file'  → evidence-limited record. Rendered with a transparent "documented vs pending" panel,
 *                   excluded from the sitemap and served with robots noindex until completed.
 *  - 'published'  → complete, owner-approved case study (indexable).
 *
 * To upgrade a case file: add the owner-supplied facts to `sections`, add evidence, move items out of
 * `pending`, set status to 'published'. Never fill sections with assumptions.
 */

export type CaseSectionId =
  | 'overview'
  | 'context'
  | 'industry'
  | 'problem'
  | 'goal'
  | 'audience'
  | 'constraints'
  | 'role'
  | 'responsibilities'
  | 'strategy'
  | 'information-architecture'
  | 'design-decisions'
  | 'technical-implementation'
  | 'shopify-customization'
  | 'apps-integrations'
  | 'performance'
  | 'accessibility'
  | 'results'
  | 'evidence'
  | 'lessons'

export const caseSectionTitles: Record<CaseSectionId, string> = {
  overview: 'Project overview',
  context: 'Client & business context',
  industry: 'Industry',
  problem: 'Problem',
  goal: 'Goal',
  audience: 'Users & audience',
  constraints: 'Constraints',
  role: 'Role',
  responsibilities: 'Responsibilities',
  strategy: 'Strategy',
  'information-architecture': 'Information architecture',
  'design-decisions': 'Design decisions',
  'technical-implementation': 'Technical implementation',
  'shopify-customization': 'Shopify customization',
  'apps-integrations': 'Apps & integrations',
  performance: 'Performance',
  accessibility: 'Accessibility',
  results: 'Results',
  evidence: 'Evidence',
  lessons: 'Lessons & next steps',
}

export const caseSectionOrder = Object.keys(caseSectionTitles) as CaseSectionId[]

export interface CaseSection {
  id: CaseSectionId
  body?: string
  items?: string[]
}

export interface WhyThisDesign {
  element: string
  problem: string
  userNeed: string
  businessGoal: string
  decision: string
  expectedEffect: string
}

export interface CaseStudy {
  slug: string
  projectSlug: string
  title: string
  subtitle: string
  status: 'case-file' | 'published'
  sections: CaseSection[]
  pending: CaseSectionId[]
  whyThisDesign: WhyThisDesign[]
  engineeringNotes: string[]
  designNotes: string[]
  lastReviewed: string
  seo: { title: string; description: string }
}

const COMMON_PENDING: CaseSectionId[] = [
  'goal',
  'audience',
  'strategy',
  'information-architecture',
  'design-decisions',
  'apps-integrations',
  'performance',
  'accessibility',
  'results',
  'lessons',
]

export const caseStudies: CaseStudy[] = [
  {
    slug: 'personalized-products-store',
    projectSlug: 'pawfecthouse-personalized-store',
    title: 'A store where the product page is the personalisation tool',
    subtitle: 'Shopify store design for custom, personalised products.',
    status: 'case-file',
    sections: [
      {
        id: 'overview',
        body: 'Shopify store design for a business selling personalised products, built around letting customers customise a design before ordering.',
      },
      { id: 'industry', body: 'Personalised gifts and custom products.' },
      {
        id: 'problem',
        body: 'Customers had to be able to personalise each product before placing an order — the store design needed to make that step clear.',
      },
      { id: 'role', body: 'Store designer and developer (as described in Ring Lot’s portfolio).' },
      {
        id: 'responsibilities',
        items: ['Store design', 'Product personalisation step on product pages', 'Responsive layout'],
      },
      {
        id: 'evidence',
        items: ['Fiverr portfolio entry published by Ring Lot (listed as “Pawfecthouse”). Not affiliated with any similarly named brand; live store not linked.'],
      },
    ],
    pending: ['context', 'constraints', 'technical-implementation', 'shopify-customization', ...COMMON_PENDING],
    whyThisDesign: [],
    engineeringNotes: [],
    designNotes: [],
    lastReviewed: '2026-10-15',
    seo: {
      title: 'Case file: Personalised Products Store',
      description:
        'Case file for a Shopify store designed around a product personalisation step — documented scope, role and evidence, with pending details listed.',
    },
  },
  {
    slug: 'fashion-accessories-store',
    projectSlug: 'allairds-fashion-store',
    title: 'Full store design for a fashion, shoes & accessories brand',
    subtitle: 'Allairds — complete Shopify storefront design.',
    status: 'case-file',
    sections: [
      {
        id: 'overview',
        body: 'Complete Shopify store design for Allairds, a fashion brand selling clothing, shoes and accessories.',
      },
      { id: 'industry', body: 'Fashion, footwear and accessories.' },
      { id: 'role', body: 'Store designer and developer (as described in Ring Lot’s portfolio).' },
      {
        id: 'responsibilities',
        items: ['Full store design', 'SEO-friendly structure', 'Speed optimisation'],
      },
      {
        id: 'technical-implementation',
        body: 'Built on Shopify with an SEO-friendly page structure and speed optimisation, as described in the portfolio entry. Specific theme, apps and measurements are not documented.',
      },
      { id: 'evidence', items: ['Fiverr portfolio entry published by Ring Lot.'] },
    ],
    pending: ['context', 'problem', 'constraints', 'shopify-customization', ...COMMON_PENDING],
    whyThisDesign: [],
    engineeringNotes: [],
    designNotes: [],
    lastReviewed: '2026-10-15',
    seo: {
      title: 'Case file: Fashion & Accessories Store',
      description:
        'Case file for a full Shopify store design for a fashion, shoes and accessories brand — documented scope, role and evidence, with pending details listed.',
    },
  },
  {
    slug: 'jewelry-store',
    projectSlug: 'beekind-jewelry-store',
    title: 'A jewelry store designed on a two-day turnaround',
    subtitle: 'Beekind Shop — Shopify jewelry store design.',
    status: 'case-file',
    sections: [
      {
        id: 'overview',
        body: 'Shopify store design for a jewelry shop, with an SEO-friendly setup and speed optimisation.',
      },
      { id: 'industry', body: 'Jewelry and accessories.' },
      { id: 'constraints', body: 'Delivered within two days, as described in the portfolio entry.' },
      { id: 'role', body: 'Store designer (as described in Ring Lot’s portfolio).' },
      { id: 'responsibilities', items: ['Store design', 'SEO-friendly setup', 'Speed optimisation'] },
      {
        id: 'evidence',
        items: ['Fiverr portfolio entry published by Ring Lot (listed as “Jewelry Beekind Shop”). Live store not linked.'],
      },
    ],
    pending: ['context', 'problem', 'technical-implementation', 'shopify-customization', ...COMMON_PENDING],
    whyThisDesign: [],
    engineeringNotes: [],
    designNotes: [],
    lastReviewed: '2026-10-15',
    seo: {
      title: 'Case file: Jewelry Store in Two Days',
      description:
        'Case file for a Shopify jewelry store designed on a two-day turnaround — documented scope, role and evidence, with pending details listed.',
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}
