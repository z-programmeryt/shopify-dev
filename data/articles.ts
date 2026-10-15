/**
 * ARTICLES — typed content blocks (no MDX dependency; validated by tests).
 *
 * Editorial gate: articles are drafted for Ring Lot and stay `in-review` until he has reviewed
 * them. In-review articles render with a visible banner, are `noindex`, excluded from the sitemap
 * and carry no Article JSON-LD. Flip `status` to 'published' (and set `reviewedOn`) after review.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'table'; head: string[]; rows: string[][] }

export interface Article {
  slug: string
  title: string
  description: string
  category: 'Tracking' | 'Page builders' | 'CRO' | 'Performance'
  status: 'in-review' | 'published'
  drafted: string
  reviewedOn: string | null
  readingMinutes: number
  relatedServices: string[]
  blocks: Block[]
}

export const articles: Article[] = [
  {
    slug: 'meta-pixel-conversions-api-deduplication-shopify',
    title: 'Meta Pixel and Conversions API on Shopify: how deduplication actually works',
    description:
      'Why Shopify stores double-count purchases in Meta, how event ID deduplication works between the Pixel and the Conversions API, and how to verify it.',
    category: 'Tracking',
    status: 'in-review',
    drafted: '2026-10-15',
    reviewedOn: null,
    readingMinutes: 7,
    relatedServices: ['conversion-tracking', 'shopify-cro'],
    blocks: [
      {
        type: 'p',
        text: 'When a Shopify store sends the same purchase from the browser and from a server, Meta needs a way to know they are the same event. If it cannot tell, purchases are counted twice, return on ad spend looks better than it is, and campaign optimisation learns from the wrong data.',
      },
      { type: 'h2', id: 'two-paths', text: 'Two paths for the same event' },
      {
        type: 'p',
        text: 'The Meta Pixel runs in the visitor’s browser. The Conversions API sends events from a server. Browser events can be lost to ad blockers, browser privacy features or consent choices; server events are not affected by those in the same way. That is why the recommended setup sends both — on purpose, redundantly.',
      },
      { type: 'h2', id: 'how-meta-decides', text: 'How Meta decides two events are the same' },
      {
        type: 'p',
        text: 'Meta deduplicates a browser event and a server event when they share the same event name and the same event ID. In the Pixel the ID is passed as eventID; in the Conversions API it is event_id. If the IDs differ — or one side sends no ID at all — both events are kept.',
      },
      {
        type: 'code',
        lang: 'js',
        code: "// Browser (Pixel)\nfbq('track', 'Purchase', { value: 49.0, currency: 'USD' }, { eventID: 'order_1042' })\n\n// Server (Conversions API payload, abbreviated)\n{ \"event_name\": \"Purchase\", \"event_id\": \"order_1042\", \"action_source\": \"website\" }",
      },
      {
        type: 'callout',
        title: 'The rule that matters',
        text: 'Same event name, same event ID, on both sides. For purchases, an order or checkout identifier is a stable choice because both the browser and the server know it.',
      },
      { type: 'h2', id: 'where-it-breaks', text: 'Where Shopify stores usually go wrong' },
      {
        type: 'ul',
        items: [
          'Two Pixel installations: the Facebook & Instagram channel plus an old manual snippet or a second tracking app — each sends its own Purchase.',
          'A custom pixel or GTM setup that sends Purchase without an event ID while the channel app sends it with one.',
          'Leftover tracking code in theme files from apps that were uninstalled long ago.',
          'Server events sent by a third-party app and by the channel app at the same time.',
        ],
      },
      { type: 'h2', id: 'shopify-specifics', text: 'Shopify specifics' },
      {
        type: 'p',
        text: 'On current Shopify checkouts, tracking on checkout and thank-you pages runs through Customer Events — app pixels installed by apps, or custom pixels added under Settings → Customer events — rather than code pasted into checkout templates. Custom pixels run in a sandbox and subscribe to standard events such as checkout_completed, whose data you map to Meta and GA4 events yourself.',
      },
      {
        type: 'p',
        text: 'For most stores the simplest reliable option is the official Facebook & Instagram channel at its highest data-sharing setting, which sends browser and server events and is designed to deduplicate them. Custom pixels or GTM make sense when you need control the channel does not give you — and then deduplication becomes your responsibility.',
      },
      { type: 'h2', id: 'verify', text: 'How to verify deduplication' },
      {
        type: 'ol',
        items: [
          'In Events Manager, open your dataset and select the Purchase event. Both Browser and Server should appear as connection methods.',
          'Check the event’s diagnostics. Meta flags missing or mismatched event IDs and shows whether events are being deduplicated.',
          'Use Test Events while placing a real test order. You should see the browser and the server Purchase arrive and be marked as deduplicated.',
          'Compare a day of Meta purchases with Shopify orders. They will not match exactly — attribution windows and consent differ — but a ratio near 2:1 is a red flag.',
        ],
      },
      { type: 'h2', id: 'good', text: 'What “good” looks like' },
      {
        type: 'ul',
        items: [
          'One Purchase per order, with value and currency.',
          'Both connection methods active for key events.',
          'A single Pixel ID in the page source — no stray duplicates.',
          'Customer information parameters sent through the integration, so event match quality is not left at the minimum.',
        ],
      },
      {
        type: 'p',
        text: 'Fixing deduplication is unglamorous. But budget, creative and landing-page decisions all depend on it — which is why it comes before any redesign.',
      },
    ],
  },
  {
    slug: 'gempages-or-pagefly-choosing-a-shopify-page-builder',
    title: 'GemPages or PageFly? Choosing a page builder for Shopify landing pages',
    description:
      'A practical way to choose between Shopify page builders: who edits the pages, template needs, performance discipline, lock-in, and when theme sections are better.',
    category: 'Page builders',
    status: 'in-review',
    drafted: '2026-10-15',
    reviewedOn: null,
    readingMinutes: 6,
    relatedServices: ['gempages', 'pagefly', 'shopify-landing-pages'],
    blocks: [
      {
        type: 'p',
        text: 'GemPages and PageFly are both mature Shopify page builders. Either can produce an excellent landing page, and either can produce a slow, inconsistent one. The decision is less about the logo and more about how your team works.',
      },
      { type: 'h2', id: 'who-edits', text: 'Start with who will edit the pages' },
      {
        type: 'p',
        text: 'If marketers will launch campaign pages every week, the builder they find easiest is the right one. If a developer will build a few permanent pages and rarely touch them, a builder may not be needed at all. Ask the people who will do the editing to try both editors on a real page before deciding.',
      },
      { type: 'h2', id: 'questions', text: 'Questions that decide it' },
      {
        type: 'ul',
        items: [
          'Do you already use one? Switching costs time and rebuilds; staying is usually right.',
          'Do you need one template applied to many products, or many unique campaign pages?',
          'Which plan features do you actually need — testing, analytics, templates — and on which plan are they included today?',
          'How does each builder behave with your theme and the apps you rely on (reviews, subscriptions, bundles)?',
          'What happens to your pages if you cancel the app? Check the current policy before committing.',
        ],
      },
      { type: 'h2', id: 'system', text: 'What matters more than the builder' },
      {
        type: 'ul',
        items: [
          'A small library of reusable sections, so every page is assembled from the same parts.',
          'Typography and colours matched to the theme, so builder pages do not look bolted on.',
          'Deliberate mobile settings rather than whatever the desktop layout collapses into.',
          'Discipline about page weight: fewer elements, properly sized images, no duplicated custom code.',
          'Tracking on the primary action, so each page can be evaluated.',
        ],
      },
      { type: 'h2', id: 'performance', text: 'Performance' },
      {
        type: 'p',
        text: 'Builder pages carry their own CSS and JavaScript on top of the theme. That cost is manageable, but it grows with every element, animation and embedded widget. Test important pages with PageSpeed Insights before and after major changes, and treat each added element as something that has to earn its place.',
      },
      { type: 'h2', id: 'theme-sections', text: 'When theme sections beat any builder' },
      {
        type: 'p',
        text: 'Online Store 2.0 themes let you build pages from sections in the theme editor. For permanent pages that rarely change — a core product template, an about page — custom theme sections avoid an app dependency entirely and usually load less code. Builders shine when speed of launching new pages matters more than independence.',
      },
      {
        type: 'table',
        head: ['Situation', 'Usually the better choice'],
        rows: [
          ['Already using a builder and the team knows it', 'Stay with it; build a section library'],
          ['Weekly campaign pages edited by marketers', 'The builder your editors prefer'],
          ['A few permanent, rarely changed pages', 'Custom theme sections'],
          ['One template across many products', 'Whichever handles product templates best in your trial'],
        ],
      },
    ],
  },
  {
    slug: 'shopify-product-page-anatomy-checklist',
    title: 'Product page anatomy: what to check before you redesign',
    description:
      'A structured checklist for Shopify product pages — first screen, media, variants, delivery, proof, description and speed — plus how to prioritise fixes.',
    category: 'CRO',
    status: 'in-review',
    drafted: '2026-10-15',
    reviewedOn: null,
    readingMinutes: 6,
    relatedServices: ['shopify-cro', 'shopify-design'],
    blocks: [
      {
        type: 'p',
        text: 'Before redesigning a product page, check what it fails to answer. Most product pages do not need a new look; they need the right information in the right order, especially on a phone.',
      },
      { type: 'h2', id: 'first-screen', text: '1. The first screen on mobile' },
      {
        type: 'ul',
        items: [
          'Can a visitor see the product name, price and how to buy without scrolling?',
          'Is the gallery height reasonable, or does it fill the whole screen?',
          'Is there one obvious primary action?',
        ],
      },
      { type: 'h2', id: 'media', text: '2. Media' },
      {
        type: 'ul',
        items: [
          'Multiple angles, a sense of scale and close-ups of materials or details.',
          'Images that change when a variant is selected.',
          'Video only when it shows something images cannot — and never autoplaying with sound.',
        ],
      },
      { type: 'h2', id: 'variants', text: '3. Variants' },
      {
        type: 'ul',
        items: [
          'Visual swatches for visual options; clear labels for sizes.',
          'Sold-out options visible as unavailable before selection.',
          'Size guides next to the size selector.',
        ],
      },
      { type: 'h2', id: 'delivery', text: '4. Price, delivery and returns' },
      {
        type: 'ul',
        items: [
          'Delivery estimate and shipping cost (or threshold) close to the button.',
          'Returns window stated plainly, linking to details.',
          'Any discount explained without fake urgency.',
        ],
      },
      { type: 'h2', id: 'proof', text: '5. Proof' },
      {
        type: 'ul',
        items: [
          'Rating summary near the title, linked to the full reviews.',
          'Reviews that can be filtered or searched when there are many.',
          'Real customer photos when available.',
        ],
      },
      { type: 'h2', id: 'description', text: '6. Description structure' },
      {
        type: 'ul',
        items: [
          'Benefits first, then specifications, care and FAQs — in scannable sections.',
          'Answers to the questions customer service hears most often.',
          'No walls of text on mobile.',
        ],
      },
      { type: 'h2', id: 'speed', text: '7. Speed' },
      {
        type: 'ul',
        items: [
          'The main image sized correctly and not lazy-loaded.',
          'Only the apps this page needs loading on it.',
          'Layout that does not jump while reviews and widgets load.',
        ],
      },
      { type: 'h2', id: 'prioritise', text: 'How to prioritise' },
      {
        type: 'p',
        text: 'Score each issue by expected impact, effort and the share of traffic that sees it. A problem on the mobile first screen of your best-selling product outranks a polish item on a page few people visit. Fix tracking first if you plan to evaluate the changes.',
      },
    ],
  },
  {
    slug: 'shopify-performance-budget-apps-page-builders',
    title: 'A performance budget for Shopify: apps, page builders and Core Web Vitals',
    description:
      'How to keep a Shopify store fast: Core Web Vitals thresholds, field vs lab data, the usual costs (apps, builders, images) and a simple budget to enforce.',
    category: 'Performance',
    status: 'in-review',
    drafted: '2026-10-15',
    reviewedOn: null,
    readingMinutes: 7,
    relatedServices: ['shopify-performance', 'shopify-theme-customization'],
    blocks: [
      {
        type: 'p',
        text: 'Shopify stores rarely become slow in one step. They slow down one app, one widget and one oversized image at a time. A performance budget turns “we should keep it fast” into a rule you can check.',
      },
      { type: 'h2', id: 'cwv', text: 'What to measure' },
      {
        type: 'table',
        head: ['Metric', 'Measures', '“Good” threshold'],
        rows: [
          ['Largest Contentful Paint (LCP)', 'Loading of the main content', '≤ 2.5 s'],
          ['Interaction to Next Paint (INP)', 'Responsiveness to taps and clicks', '≤ 200 ms'],
          ['Cumulative Layout Shift (CLS)', 'Visual stability', '≤ 0.1'],
        ],
      },
      {
        type: 'p',
        text: 'These thresholds apply at the 75th percentile of real page loads. Field data — from real visitors, shown in PageSpeed Insights when a store has enough traffic and in Shopify’s web performance report — is what users experience. Lab data from a single test run is for diagnosing, not for judging.',
      },
      { type: 'h2', id: 'costs', text: 'Where the weight usually comes from' },
      {
        type: 'ul',
        items: [
          'Apps that load scripts on every page, even where their widget is not shown.',
          'Leftover code from uninstalled apps. Older apps often edited theme files directly; app embeds delivered through theme app extensions are removed with the app.',
          'Page-builder pages with many elements, animations and embedded widgets.',
          'Images uploaded at full camera size and served without responsive widths.',
          'Several font families and weights, or fonts loaded from multiple sources.',
        ],
      },
      { type: 'h2', id: 'images', text: 'Images done properly in Liquid' },
      {
        type: 'p',
        text: 'Shopify’s image filters can generate responsive images. Give the main product image explicit widths and sizes, and load it eagerly with high priority; lazy-load images further down the page.',
      },
      {
        type: 'code',
        lang: 'liquid',
        code: "{{ product.featured_image\n  | image_url: width: 1200\n  | image_tag:\n    widths: '400, 800, 1200',\n    sizes: '(min-width: 990px) 50vw, 100vw',\n    loading: 'eager',\n    fetchpriority: 'high' }}",
      },
      { type: 'h2', id: 'budget', text: 'A simple budget to enforce' },
      {
        type: 'ol',
        items: [
          'Inventory: list every app and third-party script, what it does and which pages need it.',
          'Measure: record field and lab metrics for the homepage, a collection and your top product page.',
          'Set the rule: a new app or widget must replace something, or justify its cost on the pages it loads.',
          'Re-check after every significant change, using the same pages and the same tools.',
        ],
      },
      {
        type: 'callout',
        title: 'A perfect score is not the goal',
        text: 'Some apps you rely on add weight that can be reduced but not removed. The goal is good real-user Core Web Vitals on the pages that make money.',
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export const isPublished = (article: Article) => article.status === 'published'
