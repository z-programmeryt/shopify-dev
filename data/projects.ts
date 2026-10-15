/**
 * PROJECTS — Project DNA records (docs/PROJECT-DNA.md).
 *
 * Source for every record: Ring Lot's own Fiverr portfolio (TL-026). Rules:
 *  - Only documented facts are filled in. Unknown fields stay null/empty — never invented.
 *  - No live client URLs (TL-050) and no copied screenshots (permission not confirmed).
 *  - Covers are generated abstract art, labelled as such — never presented as screenshots.
 *  - `outcomes` stays empty until a client-verified metric exists.
 */

export type Confidence = 'high' | 'medium' | 'low'

export interface ProjectAuthenticity {
  owner: string
  source: string
  publicUrl: string | null
  attribution: string
  permission: string
  evidence: string[]
  confidence: Confidence
}

export interface ProjectDNA {
  slug: string
  title: string
  /** Title exactly as published on Fiverr (audit trail). */
  publishedTitle: string
  summary: string
  industry: string
  industryId: string
  platform: string
  role: string
  contribution: string[]
  challenge: string | null
  solution: string | null
  services: string[]
  technologies: string[]
  evidence: { label: string; url: string }[]
  outcomes: string[]
  liveUrl?: string
  screenshots: string[]
  timeline?: string
  confidence: Confidence
  authenticity: ProjectAuthenticity
  caseStudySlug?: string
  related: string[]
  /** Palette seed for generated cover art. */
  cover: { hue: 'emerald' | 'navy' | 'teal' | 'silver'; motif: 'grid' | 'stack' | 'orbit' | 'flow' }
  claimIds: string[]
}

const PORTFOLIO = 'https://www.fiverr.com/users/ringlot465/portfolio'

const fiverrEvidence = [{ label: 'Fiverr portfolio entry', url: PORTFOLIO }]

const selfReported = (owner: string, confidence: Confidence): ProjectAuthenticity => ({
  owner,
  source: 'Fiverr portfolio, published by Ring Lot',
  publicUrl: null,
  attribution: 'Self-reported by Ring Lot on Fiverr; not independently confirmed',
  permission: 'Not confirmed — listed publicly by Ring Lot; confirm with client before adding screenshots or live links',
  evidence: [PORTFOLIO],
  confidence,
})

