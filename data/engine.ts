/**
 * COMMERCE ENGINE — the signature object. One definition drives:
 *  - the 3D scene (components/engine/EngineScene.tsx)
 *  - the SVG fallback (components/engine/EngineFallback.tsx)
 *  - the homepage layer walkthrough and the process diagram.
 *
 * Metaphor: DESIGN → DEVELOPMENT → PERFORMANCE → UX → CRO → CONVERSION.
 * Each layer is a working part of a store, not decoration, and links to the service behind it.
 */

export type EngineLayerId = 'design' | 'development' | 'performance' | 'ux' | 'cro' | 'conversion'

export interface EngineLayer {
  id: EngineLayerId
  index: number
  label: string
  title: string
  body: string
  /** What the 3D/SVG layer depicts — also used as the accessible description. */
  depicts: string
  serviceSlugs: string[]
}

export const engineLayers: EngineLayer[] = [
  {
    id: 'design',
    index: 0,
    label: 'Design',
    title: 'A storefront structure people understand at a glance',
    body: 'Brand, layout and merchandising: what you sell, why it is different, and where to start — on the first screen of a phone.',
    depicts: 'A storefront grid of product tiles under a header bar.',
    serviceSlugs: ['shopify-design'],
  },
  {
    id: 'development',
    index: 1,
    label: 'Development',
    title: 'Theme code and configuration that stay editable',
    body: 'Templates, sections, apps and settings assembled so the store owner can keep editing after hand-off.',
    depicts: 'Rows of code fragments of varying length.',
    serviceSlugs: ['shopify-development', 'shopify-theme-customization'],
  },
  {
    id: 'performance',
    index: 2,
    label: 'Performance',
    title: 'Speed measured, not promised',
    body: 'Apps, scripts, images and builder weight audited and reduced, with the same measurements before and after.',
    depicts: 'A gauge arc with connected analytics nodes.',
    serviceSlugs: ['shopify-performance'],
  },
  {
    id: 'ux',
    index: 3,
    label: 'UX',
    title: 'Pages that answer buyer questions in order',
    body: 'Product and landing pages — in theme sections, GemPages or PageFly — structured around one offer and one next step.',
    depicts: 'Interface cards and a primary action button.',
    serviceSlugs: ['shopify-landing-pages', 'gempages', 'pagefly'],
  },
  {
    id: 'cro',
    index: 4,
    label: 'CRO',
    title: 'Changes with a reason and a way to evaluate them',
    body: 'Each change is written as What → Why → Expected effect, then compared against data instead of opinions.',
    depicts: 'Two comparison bars, A and B, with a direction marker.',
    serviceSlugs: ['shopify-cro'],
  },
  {
    id: 'conversion',
    index: 5,
    label: 'Conversion',
    title: 'Tracking that tells you what actually happened',
    body: 'Meta Pixel, Conversions API, GA4 and GTM events — deduplicated and verified — so every layer above can be measured.',
    depicts: 'A single conversion node where all data flows arrive.',
    serviceSlugs: ['conversion-tracking'],
  },
]

/** Cross-component channel: UI → engine highlight (3D and SVG). */
export const ENGINE_FOCUS_EVENT = 'engine:focus'
export const ENGINE_PROGRESS_EVENT = 'engine:progress'

export type EngineFocusDetail = { index: number | null }
export type EngineProgressDetail = { progress: number }
