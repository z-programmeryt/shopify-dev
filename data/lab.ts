/**
 * LAB — demonstrations of thinking, clearly labelled as demos.
 *  - Store Teardown: a FICTIONAL store ("Northline Supply Co.") — demo data only.
 *  - CRO Lab: experiment designs (What → Why → Expected effect → Measure), not results.
 * Nothing here is presented as client work or as measured outcomes.
 */

export type Priority = 'High' | 'Medium' | 'Low'

export interface TeardownHotspot {
  id: string
  x: number // % from left of the mock
  y: number // % from top of the mock
  area: string
  issue: string
  whyItMatters: string
  recommendation: string
  expectedEffect: string
  measure: string
  priority: Priority
  layer: 'design' | 'development' | 'performance' | 'ux' | 'cro' | 'conversion'
}

export const teardownStore = {
  name: 'Northline Supply Co.',
  label: 'Demo data — fictional store',
  product: 'Waxed Canvas Weekender Bag',
  note: 'A fictional product page assembled to show how a teardown is structured. Any resemblance to a real store is coincidental.',
}

export const teardownHotspots: TeardownHotspot[] = [
  {
    id: 'fold',
    x: 50,
    y: 14,
    area: 'Mobile first screen',
    issue: 'The image gallery fills the entire first screen on phones; price and the add-to-cart button start below the fold.',
    whyItMatters: 'Visitors from ads decide quickly. If the first screen does not show what it costs and how to buy, many leave before scrolling.',
    recommendation: 'Shorter gallery on mobile (swipeable, ~60% of viewport), with title, rating, price and variant selector visible on load.',
    expectedEffect: 'More visitors see the offer and the primary action without scrolling.',
    measure: 'Scroll depth to the add-to-cart button; add-to-cart rate from paid traffic.',
    priority: 'High',
    layer: 'ux',
  },
  {
    id: 'variants',
    x: 74,
    y: 38,
    area: 'Variant selector',
    issue: 'Colours sit in a dropdown, and sold-out colours are only revealed after selection.',
    whyItMatters: 'Hidden options add a step and surprise visitors with “sold out” after they have chosen.',
    recommendation: 'Visual swatches that switch the gallery, with sold-out options visibly crossed out.',
    expectedEffect: 'Faster variant choice and fewer dead-end selections.',
    measure: 'Variant selection events; add-to-cart rate per session.',
    priority: 'Medium',
    layer: 'design',
  },
  {
    id: 'delivery',
    x: 74,
    y: 52,
    area: 'Under the add-to-cart button',
    issue: 'No delivery estimate or returns information near the button — it is in the footer policies.',
    whyItMatters: 'Shipping cost, delivery time and returns are among the last questions before purchase.',
    recommendation: 'One line under the button: delivery estimate, shipping threshold and returns window, linking to details.',
    expectedEffect: 'Fewer visitors leaving the page to look for shipping and returns answers.',
    measure: 'Clicks to policy pages; checkout initiation rate.',
    priority: 'High',
    layer: 'cro',
  },
  {
    id: 'reviews',
    x: 70,
    y: 25,
    area: 'Title area',
    issue: 'Reviews exist but only appear at the very bottom of the page.',
    whyItMatters: 'Social proof helps most at the moment of doubt, which is near the title and price.',
    recommendation: 'Star rating and review count next to the title, linking to the reviews section.',
    expectedEffect: 'Visitors see existing proof earlier.',
    measure: 'Clicks on the rating link; engagement with the reviews section.',
    priority: 'Medium',
    layer: 'cro',
  },
  {
    id: 'hero-image',
    x: 28,
    y: 34,
    area: 'Main product image',
    issue: 'The main image is a 2400px PNG served to every device and lazy-loaded.',
    whyItMatters: 'The main image is usually the Largest Contentful Paint element; oversized and lazy-loaded makes the page feel slow.',
    recommendation: 'Responsive widths via Shopify image filters, modern formats, eager loading with high fetch priority for the first image only.',
    expectedEffect: 'Faster LCP on mobile connections.',
    measure: 'LCP in PageSpeed Insights field data and Shopify’s web performance report.',
    priority: 'High',
    layer: 'performance',
  },
  {
    id: 'apps',
    x: 50,
    y: 88,
    area: 'Scripts',
    issue: 'Two review apps and an old upsell app all load scripts on every page.',
    whyItMatters: 'Unused third-party scripts delay interactivity across the whole store.',
    recommendation: 'Keep one review app, remove leftover code from uninstalled apps, scope widgets to the pages that use them.',
    expectedEffect: 'Less JavaScript on every page; more responsive interactions.',
    measure: 'Total blocking time / INP; number of third-party requests.',
    priority: 'Medium',
    layer: 'development',
  },
  {
    id: 'tracking',
    x: 86,
    y: 70,
    area: 'Tracking',
    issue: 'The Meta Pixel fires Purchase twice — once from the channel app and once from an old manual snippet.',
    whyItMatters: 'Double-counted purchases make campaigns look better than they are and mislead optimisation.',
    recommendation: 'Remove the manual snippet; send browser and server events with matching event IDs for deduplication.',
    expectedEffect: 'One purchase recorded per order; trustworthy reporting.',
    measure: 'Events Manager deduplication status; purchases vs Shopify orders.',
    priority: 'High',
    layer: 'conversion',
  },
]

