/**
 * "ASK RING LOT" — deterministic retrieval over APPROVED data only.
 * No language model, no network calls: every answer is a pre-approved string derived from /data,
 * so the assistant cannot invent prices, availability, experience or results.
 * Unknown questions get an honest fallback that points to the contact form.
 */
import { positioning, proofFacts, ratingBreakdown } from '@/data/professional'
import { services } from '@/data/services'
import { processSteps } from '@/data/process'

export interface KnowledgeEntry {
  id: string
  keywords: string[]
  answer: string
  links: { label: string; href: string }[]
  source: string
}

const STOPWORDS = new Set(
  'a an the is are was were do does did can could you your he his him i me my we our to of for in on at and or with about what who how which when why it this that be have has any there please tell show'.split(
    ' ',
  ),
)

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s+.-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
}

const rating = proofFacts.find((fact) => fact.id === 'rating')

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'who',
    keywords: ['who', 'ring', 'lot', 'morong', 'ringlot', 'about', 'introduce', 'yourself', 'background'],
    answer: `${positioning.intro}`,
    links: [{ label: 'About', href: '/about' }],
    source: 'About · professional profile',
  },
  {
    id: 'services',
    keywords: ['services', 'offer', 'help', 'work', 'specialize', 'specialise', 'do', 'speciality', 'specialty'],
    answer: `Ring Lot works on ${services.map((service) => service.navLabel.toLowerCase()).join(', ')}. ${positioning.differentiator}`,
    links: [{ label: 'All services', href: '/services' }],
    source: 'Services',
  },
  ...services.map<KnowledgeEntry>((service) => ({
    id: `service-${service.slug}`,
    keywords: [
      ...tokenize(service.name),
      ...tokenize(service.navLabel),
      ...tokenize(service.intent),
      ...(service.slug === 'conversion-tracking'
        ? ['pixel', 'meta', 'facebook', 'capi', 'conversions', 'api', 'ga4', 'gtm', 'analytics', 'tracking', 'dedup', 'deduplication']
        : []),
      ...(service.slug === 'shopify-performance' ? ['speed', 'slow', 'fast', 'core', 'vitals', 'pagespeed', 'lcp'] : []),
      ...(service.slug === 'shopify-cro' ? ['conversion', 'rate', 'cro', 'sales', 'convert'] : []),
    ],
    answer: `${service.summary} Included: ${service.included.map((item) => item.title.toLowerCase()).join(', ')}.`,
    links: [{ label: service.name, href: `/services/${service.slug}` }],
    source: `Services · ${service.name}`,
  })),
  {
    id: 'proof',
    keywords: ['proof', 'reviews', 'rating', 'trust', 'reliable', 'testimonials', 'fiverr', 'level', 'record', 'clients'],
    answer: `On Fiverr, Ring Lot has a ${rating?.value ?? '4.9'} average from ${ratingBreakdown.total} public reviews and is a Level 2 seller (verified ${'2026-10-15'}). Every proof item on this site links to its source.`,
    links: [
      { label: 'Proof', href: '/proof' },
      { label: 'Reviews', href: '/reviews' },
    ],
    source: 'Proof · Fiverr (verified)',
  },
  {
    id: 'process',
    keywords: ['process', 'steps', 'how', 'start', 'workflow', 'approach', 'project', 'run'],
    answer: `Projects follow ${processSteps.map((step) => step.name).join(' → ')}. Work starts only after scope, timeline and price are agreed in writing.`,
    links: [{ label: 'Process', href: '/process' }],
    source: 'Process',
  },
  {
    id: 'price',
    keywords: ['price', 'pricing', 'cost', 'rate', 'budget', 'charge', 'quote', 'expensive', 'cheap', 'hourly'],
    answer:
      'Prices are not published on this site because every scope is different. Send a short brief with your budget range and you will get a scoped recommendation.',
    links: [{ label: 'Start a project', href: '/contact' }],
    source: 'Policy · no published pricing',
  },
  {
    id: 'availability',
    keywords: ['available', 'availability', 'when', 'start', 'soon', 'timeline', 'deadline', 'response', 'reply', 'turnaround'],
    answer:
      'Availability and timelines are confirmed per project — this site does not promise response or turnaround times. Mention your deadline in the brief.',
    links: [{ label: 'Start a project', href: '/contact' }],
    source: 'Policy · no time promises',
  },
  {
    id: 'experience',
    keywords: ['experience', 'years', 'long', 'since', 'many', 'projects', 'stores', 'built'],
    answer:
      'The verifiable record is public: Fiverr member since December 2021, Level 2, 4.9 from 143 reviews. Portfolio entries are listed with their sources on the Work page.',
    links: [
      { label: 'Proof', href: '/proof' },
      { label: 'Work', href: '/work' },
    ],
    source: 'Proof · verified facts only',
  },
  {
    id: 'industries',
    keywords: ['industry', 'industries', 'niche', 'fashion', 'beauty', 'jewelry', 'jewellery', 'personalized', 'personalised', 'dropshipping', 'pod'],
    answer:
      'Published portfolio entries cover fashion and apparel, beauty and cosmetics, jewelry, personalised products and social commerce (Facebook and Instagram Shops).',
    links: [
      { label: 'Industries', href: '/industries' },
      { label: 'Work', href: '/work' },
    ],
    source: 'Industries · portfolio',
  },
  {
    id: 'builders',
    keywords: ['gempages', 'pagefly', 'shogun', 'builder', 'builders', 'landing', 'page'],
    answer:
      'Landing and product pages are built in GemPages, PageFly, Shogun or native theme sections — usually whichever your team already uses.',
    links: [
      { label: 'GemPages', href: '/services/gempages' },
      { label: 'PageFly', href: '/services/pagefly' },
    ],
    source: 'Services · page builders',
  },
  {
    id: 'contact',
    keywords: ['contact', 'hire', 'email', 'reach', 'message', 'talk', 'call', 'book', 'touch'],
    answer: 'The fastest route is the project brief form. Fiverr messaging is the verified alternative.',
    links: [
      { label: 'Start a project', href: '/contact' },
      { label: 'Fiverr profile', href: 'https://www.fiverr.com/ringlot465' },
    ],
    source: 'Contact',
  },
  {
    id: 'location',
    keywords: ['location', 'based', 'country', 'where', 'timezone', 'bangladesh', 'remote'],
    answer: 'Ring Lot is based in Bangladesh and works remotely with clients internationally, in English.',
    links: [{ label: 'About', href: '/about' }],
    source: 'Identity · country-level only',
  },
]

