/**
 * SERVICES — organised by search/user intent (not geography). Each service maps to a layer of
 * the Commerce Engine and lists its own evidence. No prices, no turnaround promises, no outcome
 * guarantees (TL-047, TL-049, TL-051).
 */
import type { EngineLayerId } from './engine'

export interface Service {
  slug: string
  name: string
  navLabel: string
  headline: string
  intent: string
  summary: string
  problems: string[]
  included: { title: string; body: string }[]
  approach: { step: string; body: string }[]
  deliverables: string[]
  tools: string[]
  notIncluded: string[]
  notes?: string
  evidence: { testimonialIds: string[]; projectIds: string[]; claimIds: string[] }
  faqs: { q: string; a: string }[]
  related: string[]
  engineLayer: EngineLayerId
  seo: { title: string; description: string }
}

export const services: Service[] = [
  {
    slug: 'shopify-development',
    name: 'Shopify Development',
    navLabel: 'Store development',
    headline: 'Shopify store development, from empty admin to ready to sell.',
    intent: 'Build a new Shopify store or rebuild an existing one.',
    summary:
      'Store setup and builds on Shopify: theme configuration, templates, collections, apps, payment and shipping settings, and every page a store needs before launch.',
    problems: [
      'A theme demo that does not fit your products or brand.',
      'Apps installed one at a time with no plan, each adding weight.',
      'Launch details missed: policies, shipping rules, order tracking, domain and analytics.',
    ],
    included: [
      { title: 'Theme setup', body: 'Online Store 2.0 theme chosen for your catalog, configured with your brand typography and colours.' },
      { title: 'Catalog structure', body: 'Products, variants, collections and navigation organised around how customers actually shop.' },
      { title: 'Core pages', body: 'Home, product, collection, about, contact, FAQ and policy pages built and linked.' },
      { title: 'Apps with a reason', body: 'Reviews, email capture, upsells or print-on-demand (Printify, Printful) — only what the plan needs.' },
      { title: 'Launch configuration', body: 'Domain and SSL, order-tracking page, analytics and pixel connections ready on day one.' },
      { title: 'Hand-off', body: 'A walkthrough and notes so you can add products and edit pages without help.' },
    ],
    approach: [
      { step: 'Map', body: 'Catalog, customer journey and must-have pages agreed before anything is built.' },
      { step: 'Configure', body: 'Theme, settings, navigation and templates set up on a preview theme.' },
      { step: 'Build', body: 'Sections and pages assembled with real products, not placeholder content.' },
      { step: 'Integrate', body: 'Apps and tracking connected and tested end to end.' },
      { step: 'QA', body: 'Checked on mobile and desktop, including checkout flow and emails.' },
      { step: 'Launch', body: 'Published with a checklist, then handed off.' },
    ],
    deliverables: [
      'A configured store ready for launch',
      'App list with the reason each app is installed',
      'Hand-off notes for editing pages and products',
    ],
    tools: ['Shopify admin', 'Online Store 2.0 themes', 'Theme editor', 'Shopify apps', 'Printify / Printful'],
    notIncluded: ['Product photography', 'Copywriting (unless added to scope)', 'Paid ads management'],
    evidence: {
      testimonialIds: ['t01', 't02', 't04', 't05', 't11'],
      projectIds: ['allairds-fashion-store', 'crates-clothing-store', 'beauty-products-store'],
      claimIds: ['TL-020', 'TL-016'],
    },
    faqs: [
      {
        q: 'Do I need a paid theme?',
        a: 'Not always. Free Online Store 2.0 themes are solid. A paid theme makes sense when its built-in sections match your catalog and save custom work — that call is made after seeing your products.',
      },
      {
        q: 'Can you work on my existing store?',
        a: 'Yes. Rebuilds usually happen on an unpublished copy of your theme, so the live store keeps selling until the new version is approved.',
      },
      {
        q: 'Who owns the store and the accounts?',
        a: 'You do. Work happens through staff or collaborator access on your own Shopify account, and access can be removed at hand-off.',
      },
    ],
    related: ['shopify-design', 'shopify-theme-customization', 'conversion-tracking'],
    engineLayer: 'development',
    seo: {
      title: 'Shopify Store Development',
      description:
        'Shopify store builds and rebuilds: theme setup, catalog structure, core pages, apps and launch configuration — handed off so you can run it yourself.',
    },
  },
  {
    slug: 'shopify-design',
    name: 'Shopify Design',
    navLabel: 'Store design',
    headline: 'Store design that makes products easy to understand and easy to buy.',
    intent: 'Design or redesign a Shopify store so it looks on-brand and works on mobile.',
    summary:
      'Visual and UX design for Shopify storefronts — homepage, collection and product templates, navigation and mobile layouts — built inside your theme.',
    problems: [
      'The store still looks like the theme demo.',
      'Navigation hides best sellers and key collections.',
      'On mobile, price, variants and the add-to-cart button sit below a wall of images.',
    ],
    included: [
      { title: 'Visual direction', body: 'Typography, colour and imagery rules applied consistently across templates.' },
      { title: 'Homepage narrative', body: 'Sections ordered to answer what you sell, why it is different and where to start.' },
      { title: 'Collection layouts', body: 'Grids, filters and merchandising that help customers narrow down quickly.' },
      { title: 'Product templates', body: 'Media, variant selection, price, delivery and returns information arranged for decisions.' },
      { title: 'Navigation', body: 'Header, menus and footer rebuilt around real shopping paths.' },
      { title: 'Responsive QA', body: 'Every template checked on small phones, large phones, tablets and desktop.' },
    ],
    approach: [
      { step: 'Review', body: 'Current store, analytics (if available) and the patterns customers in your category expect.' },
      { step: 'Structure', body: 'Page structure agreed as wireframes or directly in a preview theme.' },
      { step: 'Design', body: 'Key templates designed and built in the theme.' },
      { step: 'Refine', body: 'Reviewed on real devices with your products, then refined.' },
    ],
    deliverables: ['Redesigned key templates', 'Updated navigation', 'Notes on how to keep the design consistent'],
    tools: ['Theme editor', 'Online Store 2.0 sections', 'Page builders where already in use'],
    notIncluded: ['Logo or full brand identity design (unless added to scope)', 'Product photography'],
    evidence: {
      testimonialIds: ['t04', 't10', 't11', 't14'],
      projectIds: ['beauty-products-store', 'allairds-fashion-store', 'beekind-jewelry-store', 'naja-store'],
      claimIds: ['TL-020', 'TL-026'],
    },
    faqs: [
      {
        q: 'Will a redesign hurt my SEO?',
        a: 'Redesigns keep URLs, page titles and product content intact unless there is a reason to change them, and any changes are listed before launch.',
      },
      {
        q: 'Can you redesign only the product page?',
        a: 'Yes. Product templates are often the highest-impact place to start, especially for stores running ads to product pages.',
      },
    ],
    related: ['shopify-development', 'shopify-landing-pages', 'shopify-cro'],
    engineLayer: 'design',
    seo: {
      title: 'Shopify Store Design & Redesign',
      description:
        'Shopify store design and redesign: homepage, collection and product templates and navigation, built mobile-first inside your theme and easy to edit.',
    },
  },
  {
    slug: 'shopify-cro',
    name: 'Shopify CRO',
    navLabel: 'Conversion optimization',
    headline: 'Conversion work that starts with measurement, not guesses.',
    intent: 'Improve the conversion rate of an existing Shopify store.',
    summary:
      'Conversion-focused improvements to product, collection and landing pages — prioritised from data where it exists and tracked so every change can be evaluated.',
    problems: [
      'Traffic arrives but few visitors add to cart.',
      'No reliable data on where visitors drop off.',
      'Changes are made on instinct, with no way to tell if they helped.',
    ],
    included: [
      { title: 'Tracking check', body: 'Confirm the funnel data is trustworthy before using it to make decisions.' },
      { title: 'Page review', body: 'Product, collection and landing pages reviewed against the questions buyers ask.' },
      { title: 'Prioritised changes', body: 'Each recommendation states what changes, why, and the expected effect.' },
      { title: 'Implementation', body: 'Changes built in the theme or in your page builder.' },
      { title: 'Order-value levers', body: 'Cross-sell, upsell and abandoned-checkout flows set up where they fit the catalog.' },
      { title: 'Evaluation', body: 'Events in place to compare before and after on comparable periods.' },
    ],
    approach: [
      { step: 'Verify data', body: 'Fix double-counted or missing events first.' },
      { step: 'Find friction', body: 'Locate where visitors drop and what the page fails to answer.' },
      { step: 'Hypothesise', body: 'Write each change as What → Why → Expected effect.' },
      { step: 'Implement', body: 'Ship changes in priority order.' },
      { step: 'Measure', body: 'Compare like-for-like periods or run a test where traffic allows.' },
    ],
    deliverables: ['A prioritised change list with reasoning', 'Implemented changes', 'Tracking to evaluate them'],
    tools: ['GA4', 'Meta Events Manager', 'Google Tag Manager', 'PageFly / GemPages', 'Shopify analytics'],
    notIncluded: ['Guaranteed uplift — no honest provider can promise one', 'Paid traffic management'],
    notes:
      'Low-traffic stores rarely reach statistically meaningful A/B test results. For them, the work focuses on clear best-practice fixes and before/after measurement.',
    evidence: {
      testimonialIds: ['t08', 't12', 't13'],
      projectIds: ['pawfecthouse-personalized-store', 'mobile-friendly-store'],
      claimIds: ['TL-021', 'TL-022'],
    },
    faqs: [
      {
        q: 'Do you guarantee a conversion increase?',
        a: 'No. What you get is a stated reason for every change and the tracking to see its effect. Anyone guaranteeing a number is guessing.',
      },
      {
        q: 'Can we run A/B tests?',
        a: 'Yes, when traffic is high enough for a meaningful result. Some page builders include testing on certain plans; otherwise changes are compared over equivalent periods.',
      },
    ],
    related: ['conversion-tracking', 'shopify-landing-pages', 'shopify-design'],
    engineLayer: 'cro',
    seo: {
      title: 'Shopify CRO: Conversion Improvements',
      description:
        'Shopify conversion rate optimization grounded in tracking: page reviews, prioritised changes with clear reasoning, implementation and measurement.',
    },
  },
  {
    slug: 'shopify-landing-pages',
    name: 'Shopify Landing Pages',
    navLabel: 'Landing pages',
    headline: 'Landing pages built for the traffic you are paying for.',
    intent: 'Create product, sales or campaign landing pages for Shopify.',
    summary:
      'One-product pages, sales pages and campaign landing pages for Shopify — built in GemPages, PageFly, Shogun or native theme sections.',
    problems: [
      'Ads send visitors to a generic product page that does not match the ad’s promise.',
      'Campaign pages take days to build and look different every time.',
      'Pages look fine on desktop and fall apart on phones.',
    ],
    included: [
      { title: 'One-product & sales pages', body: 'A single offer, told in the order a buyer needs it.' },
      { title: 'Campaign pages', body: 'Launch, seasonal and promotion pages that match the ad or email that sends traffic.' },
      { title: 'Home, collection & blog layouts', body: 'Builder-made templates for the rest of the store when needed.' },
      { title: 'Social proof', body: 'Review imports and proof blocks placed where they answer doubts.' },
      { title: 'Mobile-first build', body: 'Layout, tap targets and media sized for phones first.' },
      { title: 'Tracked actions', body: 'Add-to-cart and key clicks tracked so the page can be evaluated.' },
    ],
    approach: [
      { step: 'Source', body: 'Start from the traffic: which ad, email or audience lands here, and what were they promised?' },
      { step: 'Structure', body: 'One offer, one primary action, objections answered in order.' },
      { step: 'Build', body: 'In your builder of choice or theme sections.' },
      { step: 'Launch & track', body: 'QA on devices, events verified, page published.' },
    ],
    deliverables: ['Published landing page(s)', 'Reusable sections for future campaigns', 'Tracking on key actions'],
    tools: ['GemPages', 'PageFly', 'Shogun', 'Theme sections', 'Review apps'],
    notIncluded: ['Ad creative and media buying', 'Copywriting (usually supplied by you; can be scoped)'],
    evidence: {
      testimonialIds: ['t12', 't13', 't14', 't15'],
      projectIds: ['pawfecthouse-personalized-store', 'beauty-products-store'],
      claimIds: ['TL-021', 'TL-016'],
    },
    faqs: [
      {
        q: 'Which page builder should I use?',
        a: 'If you already use one, usually that one. If not, the choice depends on who will edit pages and how many campaigns you run — see the GemPages and PageFly pages for the trade-offs.',
      },
      {
        q: 'Do you write the copy?',
        a: 'Usually you provide product content and the page is designed around it. Copy support can be added to the scope when needed.',
      },
    ],
    related: ['gempages', 'pagefly', 'shopify-cro'],
    engineLayer: 'ux',
    seo: {
      title: 'Shopify Landing Page Design',
      description:
        'Shopify product, sales and campaign landing pages built in GemPages, PageFly, Shogun or theme sections — mobile-first, reusable and tracked.',
    },
  },
  {
    slug: 'shopify-performance',
    name: 'Shopify Performance',
    navLabel: 'Speed & performance',
    headline: 'Speed work you can measure before and after.',
    intent: 'Speed up a slow Shopify store.',
    summary:
      'Performance housekeeping for Shopify themes — app and script audit, image delivery, page-builder weight and Core Web Vitals — measured with the same tools before and after.',
    problems: [
      'Pages feel slow on phones, especially product pages with many images.',
      'Old apps were uninstalled but their code is still loading.',
      'Several apps load scripts on every page, even where they are not used.',
    ],
    included: [
      { title: 'Baseline', body: 'PageSpeed Insights field and lab data plus Shopify’s web performance report, recorded before changes.' },
      { title: 'App & leftover code audit', body: 'Every app and injected script listed with its cost and purpose.' },
      { title: 'Image delivery', body: 'Correct sizes, responsive srcsets and lazy-loading below the fold — never on the main image.' },
      { title: 'Third-party scripts', body: 'Chat widgets, pixels and embeds loaded only where they are needed.' },
      { title: 'Builder page weight', body: 'Element count, custom code and media trimmed on page-builder pages.' },
      { title: 'Report', body: 'Same measurements after the work, with what changed and what remains.' },
    ],
    approach: [
      { step: 'Measure', body: 'Record field and lab metrics for key templates.' },
      { step: 'Find the biggest costs', body: 'Apps, images, fonts and scripts ranked by impact.' },
      { step: 'Fix in order', body: 'Highest impact, lowest risk first.' },
      { step: 'Re-measure', body: 'Same tools, same pages, documented.' },
    ],
    deliverables: ['Before/after measurements', 'List of changes made', 'Remaining recommendations'],
    tools: ['PageSpeed Insights', 'Chrome DevTools', 'Shopify web performance report', 'Theme code'],
    notIncluded: ['Promises of a specific score', 'Removing apps you depend on without agreement'],
    notes: 'A perfect lab score is not the goal; real-user Core Web Vitals are. Some apps carry a cost that can be reduced, not removed.',
    evidence: {
      testimonialIds: ['t05', 't12'],
      projectIds: ['mobile-friendly-store', 'beekind-jewelry-store'],
      claimIds: ['TL-025'],
    },
    faqs: [
      {
        q: 'Will I get a perfect PageSpeed score?',
        a: 'Unlikely, and that is fine. Scores are lab simulations; real-user Core Web Vitals matter more, and some apps you rely on add unavoidable weight.',
      },
      {
        q: 'Do you remove apps?',
        a: 'Only with your agreement. The audit shows the cost of each app so you can decide what is worth keeping.',
      },
    ],
    related: ['shopify-theme-customization', 'shopify-cro', 'shopify-development'],
    engineLayer: 'performance',
    seo: {
      title: 'Shopify Speed & Performance',
      description:
        'Shopify speed work measured before and after: app and leftover-code audit, image delivery, scripts and page-builder weight, focused on Core Web Vitals.',
    },
  },
  {
    slug: 'shopify-theme-customization',
    name: 'Shopify Theme Customization',
    navLabel: 'Theme customization',
    headline: 'Theme changes that keep the theme editor working.',
    intent: 'Customize a Shopify theme — new sections, layout changes or small features.',
    summary:
      'Custom sections, layout changes and small features for Online Store 2.0 themes — built so content stays editable in the theme editor.',
    problems: [
      'The theme almost fits, but a few layouts or features are missing.',
      'Previous edits were hard-coded, so content can no longer be changed in the editor.',
      'Removing an app left broken blocks or empty spaces.',
    ],
    included: [
      { title: 'Custom sections & blocks', body: 'New sections with editor settings, so content stays in your hands.' },
      { title: 'Header, footer & menus', body: 'Navigation and global elements adjusted to your structure.' },
      { title: 'Product page features', body: 'Badges, tabs, size guides, delivery information and similar additions.' },
      { title: 'Brand styling', body: 'Typography, spacing and colour adjustments applied consistently.' },
      { title: 'Clean-up', body: 'Leftover code from removed apps found and removed.' },
      { title: 'Documented changes', body: 'A list of every file changed and why.' },
    ],
    approach: [
      { step: 'Duplicate', body: 'Work happens on a copy of the live theme.' },
      { step: 'Build', body: 'Changes made as editable sections and settings.' },
      { step: 'Review', body: 'You preview and approve before anything is published.' },
    ],
    deliverables: ['Customised theme copy', 'Change log', 'Editor-friendly settings'],
    tools: ['Online Store 2.0 sections', 'Theme code (HTML, CSS, JavaScript)', 'Theme editor'],
    notIncluded: ['Building a theme from scratch (scoped separately)'],
    evidence: {
      testimonialIds: ['t04', 't11'],
      projectIds: ['allairds-fashion-store', 'mobile-friendly-store'],
      claimIds: ['TL-020', 'TL-024'],
    },
    faqs: [
      {
        q: 'Will theme updates overwrite the changes?',
        a: 'Theme updates replace theme files, so customisations need to be carried over. Keeping changes in self-contained sections and a change log makes that straightforward.',
      },
    ],
    related: ['shopify-development', 'shopify-performance', 'shopify-design'],
    engineLayer: 'development',
    seo: {
      title: 'Shopify Theme Customization',
      description:
        'Shopify theme customization for Online Store 2.0: custom sections, header and product page features, brand styling and app clean-up — editor-friendly.',
    },
  },
  {
    slug: 'pagefly',
    name: 'PageFly Pages',
    navLabel: 'PageFly',
    headline: 'PageFly pages that stay fast and stay editable.',
    intent: 'Hire someone to design or fix pages built with PageFly.',
    summary:
      'Landing, product and collection pages built in PageFly — structured so your team can update them without rebuilding from scratch.',
    problems: [
      'Every PageFly page looks slightly different from the last.',
      'Pages are heavy: too many elements, oversized images, leftover custom code.',
      'Mobile layouts were never adjusted, so sections stack awkwardly.',
    ],
    included: [
      { title: 'Saved and global sections', body: 'Reusable blocks so headers, proof rows and FAQs stay consistent across pages.' },
      { title: 'Theme-matched styling', body: 'Fonts, colours and spacing aligned with the theme so builder pages do not look bolted on.' },
      { title: 'Mobile-specific settings', body: 'Spacing, visibility and media adjusted per device instead of left to chance.' },
      { title: 'Lean pages', body: 'Element count, image sizes and custom code kept under control.' },
      { title: 'App compatibility', body: 'Reviews, subscriptions and upsell apps placed and tested inside the page.' },
      { title: 'Tracking', body: 'Key buttons and add-to-cart actions tracked.' },
    ],
    approach: [
      { step: 'Audit', body: 'Existing pages, sections and assignment to products reviewed.' },
      { step: 'Systemise', body: 'Shared sections created before individual pages.' },
      { step: 'Build', body: 'Pages assembled from the system, then tuned per device.' },
      { step: 'Publish', body: 'Handles, SEO fields and tracking checked before publishing.' },
    ],
    deliverables: ['Published PageFly pages', 'Saved/global section set', 'Editing notes'],
    tools: ['PageFly', 'Theme editor', 'Review apps', 'GA4 / Meta events'],
    notIncluded: ['PageFly subscription costs'],
    evidence: {
      testimonialIds: ['t12', 't13', 't14'],
      projectIds: ['beauty-products-store'],
      claimIds: ['TL-021'],
    },
    faqs: [
      {
        q: 'Can you fix a PageFly page someone else built?',
        a: 'Yes. Rebuilding the shared sections first usually fixes inconsistency across all pages at once.',
      },
      {
        q: 'What happens to PageFly pages if I stop using the app?',
        a: 'Builder pages depend on the app. Check the app’s current policy before cancelling, and keep critical pages in theme sections if long-term independence matters.',
      },
    ],
    related: ['gempages', 'shopify-landing-pages', 'shopify-performance'],
    engineLayer: 'ux',
    seo: {
      title: 'PageFly Landing Page Designer',
      description:
        'PageFly landing, product and collection pages for Shopify: reusable sections, theme-matched styling, mobile settings and lean, tracked pages.',
    },
  },
  {
    slug: 'gempages',
    name: 'GemPages Pages',
    navLabel: 'GemPages',
    headline: 'GemPages built as a system, not as one-off pages.',
    intent: 'Hire someone to design or rebuild pages in GemPages.',
    summary:
      'Product, landing and home pages in GemPages, built from reusable sections and templates so new campaigns launch faster and look consistent.',
    problems: [
      'Each new campaign page starts from a blank canvas.',
      'Product templates differ from product to product for no reason.',
      'Responsive breakpoints were never checked, so tablets and small phones break.',
    ],
    included: [
      { title: 'Section library', body: 'A small set of reusable sections that every new page draws from.' },
      { title: 'Product templates', body: 'Templates assigned to groups of products, so one change updates many pages.' },
      { title: 'Responsive breakpoints', body: 'Desktop, tablet and mobile layouts set deliberately.' },
      { title: 'Performance hygiene', body: 'Image sizes, element count and custom code kept in check.' },
      { title: 'Integrations', body: 'Review, bundle and subscription apps placed where they help decisions.' },
      { title: 'Tracking', body: 'Primary actions tracked for evaluation.' },
    ],
    approach: [
      { step: 'Inventory', body: 'Which pages exist, which repeat, which are assigned to products.' },
      { step: 'Library', body: 'Shared sections built first.' },
      { step: 'Templates', body: 'Page and product templates composed from the library.' },
      { step: 'Verify', body: 'Breakpoints, speed and tracking checked before publishing.' },
    ],
    deliverables: ['Published GemPages pages and templates', 'Reusable section library', 'Editing notes'],
    tools: ['GemPages', 'Theme editor', 'Review & bundle apps', 'GA4 / Meta events'],
    notIncluded: ['GemPages subscription costs'],
    evidence: {
      testimonialIds: ['t12', 't13', 't15'],
      projectIds: ['pawfecthouse-personalized-store'],
      claimIds: ['TL-021'],
    },
    faqs: [
      {
        q: 'GemPages or PageFly?',
        a: 'Both can build excellent pages. Stay with the one your team already knows; if starting fresh, compare how each handles templates for many products and how your editors like working in it.',
      },
    ],
    related: ['pagefly', 'shopify-landing-pages', 'shopify-design'],
    engineLayer: 'ux',
    seo: {
      title: 'GemPages Landing Page Designer',
      description:
        'GemPages product, landing and home pages for Shopify, built from a reusable section library and product templates — responsive, lean and tracked.',
    },
  },
  {
    slug: 'conversion-tracking',
    name: 'Conversion Tracking',
    navLabel: 'Tracking & analytics',
    headline: 'Tracking you can trust: Meta Pixel, Conversions API, GA4 and GTM.',
    intent: 'Set up or fix Meta Pixel, Conversions API, GA4 or GTM on a Shopify store.',
    summary:
      'Meta Pixel and Conversions API, GA4 and Google Tag Manager on Shopify — with deduplication, consistent event names and verification you can check yourself.',
    problems: [
      'Purchases are double-counted, or missing entirely, in Meta Events Manager.',
      'GA4 shows sessions but no e-commerce events.',
      'Tracking broke after checkout or theme changes and nobody noticed.',
    ],
    included: [
      { title: 'Meta Pixel + Conversions API', body: 'Browser and server events sent with matching event IDs for deduplication.' },
      { title: 'GA4 e-commerce', body: 'View item, add to cart, begin checkout and purchase events with product data.' },
      { title: 'Google Tag Manager', body: 'Containers, tags, triggers and a data layer organised and named consistently.' },
      { title: 'Google Ads conversions', body: 'Conversion actions and remarketing tags connected.' },
      { title: 'Domain & catalog', body: 'Domain verification, datasets and product catalog connection.' },
      { title: 'Verification', body: 'Events checked in Events Manager and GA4 DebugView, with a short report.' },
    ],
    approach: [
      { step: 'Audit', body: 'List every tag, app and pixel currently firing — and every duplicate.' },
      { step: 'Plan', body: 'One event plan: names, parameters, where each fires.' },
      { step: 'Implement', body: 'Via the official channel apps, Shopify Customer Events or GTM — whichever fits the store.' },
      { step: 'Verify', body: 'Test purchases and debug tools confirm each event once, with the right values.' },
    ],
    deliverables: ['Working, deduplicated events', 'Event plan document', 'Verification report'],
    tools: ['Meta Events Manager', 'Conversions API', 'GA4', 'Google Tag Manager', 'Shopify Customer Events', 'Google Ads'],
    notIncluded: ['Ad campaign management', 'Promises that platforms will report identical numbers'],
    evidence: {
      testimonialIds: ['t03', 't06', 't07', 't08', 't09'],
      projectIds: ['facebook-shop-setup', 'instagram-shop-setup'],
      claimIds: ['TL-022', 'TL-016'],
    },
    faqs: [
      {
        q: 'Why do Meta and Shopify show different purchase numbers?',
        a: 'Attribution windows, ad blockers, consent choices and deduplication all change the counts. The goal is consistent, deduplicated events — not identical numbers across tools.',
      },
      {
        q: 'What access is needed?',
        a: 'Admin or partner access to Meta Business Manager, staff access to the store, and access to GTM and GA4 if you use them.',
      },
    ],
    related: ['shopify-cro', 'shopify-landing-pages', 'shopify-development'],
    engineLayer: 'conversion',
    seo: {
      title: 'Meta Pixel, CAPI & GA4 for Shopify',
      description:
        'Meta Pixel and Conversions API with deduplication, GA4 e-commerce events and Google Tag Manager on Shopify — implemented and verified.',
    },
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}
