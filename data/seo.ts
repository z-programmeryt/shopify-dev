/**
 * SEO — per-route metadata and the intent keyword map (docs/KEYWORD-MAP.md).
 * Titles are written without the brand suffix; the root layout template appends " | Ring Lot Morong".
 * Rules: titles ≤ 60 chars incl. suffix where possible, descriptions 110–165 chars, no keyword stuffing,
 * service pages by intent (never by city), no FAQ schema (deprecated by Google in 2026).
 */

export interface RouteSeo {
  title: string
  /** Use as an absolute title (no template suffix). */
  absolute?: boolean
  description: string
}

export const routeSeo: Record<string, RouteSeo> = {
  '/': {
    title: 'Ring Lot Morong — Shopify Developer & Designer',
    absolute: true,
    description:
      'Shopify stores, GemPages and PageFly landing pages, and Meta/GA4 tracking by Ring Lot Morong — conversion-focused builds with every claim linked to its source.',
  },
  '/about': {
    title: 'About Ring Lot Morong',
    description:
      'Ring Lot Morong is a Shopify developer and designer building stores, landing pages and tracking. How he works, who he works with and his verified record.',
  },
  '/services': {
    title: 'Shopify Services',
    description:
      'Shopify development, design, CRO, landing pages, speed, theme customization, PageFly, GemPages and Meta/GA4 tracking — each service with its own evidence.',
  },
  '/work': {
    title: 'Work — Shopify Portfolio',
    description:
      'Shopify portfolio records by Ring Lot Morong across fashion, beauty, jewelry, personalised products and social commerce — with sources and confidence levels.',
  },
  '/case-studies': {
    title: 'Case Studies',
    description:
      'Shopify case studies and case files by Ring Lot Morong — documented scope, role and evidence, with nothing filled in by assumption.',
  },
  '/industries': {
    title: 'Industries',
    description:
      'Shopify work across fashion, beauty, jewelry, personalised products, social commerce and dropshipping — and what matters most in each category.',
  },
  '/process': {
    title: 'Process',
    description:
      'How a Shopify project runs with Ring Lot Morong: discover, diagnose, strategize, design, build, optimize and launch — and what you get at each step.',
  },
  '/skills': {
    title: 'Skills',
    description:
      'Ring Lot Morong’s Shopify skill graph — platform, page builders, tracking, front-end and commerce operations — with every skill linked to evidence.',
  },
  '/proof': {
    title: 'Proof — Verified Record',
    description:
      'Verified record for Ring Lot Morong: 4.9 average from 143 Fiverr reviews, Fiverr Level 2, repeat clients — every item linked to its public source.',
  },
  '/reviews': {
    title: 'Client Reviews',
    description:
      'Verbatim Fiverr reviews of Ring Lot Morong’s Shopify work with the full rating breakdown, service, price band and country — unedited and sourced.',
  },
  '/insights': {
    title: 'Insights',
    description:
      'Practical notes on Shopify tracking, page builders, product pages and performance — written for store owners who want to understand the why.',
  },
  '/links': {
    title: 'Links',
    description: 'Verified links for Ring Lot Morong: website, Fiverr profile, résumé and the project brief form — one place, nothing unverified.',
  },
  '/contact': {
    title: 'Start a Project',
    description:
      'Start a Shopify project with Ring Lot Morong — store builds, landing pages, CRO or tracking. Send a short brief and get questions or a plan back.',
  },
  '/resume': {
    title: 'Résumé',
    description:
      'Résumé of Ring Lot Morong, Shopify developer and designer: services, skills, verified platform record and selected portfolio entries. Web, print and PDF.',
  },
  '/lab': {
    title: 'Lab — Store Teardown & CRO Experiments',
    description:
      'A demo Shopify store teardown and CRO experiment designs — what to change, why, the expected effect and how to measure it. Demo data, clearly labelled.',
  },
  '/privacy': {
    title: 'Privacy',
    description: 'How this website handles contact form data, analytics, cookies and the optional voice assistant — what is collected and what is not.',
  },
  '/terms': {
    title: 'Terms',
    description: 'Terms of use for this website, including how portfolio records, reviews and demo content should be read.',
  },
}