export const projects: ProjectDNA[] = [
  {
    slug: 'pawfecthouse-personalized-store',
    title: 'Personalized products store',
    publishedTitle: 'Pawfecthouse',
    summary:
      'Shopify store design for custom, personalised products — built so customers can personalise a design before they order.',
    industry: 'Personalized products',
    industryId: 'personalized-pod',
    platform: 'Shopify',
    role: 'Store designer & developer',
    contribution: ['Store design', 'Product personalisation step before checkout', 'Responsive layout'],
    challenge: 'Customers needed to personalise each product before ordering.',
    solution: 'A store design organised around a product personalisation step on product pages.',
    services: ['shopify-design', 'shopify-development', 'shopify-landing-pages'],
    technologies: ['Shopify', 'Product personalisation app'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Jul 2023',
    confidence: 'medium',
    authenticity: selfReported('Client published as "Pawfecthouse" (not linked — see TL-050)', 'medium'),
    caseStudySlug: 'personalized-products-store',
    related: ['beekind-jewelry-store', 'beauty-products-store'],
    cover: { hue: 'teal', motif: 'orbit' },
    claimIds: ['TL-026', 'TL-027'],
  },
  {
    slug: 'allairds-fashion-store',
    title: 'Allairds — fashion, shoes & accessories store',
    publishedTitle: 'Allairds shopify eCommerce store design',
    summary:
      'Full Shopify store design for a fashion, shoes and accessories brand, including an SEO-friendly structure and speed optimisation.',
    industry: 'Fashion & apparel',
    industryId: 'fashion-apparel',
    platform: 'Shopify',
    role: 'Store designer & developer',
    contribution: ['Full store design', 'SEO-friendly structure', 'Speed optimisation'],
    challenge: null,
    solution: null,
    services: ['shopify-design', 'shopify-development', 'shopify-performance'],
    technologies: ['Shopify', 'Online Store 2.0 theme'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Jul 2023',
    confidence: 'medium',
    authenticity: selfReported('Client published as "Allairds"', 'medium'),
    caseStudySlug: 'fashion-accessories-store',
    related: ['crates-clothing-store', 'naja-store'],
    cover: { hue: 'navy', motif: 'grid' },
    claimIds: ['TL-026', 'TL-027'],
  },
  {
    slug: 'beekind-jewelry-store',
    title: 'Beekind — jewelry store',
    publishedTitle: 'Jewelry Beekind Shop',
    summary:
      'Jewelry store design with an SEO-friendly setup and speed optimisation, delivered on a two-day turnaround.',
    industry: 'Jewelry & accessories',
    industryId: 'jewelry-accessories',
    platform: 'Shopify',
    role: 'Store designer',
    contribution: ['Store design', 'SEO-friendly setup', 'Speed optimisation'],
    challenge: 'A two-day delivery window.',
    solution: null,
    services: ['shopify-design', 'shopify-performance'],
    technologies: ['Shopify'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Delivered in 2 days (as described) · entry added Jul 2023',
    confidence: 'medium',
    authenticity: selfReported('Client published as "Beekind Shop" (not linked — see TL-050)', 'medium'),
    caseStudySlug: 'jewelry-store',
    related: ['beauty-products-store', 'pawfecthouse-personalized-store'],
    cover: { hue: 'silver', motif: 'stack' },
    claimIds: ['TL-026', 'TL-027'],
  },
  {
    slug: 'beauty-products-store',
    title: 'Beauty products store',
    publishedTitle: 'Beauty Products Shopify Store',
    summary: 'Branded, fully responsive Shopify store design for beauty and cosmetics products, with speed optimisation.',
    industry: 'Beauty & cosmetics',
    industryId: 'beauty-cosmetics',
    platform: 'Shopify',
    role: 'Store designer & developer',
    contribution: ['Branded store design', 'Responsive layout', 'Website customisation', 'Speed optimisation'],
    challenge: null,
    solution: null,
    services: ['shopify-design', 'shopify-development', 'shopify-theme-customization'],
    technologies: ['Shopify'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'January 2024 · listed cost band $100–$200 · 1–7 days (as listed on Fiverr)',
    confidence: 'medium',
    authenticity: selfReported('Unnamed client', 'medium'),
    related: ['beekind-jewelry-store', 'allairds-fashion-store'],
    cover: { hue: 'emerald', motif: 'flow' },
    claimIds: ['TL-026', 'TL-027'],
  },
  {
    slug: 'crates-clothing-store',
    title: 'CRATES — clothing store build',
    publishedTitle: 'Responsive Shopify Store Design',
    summary: 'New responsive Shopify store built for a clothing brand published as CRATES.',
    industry: 'Fashion & apparel',
    industryId: 'fashion-apparel',
    platform: 'Shopify',
    role: 'Store designer & developer',
    contribution: ['New store build', 'Responsive design'],
    challenge: null,
    solution: null,
    services: ['shopify-development', 'shopify-design'],
    technologies: ['Shopify'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Jul 2023',
    confidence: 'medium',
    authenticity: selfReported('Client published as "CRATES"', 'medium'),
    related: ['allairds-fashion-store', 'naja-store'],
    cover: { hue: 'navy', motif: 'stack' },
    claimIds: ['TL-026', 'TL-027'],
  },
  {
    slug: 'facebook-shop-setup',
    title: 'Facebook Shop setup',
    publishedTitle: 'Facebook Shop',
    summary:
      'Facebook Shop connected to an e-commerce store: page optimisation, product catalog, store integration and a Shop Now call to action.',
    industry: 'Social commerce',
    industryId: 'social-commerce',
    platform: 'Meta Commerce + Shopify',
    role: 'Setup specialist',
    contribution: ['Page setup & optimisation', 'Catalog with images and copy', 'Store integration', 'Shop Now button', 'Instagram Shop connection'],
    challenge: null,
    solution: null,
    services: ['conversion-tracking'],
    technologies: ['Meta Commerce Manager', 'Facebook Shop', 'Shopify'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Aug 2023',
    confidence: 'medium',
    authenticity: selfReported('Service sample — no client named', 'medium'),
    related: ['instagram-shop-setup'],
    cover: { hue: 'teal', motif: 'flow' },
    claimIds: ['TL-023', 'TL-026'],
  },
  {
    slug: 'instagram-shop-setup',
    title: 'Instagram Shop setup',
    publishedTitle: 'Instagram Shop',
    summary: 'Instagram Shop connected to the store: business profile setup, store integration, product tagging and shopping approval.',
    industry: 'Social commerce',
    industryId: 'social-commerce',
    platform: 'Meta Commerce + Shopify',
    role: 'Setup specialist',
    contribution: ['Business profile setup', 'Store integration', 'Product tagging', 'Shopping approval'],
    challenge: null,
    solution: null,
    services: ['conversion-tracking'],
    technologies: ['Meta Commerce Manager', 'Instagram Shopping', 'Shopify'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Aug 2023',
    confidence: 'medium',
    authenticity: selfReported('Service sample — no client named', 'medium'),
    related: ['facebook-shop-setup'],
    cover: { hue: 'emerald', motif: 'orbit' },
    claimIds: ['TL-023', 'TL-026'],
  },
  {
    slug: 'naja-store',
    title: 'NAJA — ten-product store',
    publishedTitle: 'NAJA',
    summary: 'Shopify store design for a ten-product catalog published as NAJA.',
    industry: 'General e-commerce',
    industryId: 'general-store',
    platform: 'Shopify',
    role: 'Store designer',
    contribution: ['Store design', 'Ten-product catalog setup'],
    challenge: null,
    solution: null,
    services: ['shopify-design'],
    technologies: ['Shopify'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Jul 2023',
    confidence: 'low',
    authenticity: selfReported('Client published as "NAJA" (industry not stated)', 'low'),
    related: ['crates-clothing-store', 'mobile-friendly-store'],
    cover: { hue: 'silver', motif: 'grid' },
    claimIds: ['TL-026'],
  },
  {
    slug: 'mobile-friendly-store',
    title: 'Mobile-first store optimisation',
    publishedTitle: 'Mobile friendly Store',
    summary: 'Mobile-friendly layouts and speed optimisation across a Shopify store, with basic SEO and theme customisation.',
    industry: 'General e-commerce',
    industryId: 'general-store',
    platform: 'Shopify',
    role: 'Developer',
    contribution: ['Mobile-friendly layouts', 'Speed optimisation', 'Basic SEO', 'Theme customisation'],
    challenge: null,
    solution: null,
    services: ['shopify-performance', 'shopify-theme-customization'],
    technologies: ['Shopify', 'Theme code'],
    evidence: fiverrEvidence,
    outcomes: [],
    screenshots: [],
    timeline: 'Portfolio entry added Jul 2023',
    confidence: 'low',
    authenticity: selfReported('Unnamed client', 'low'),
    related: ['beekind-jewelry-store', 'naja-store'],
    cover: { hue: 'teal', motif: 'grid' },
    claimIds: ['TL-025', 'TL-026'],
  },
]

export function getProject(slug: string): ProjectDNA | undefined {
  return projects.find((project) => project.slug === slug)
}
