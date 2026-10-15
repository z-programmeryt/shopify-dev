/**
 * Client-safe lead form options (no zod). Shared by the intake form (browser) and lib/lead.ts (server).
 */
export const INTENTS = {
  development: 'Shopify store development / design',
  'landing-page': 'Landing or product page',
  'cro-tracking': 'Conversion & tracking',
  review: 'Store review',
  other: 'Something else',
} as const
export type Intent = keyof typeof INTENTS

export const INTENT_HINTS: Record<Intent, string> = {
  development: 'New store, rebuild, redesign or theme work',
  'landing-page': 'GemPages, PageFly, Shogun or theme sections',
  'cro-tracking': 'Conversion fixes, Meta Pixel/CAPI, GA4, GTM',
  review: 'A second pair of eyes on an existing store',
  other: 'Tell me in your own words',
}

export const BUILDERS = {
  gempages: 'GemPages',
  pagefly: 'PageFly',
  shogun: 'Shogun',
  theme: 'Theme sections (no builder)',
  unsure: 'Not sure',
} as const

export const BUDGETS = {
  'under-500': 'Under $500',
  '500-1500': '$500–$1,500',
  '1500-5000': '$1,500–$5,000',
  '5000-plus': '$5,000+',
  'not-sure': 'Not sure yet',
} as const

export const TIMELINES = {
  asap: 'As soon as possible',
  month: 'Within a month',
  quarter: 'In 1–3 months',
  flexible: 'Flexible',
} as const

export const SCOPE_OPTIONS = ['New store build', 'Redesign', 'Theme customization', 'Speed', 'Apps & integrations'] as const
export const TRACKING_OPTIONS = ['Meta Pixel + CAPI', 'GA4', 'Google Tag Manager', 'Google Ads conversions'] as const

export function isIntent(value: string | null | undefined): value is Intent {
  return Boolean(value && value in INTENTS)
}
