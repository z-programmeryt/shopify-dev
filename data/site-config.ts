/**
 * Site configuration — single place for environment-dependent values and global UI copy.
 * All pages, metadata, sitemap, JSON-LD and OG images read from here.
 */

function normaliseUrl(raw: string | undefined): string {
  const fallback = 'https://ringlotmorong.com'
  if (!raw) return fallback
  try {
    const url = new URL(raw)
    return url.origin
  } catch {
    return fallback
  }
}

const siteEnv = process.env.SITE_ENV ?? process.env.VERCEL_ENV ?? 'development'

export const siteConfig = {
  name: 'Ring Lot Morong',
  shortName: 'Ring Lot',
  /** Canonical origin. OWNER MUST CONFIRM (ledger TL-060). */
  url: normaliseUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: 'en',
  /** Only "production" may be indexed. */
  env: siteEnv,
  isIndexable: siteEnv === 'production',
  /** Date the public facts on this site were last checked against their sources. */
  lastVerified: '2026-10-15',
  themeColor: '#0A1630',
} as const

export type NavItem = { label: string; href: string; description?: string }

export const primaryNav: NavItem[] = [
  { label: 'Work', href: '/work', description: 'Portfolio records and case files' },
  { label: 'Services', href: '/services', description: 'Shopify design, builds, landing pages, tracking' },
  { label: 'Process', href: '/process', description: 'How a project runs, step by step' },
  { label: 'Proof', href: '/proof', description: 'Verified record and client reviews' },
  { label: 'About', href: '/about', description: 'Who Ring Lot is and how he works' },
]

export const secondaryNav: NavItem[] = [
  { label: 'Case studies', href: '/case-studies' },
  { label: 'Industries', href: '/industries' },
  { label: 'Skills', href: '/skills' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Insights', href: '/insights' },
  { label: 'Lab', href: '/lab' },
  { label: 'Résumé', href: '/resume' },
  { label: 'Links', href: '/links' },
]

export const legalNav: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

/** CTA hierarchy (brief): one primary, one secondary, one contextual. Never compete. */
export const ctas = {
  primary: { label: 'Start a project', href: '/contact' },
  secondary: { label: 'Explore the work', href: '/work' },
  contextual: { label: 'Request a store review', href: '/contact?intent=review' },
} as const

/**
 * Contact channels. Only verified channels are listed.
 * The contact form is the primary channel; Fiverr is the verified fallback.
 */
export const contactChannels = {
  form: '/contact',
  fiverr: {
    label: 'Message on Fiverr',
    href: 'https://www.fiverr.com/ringlot465',
    claimId: 'TL-002',
  },
  /** OWNER TO SUPPLY — not published until confirmed. */
  email: null as string | null,
}

export const features = {
  /** Optional "Ask Ring Lot" assistant — answers from approved data only, voice requires explicit activation. */
  assistant: true,
  /** Semantic cursor labels (fine pointers only, disabled with reduced motion). */
  semanticCursor: true,
  /** Lazy 3D Commerce Engine (desktop/tablet capable devices only; SVG fallback elsewhere). */
  engine3d: true,
}

export const analyticsConfig = {
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || '',
  plausibleSrc: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js',
}

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}
