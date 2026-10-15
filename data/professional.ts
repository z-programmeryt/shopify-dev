/**
 * PROFESSIONAL — positioning, verified record, principles and fit.
 * Decided after research (docs/POSITIONING.md). Copy here is used by pages, metadata,
 * the résumé (web + PDF), OG images and the assistant knowledge base.
 */

export type ProofLevel = 'DIRECT' | 'VERIFIED' | 'CORROBORATED' | 'CLAIM'

export const positioning = {
  title: 'Shopify Developer & Designer',
  specialization: ['Shopify', 'eCommerce', 'CRO'] as const,
  /** Hero promise — scope, not outcomes. Every clause maps to a corroborated service (TL-020/021/022). */
  promise:
    'I design and build Shopify stores and landing pages — and set up the tracking that shows what’s working.',
  /** One-line answer to "what does he do?" for meta descriptions and the résumé. */
  summary:
    'Shopify developer and designer building conversion-focused stores, GemPages/PageFly landing pages and Meta/GA4 tracking for e-commerce brands.',
  /** Longer About intro. No years, counts or revenue — see TL-040…TL-046. */
  intro:
    'Ring Lot Morong is a Shopify developer and designer. He builds and redesigns Shopify stores, designs product and landing pages in GemPages and PageFly, and connects Meta Pixel, Conversions API, GA4 and Google Tag Manager so store owners can see what their pages actually do.',
  differentiator:
    'Design, build and measurement in one workflow. Most store work stops at “looks good”; this work ends with tracking you can check.',
  claimIds: ['TL-003', 'TL-020', 'TL-021', 'TL-022'],
} as const

export interface ProofFact {
  id: string
  label: string
  value: string
  detail: string
  level: ProofLevel
  claimId: string
  sourceLabel: string
  sourceUrl: string
}

const FIVERR = 'https://www.fiverr.com/ringlot465'

/** Platform-verified facts — the only numbers the site shows. */
export const proofFacts: ProofFact[] = [
  {
    id: 'rating',
    label: 'Fiverr rating',
    value: '4.9',
    detail: 'Average from 143 public client reviews',
    level: 'VERIFIED',
    claimId: 'TL-011',
    sourceLabel: 'Fiverr profile',
    sourceUrl: FIVERR,
  },
  {
    id: 'level',
    label: 'Seller level',
    value: 'Level 2',
    detail: 'Issued by Fiverr based on delivery history',
    level: 'VERIFIED',
    claimId: 'TL-010',
    sourceLabel: 'Fiverr profile',
    sourceUrl: FIVERR,
  },
  {
    id: 'repeat',
    label: 'Repeat clients',
    value: '11 of 15',
    detail: 'Collected reviews marked “Ongoing collaboration”',
    level: 'VERIFIED',
    claimId: 'TL-015',
    sourceLabel: 'Fiverr reviews',
    sourceUrl: FIVERR,
  },
  {
    id: 'since',
    label: 'Member since',
    value: 'Dec 2021',
    detail: 'Platform membership date',
    level: 'VERIFIED',
    claimId: 'TL-013',
    sourceLabel: 'Fiverr profile',
    sourceUrl: 'https://www.fiverr.com/ringlot465/create-branded-shopify-dropshipping-store-or-shopify-website',
  },
]

export const reviewCountries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MR', name: 'Mauritania' },
] as const

export const ratingBreakdown = {
  average: 4.9,
  total: 143,
  stars: { 5: 139, 4: 2, 3: 1, 2: 0, 1: 1 } as Record<1 | 2 | 3 | 4 | 5, number>,
  claimId: 'TL-012',
  sourceUrl: FIVERR,
}

/** Gig-level record (TL-016). */
export const serviceRecord = [
  { service: 'Shopify store build', rating: 4.8, reviews: 55, serviceSlug: 'shopify-development' },
  { service: 'Meta Pixel, CAPI & GA4 tracking', rating: 5.0, reviews: 20, serviceSlug: 'conversion-tracking' },
  { service: 'Shopify website build', rating: 4.9, reviews: 4, serviceSlug: 'shopify-design' },
  { service: 'Product & landing pages', rating: 5.0, reviews: 4, serviceSlug: 'shopify-landing-pages' },
] as const

/** How he works — principles, not claims. */
export const principles = [
  {
    title: 'Measure before redesigning',
    body: 'If a store has traffic, the first question is what the data already says. Tracking gaps get fixed before opinions get implemented.',
  },
  {
    title: 'Every section earns its place',
    body: 'Sections, apps and scripts are added for a reason that can be stated in one sentence. Everything else slows the store down.',
  },
  {
    title: 'Mobile is the default canvas',
    body: 'Most store traffic is on phones, so layouts, tap targets and product media are designed for mobile first and expanded for desktop.',
  },
  {
    title: 'Hand-off you can run yourself',
    body: 'Pages are built so the store owner can edit content without breaking layout — in the theme editor or the page builder they already use.',
  },
]

/** Fit — who this work is for (positive framing only; "not a fit" requires owner approval). */
export const fit = [
  {
    title: 'Founders launching on Shopify',
    body: 'You have products and a brand direction and need a store that is ready to sell and easy to manage.',
  },
  {
    title: 'Brands with traffic but weak pages',
    body: 'Ads or social are sending visitors, but product or landing pages are not converting the way you expect.',
  },
  {
    title: 'Stores with unreliable tracking',
    body: 'Meta and GA4 numbers disagree, events double-count, or purchases are missing after a checkout change.',
  },
  {
    title: 'Agencies needing Shopify capacity',
    body: 'You need someone to build pages in GemPages or PageFly, customize a theme, or wire up tracking inside your process.',
  },
]

/** Trust stack (brief §21): Identity → Expertise → Proof → Process → Evidence → Contact. */
export const trustStack = [
  { step: 'Identity', body: 'A real, consistent professional identity — one name, verified profiles.', href: '/about' },
  { step: 'Expertise', body: 'Specific Shopify services, each with its own evidence.', href: '/services' },
  { step: 'Proof', body: 'Platform-verified record and verbatim client reviews.', href: '/proof' },
  { step: 'Process', body: 'A visible process from discovery to launch.', href: '/process' },
  { step: 'Evidence', body: 'Every claim on this site links to its source.', href: '/reviews' },
  { step: 'Contact', body: 'A short brief, a clear next step.', href: '/contact' },
] as const

/** What happens after someone reaches out. No response-time promises (TL-051). */
export const nextSteps = [
  {
    title: 'You send a short brief',
    body: 'What you sell, what is not working, and any links. Rough is fine.',
  },
  {
    title: 'Ring Lot reviews your store',
    body: 'If you shared a URL, he looks at the storefront, key pages and visible tracking before replying.',
  },
  {
    title: 'You get questions or a plan',
    body: 'A reply with clarifying questions, or a recommended scope with what is included and what is not.',
  },
  {
    title: 'Agree scope, then start',
    body: 'Work starts once scope, timeline and price are agreed in writing.',
  },
]

/** Optional NOW section — owner-approved content only. Null = hidden. */
export const now: null | { updated: string; items: string[] } = null