export interface CroExperiment {
  id: string
  title: string
  what: string
  why: string
  expectedEffect: string
  measure: string
  fitsWhen: string
  demo?: 'sticky-atc' | 'delivery-line' | 'swatches'
}

export const croExperiments: CroExperiment[] = [
  {
    id: 'sticky-atc',
    title: 'Sticky add-to-cart on mobile',
    what: 'A compact bar with price and the add-to-cart button appears once the main button scrolls out of view.',
    why: 'Long product pages push the primary action out of reach while visitors read details.',
    expectedEffect: 'The action stays one tap away for visitors who scroll to read.',
    measure: 'Add-to-cart events attributed to the sticky bar vs the main button.',
    fitsWhen: 'Product pages with long descriptions or many images.',
    demo: 'sticky-atc',
  },
  {
    id: 'delivery-line',
    title: 'Delivery & returns line under the button',
    what: 'One line of delivery estimate, shipping threshold and returns window directly beneath add-to-cart.',
    why: 'Shipping and returns are late-stage questions; answering them in place avoids a detour to policy pages.',
    expectedEffect: 'Fewer exits to policy pages before purchase.',
    measure: 'Policy page clicks from product pages; checkout initiation rate.',
    fitsWhen: 'Any store with clear shipping and returns terms.',
    demo: 'delivery-line',
  },
  {
    id: 'swatches',
    title: 'Swatches instead of a dropdown',
    what: 'Colour and material options as visual swatches that update the gallery; sold-out options visibly marked.',
    why: 'Dropdowns hide options and reveal stock problems only after selection.',
    expectedEffect: 'Quicker variant decisions and fewer dead ends.',
    measure: 'Variant change events; add-to-cart rate for multi-variant products.',
    fitsWhen: 'Products with visual variants (colour, finish, pattern).',
    demo: 'swatches',
  },
  {
    id: 'rating-summary',
    title: 'Rating summary beside the title',
    what: 'Stars and review count next to the product title, linking to reviews.',
    why: 'Proof is most useful at the first moment of doubt.',
    expectedEffect: 'More visitors notice existing reviews.',
    measure: 'Rating-link clicks; review section engagement.',
    fitsWhen: 'Products with a meaningful number of genuine reviews.',
  },
  {
    id: 'message-match',
    title: 'Landing headline that matches the ad',
    what: 'The landing page headline repeats the promise of the ad or email that sent the visitor.',
    why: 'A mismatch between ad and page makes visitors wonder if they are in the right place.',
    expectedEffect: 'Lower bounce from paid campaigns.',
    measure: 'Bounce/engagement rate and add-to-cart rate per campaign landing page.',
    fitsWhen: 'Paid social or search campaigns with dedicated pages.',
  },
  {
    id: 'cart-threshold',
    title: 'Free-shipping progress in the cart',
    what: 'If a free-shipping threshold exists, the cart shows how far the order is from it.',
    why: 'A visible, honest threshold turns an abstract policy into a concrete next step.',
    expectedEffect: 'Some customers add a small item to reach the threshold.',
    measure: 'Average order value; share of orders above the threshold.',
    fitsWhen: 'Stores with a real free-shipping threshold and suitable add-on products.',
  },
]