export interface KeywordCluster {
  cluster: string
  intent: 'navigational' | 'commercial' | 'transactional' | 'informational'
  primary: string
  secondary: string[]
  target: string
}

export const keywordMap: KeywordCluster[] = [
  {
    cluster: 'Entity',
    intent: 'navigational',
    primary: 'Ring Lot Morong',
    secondary: ['Ringlot Morong', 'Ringlot Shopify', 'Ring Lot Shopify developer'],
    target: '/',
  },
  {
    cluster: 'Shopify development',
    intent: 'transactional',
    primary: 'Shopify developer',
    secondary: ['hire Shopify developer', 'Shopify store setup', 'Shopify store build'],
    target: '/services/shopify-development',
  },
  {
    cluster: 'Shopify design',
    intent: 'transactional',
    primary: 'Shopify store design',
    secondary: ['Shopify redesign', 'Shopify website designer', 'Shopify product page design'],
    target: '/services/shopify-design',
  },
  {
    cluster: 'CRO',
    intent: 'commercial',
    primary: 'Shopify CRO',
    secondary: ['Shopify conversion rate optimization', 'improve Shopify conversion rate'],
    target: '/services/shopify-cro',
  },
  {
    cluster: 'Landing pages',
    intent: 'transactional',
    primary: 'Shopify landing page design',
    secondary: ['Shopify sales page', 'one product Shopify page', 'Shopify product landing page'],
    target: '/services/shopify-landing-pages',
  },
  {
    cluster: 'Performance',
    intent: 'commercial',
    primary: 'Shopify speed optimization',
    secondary: ['Shopify Core Web Vitals', 'slow Shopify store'],
    target: '/services/shopify-performance',
  },
  {
    cluster: 'Theme customization',
    intent: 'transactional',
    primary: 'Shopify theme customization',
    secondary: ['custom Shopify sections', 'Shopify theme changes'],
    target: '/services/shopify-theme-customization',
  },
  {
    cluster: 'PageFly',
    intent: 'transactional',
    primary: 'PageFly designer',
    secondary: ['PageFly landing page', 'PageFly developer'],
    target: '/services/pagefly',
  },
  {
    cluster: 'GemPages',
    intent: 'transactional',
    primary: 'GemPages designer',
    secondary: ['GemPages landing page', 'GemPages developer'],
    target: '/services/gempages',
  },
  {
    cluster: 'Tracking',
    intent: 'transactional',
    primary: 'Shopify Meta Pixel Conversions API setup',
    secondary: ['Shopify GA4 setup', 'Shopify GTM', 'Facebook pixel deduplication'],
    target: '/services/conversion-tracking',
  },
  {
    cluster: 'Tracking (informational)',
    intent: 'informational',
    primary: 'Meta Pixel Conversions API deduplication Shopify',
    secondary: ['event_id deduplication', 'double counted purchases Meta'],
    target: '/insights/meta-pixel-conversions-api-deduplication-shopify',
  },
  {
    cluster: 'Page builders (informational)',
    intent: 'informational',
    primary: 'GemPages vs PageFly',
    secondary: ['best Shopify page builder for landing pages'],
    target: '/insights/gempages-or-pagefly-choosing-a-shopify-page-builder',
  },
  {
    cluster: 'Product page (informational)',
    intent: 'informational',
    primary: 'Shopify product page checklist',
    secondary: ['product page best practices Shopify'],
    target: '/insights/shopify-product-page-anatomy-checklist',
  },
  {
    cluster: 'Performance (informational)',
    intent: 'informational',
    primary: 'Shopify performance budget',
    secondary: ['Shopify apps slow store', 'Shopify Core Web Vitals'],
    target: '/insights/shopify-performance-budget-apps-page-builders',
  },
]