export const FALLBACK_ANSWER: KnowledgeEntry = {
  id: 'fallback',
  keywords: [],
  answer:
    'I don’t have an approved answer for that. I only answer from information published on this site — the project brief form is the best way to ask Ring Lot directly.',
  links: [{ label: 'Start a project', href: '/contact' }],
  source: 'No approved answer',
}

export const SUGGESTED_QUESTIONS = [
  'What does Ring Lot do?',
  'Can you fix my Meta Pixel tracking?',
  'GemPages or PageFly?',
  'How does a project work?',
  'How much does it cost?',
]

export function answerQuestion(question: string): KnowledgeEntry {
  const tokens = tokenize(question)
  if (tokens.length === 0) return FALLBACK_ANSWER

  let best: { entry: KnowledgeEntry; score: number } | null = null
  for (const entry of knowledgeBase) {
    const keywords = new Set(entry.keywords)
    let score = 0
    for (const token of tokens) {
      if (keywords.has(token)) score += 2
      else if (token.length > 4 && entry.keywords.some((keyword) => keyword.startsWith(token) || token.startsWith(keyword))) score += 1
    }
    // Specific service entries beat generic ones on ties.
    if (score > 0 && entry.id.startsWith('service-')) score += 0.5
    if (!best || score > best.score) best = { entry, score }
  }
  return best && best.score >= 2 ? best.entry : FALLBACK_ANSWER
}
