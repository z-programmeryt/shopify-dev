/**
 * SKILLS — a skill graph, not skill bars. No percentages or "expert level" labels:
 * each skill shows the evidence behind it (service lines, reviews, portfolio).
 */

export interface SkillEvidence {
  label: string
  href: string
}

export interface Skill {
  name: string
  evidence: SkillEvidence[]
  claimIds: string[]
}

export interface SkillGroup {
  id: string
  name: string
  description: string
  skills: Skill[]
}

const GIG_STORE = 'https://www.fiverr.com/ringlot465/create-branded-shopify-dropshipping-store-or-shopify-website'
const GIG_TRACKING = 'https://www.fiverr.com/ringlot465/fix-facebook-business-manager-and-setup-fb-pixel-events'
const GIG_LANDING =
  'https://www.fiverr.com/ringlot465/design-shopify-product-landing-page-shopify-landing-page-using-gempage-pagefly'
const PORTFOLIO = 'https://www.fiverr.com/users/ringlot465/portfolio'

export const skillGroups: SkillGroup[] = [
  {
    id: 'shopify',
    name: 'Shopify platform',
    description: 'Store setup, configuration and theme work.',
    skills: [
      {
        name: 'Store setup & configuration',
        evidence: [
          { label: 'Store build service · 55 reviews', href: GIG_STORE },
          { label: 'Service page', href: '/services/shopify-development' },
        ],
        claimIds: ['TL-020', 'TL-016'],
      },
      {
        name: 'Online Store 2.0 theme customization',
        evidence: [
          { label: 'Portfolio: website customization', href: PORTFOLIO },
          { label: 'Service page', href: '/services/shopify-theme-customization' },
        ],
        claimIds: ['TL-020', 'TL-024'],
      },
      {
        name: 'App selection & integration',
        evidence: [{ label: 'Store build service scope', href: GIG_STORE }],
        claimIds: ['TL-020'],
      },
      {
        name: 'Print-on-demand stores (Printify, Printful)',
        evidence: [{ label: 'Store build service scope', href: GIG_STORE }],
        claimIds: ['TL-020'],
      },
    ],
  },
  {
    id: 'builders',
    name: 'Page builders',
    description: 'Landing, product and campaign pages.',
    skills: [
      {
        name: 'GemPages',
        evidence: [
          { label: 'Landing page service · 5.0 (4 reviews)', href: GIG_LANDING },
          { label: 'Service page', href: '/services/gempages' },
        ],
        claimIds: ['TL-021'],
      },
      {
        name: 'PageFly',
        evidence: [
          { label: 'Landing page service · 5.0 (4 reviews)', href: GIG_LANDING },
          { label: 'Service page', href: '/services/pagefly' },
        ],
        claimIds: ['TL-021'],
      },
      {
        name: 'Shogun',
        evidence: [{ label: 'Landing page service scope', href: GIG_LANDING }],
        claimIds: ['TL-021'],
      },
    ],
  },
  {
    id: 'tracking',
    name: 'Tracking & analytics',
    description: 'Measurement that makes design decisions testable.',
    skills: [
      {
        name: 'Meta Pixel & Conversions API',
        evidence: [
          { label: 'Tracking service · 5.0 (20 reviews)', href: GIG_TRACKING },
          { label: 'Service page', href: '/services/conversion-tracking' },
        ],
        claimIds: ['TL-022', 'TL-016'],
      },
      {
        name: 'Event deduplication',
        evidence: [{ label: 'Tracking service scope', href: GIG_TRACKING }],
        claimIds: ['TL-022'],
      },
      {
        name: 'Google Analytics 4 e-commerce',
        evidence: [{ label: 'Tracking service scope', href: GIG_TRACKING }],
        claimIds: ['TL-022'],
      },
      {
        name: 'Google Tag Manager & data layer',
        evidence: [{ label: 'Tracking service scope', href: GIG_TRACKING }],
        claimIds: ['TL-022'],
      },
      {
        name: 'Google Ads conversion tracking',
        evidence: [{ label: 'Tracking service scope', href: GIG_TRACKING }],
        claimIds: ['TL-022'],
      },
    ],
  },
  {
    id: 'frontend',
    name: 'Front-end',
    description: 'Code used for theme and page customization.',
    skills: [
      { name: 'HTML & CSS', evidence: [{ label: 'Portfolio technology tags', href: PORTFOLIO }], claimIds: ['TL-024'] },
      { name: 'JavaScript', evidence: [{ label: 'Portfolio technology tags', href: PORTFOLIO }], claimIds: ['TL-024'] },
      {
        name: 'Responsive, mobile-first layouts',
        evidence: [{ label: 'Portfolio entries', href: PORTFOLIO }],
        claimIds: ['TL-026'],
      },
    ],
  },
  {
    id: 'commerce',
    name: 'Commerce operations',
    description: 'Channels and store housekeeping around the storefront.',
    skills: [
      {
        name: 'Facebook & Instagram Shops',
        evidence: [{ label: 'Portfolio entries', href: PORTFOLIO }],
        claimIds: ['TL-023'],
      },
      {
        name: 'Basic on-page SEO setup',
        evidence: [{ label: 'Store build packages', href: GIG_STORE }],
        claimIds: ['TL-025'],
      },
      {
        name: 'Speed housekeeping',
        evidence: [{ label: 'Service page', href: '/services/shopify-performance' }],
        claimIds: ['TL-025'],
      },
    ],
  },
]
