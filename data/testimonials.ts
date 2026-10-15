/**
 * TESTIMONIALS — verbatim public Fiverr reviews (TL-017).
 * Collected 2026-10-15. Spelling is preserved as written by the client.
 * Buyer usernames are intentionally not stored or shown (privacy).
 * `when` is the relative date Fiverr displayed on the verification date.
 */

export type GigKey = 'store-build' | 'tracking' | 'website-build' | 'landing-pages'

export interface Testimonial {
  id: string
  quote: string
  rating: number
  country: string
  countryCode: string
  when: string
  priceBand: string
  duration: string
  gig: GigKey
  serviceSlug: string
  ongoing: boolean
  sourceUrl: string
  claimId: 'TL-017'
  featured?: boolean
}

export const gigs: Record<GigKey, { label: string; url: string }> = {
  'store-build': {
    label: 'Shopify store build',
    url: 'https://www.fiverr.com/ringlot465/create-branded-shopify-dropshipping-store-or-shopify-website',
  },
  tracking: {
    label: 'Meta Pixel, CAPI & GA4 tracking',
    url: 'https://www.fiverr.com/ringlot465/fix-facebook-business-manager-and-setup-fb-pixel-events',
  },
  'website-build': {
    label: 'Shopify website build',
    url: 'https://www.fiverr.com/ringlot465/build-a-modern-design-shopify-website-or-design-ecommerce-shopify-store',
  },
  'landing-pages': {
    label: 'Product & landing pages',
    url: 'https://www.fiverr.com/ringlot465/design-shopify-product-landing-page-shopify-landing-page-using-gempage-pagefly',
  },
}

const t = (x: Omit<Testimonial, 'claimId' | 'sourceUrl'>): Testimonial => ({
  ...x,
  claimId: 'TL-017',
  sourceUrl: gigs[x.gig].url,
})

export const testimonials: Testimonial[] = [
  t({
    id: 't04',
    quote:
      "Ecom R truly impressed with their professionalism and CODE expertise in website development, leaving no stone unturned from documentation to delivery. Their quick responsiveness and polite demeanor made collaboration a breeze, showcasing why they're a top choice in the field. HIGHLY recommend working with them!",
    rating: 5,
    country: 'United Arab Emirates',
    countryCode: 'AE',
    when: '1 year ago',
    priceBand: '$600–$800',
    duration: '8 weeks',
    gig: 'website-build',
    serviceSlug: 'shopify-development',
    ongoing: true,
    featured: true,
  }),
  t({
    id: 't05',
    quote:
      'Everytime i work with him, it just flows. He always goes above and beyond, he truly cares for his customers. I am so please with thhe end result and how fast he delivered the work.',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '1 year ago',
    priceBand: '$50',
    duration: '3 days',
    gig: 'store-build',
    serviceSlug: 'shopify-development',
    ongoing: true,
    featured: true,
  }),
  t({
    id: 't08',
    quote:
      'Ecom R is an absolute pro in Social Media Marketing! Their ATTENTION TO DETAILS and depth of data were impressive, and working with them was a breeze thanks to their proactive communication and language fluency. Highly recommend for a top-notch experience!',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '1 year ago',
    priceBand: '$100–$200',
    duration: '4 days',
    gig: 'tracking',
    serviceSlug: 'conversion-tracking',
    ongoing: true,
    featured: true,
  }),
  t({
    id: 't14',
    quote:
      'He is easy going and great to work with. I highly recommend working with him if you are just starting out on shopify',
    rating: 5,
    country: 'Canada',
    countryCode: 'CA',
    when: '1 year ago',
    priceBand: '$50–$100',
    duration: '6 days',
    gig: 'landing-pages',
    serviceSlug: 'shopify-landing-pages',
    ongoing: true,
    featured: true,
  }),
  t({
    id: 't12',
    quote:
      'Thank you so much for your flexibility and ability to make an amazing website a few days earlier than the deadline! Great job!',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '1 year ago',
    priceBand: '$50–$100',
    duration: '5 days',
    gig: 'landing-pages',
    serviceSlug: 'shopify-landing-pages',
    ongoing: true,
  }),
  t({
    id: 't01',
    quote: 'Always a pleasure! I have done so many projects with him!',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '9 months ago',
    priceBand: '$200–$400',
    duration: '2 days',
    gig: 'store-build',
    serviceSlug: 'shopify-development',
    ongoing: true,
  }),
  t({
    id: 't10',
    quote:
      'This team work very hard to complete my project. Because of our language barriers, they worked twice as hard to becuase they misunderstood saying I wanted, they apologized and quickly corrected it. I look forward in continuing working with this on this project and others.',
    rating: 4.7,
    country: 'United States',
    countryCode: 'US',
    when: '2 years ago',
    priceBand: '$400–$600',
    duration: '3 weeks',
    gig: 'website-build',
    serviceSlug: 'shopify-design',
    ongoing: false,
  }),
  t({
    id: 't07',
    quote: 'Amazing service and quality person. Helped me set everything up nice.',
    rating: 5,
    country: 'United Arab Emirates',
    countryCode: 'AE',
    when: '1 year ago',
    priceBand: '$50',
    duration: '1 day',
    gig: 'tracking',
    serviceSlug: 'conversion-tracking',
    ongoing: false,
  }),
  t({
    id: 't02',
    quote: 'I really do appreciate you ringlot! Highly recommend him!',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '1 year ago',
    priceBand: '$50–$100',
    duration: '2 days',
    gig: 'store-build',
    serviceSlug: 'shopify-development',
    ongoing: true,
  }),
  t({
    id: 't13',
    quote: 'great guy super professional!',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '1 year ago',
    priceBand: '$400–$600',
    duration: '8 days',
    gig: 'landing-pages',
    serviceSlug: 'shopify-landing-pages',
    ongoing: true,
  }),
  t({
    id: 't11',
    quote: 'THE SELLER PROVIDED EXCELLENT SERVICE AND ATTENTION TO DETAILS.',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '2 years ago',
    priceBand: '$50–$100',
    duration: '4 days',
    gig: 'website-build',
    serviceSlug: 'shopify-design',
    ongoing: false,
  }),
  t({
    id: 't09',
    quote: 'Very good work and fast',
    rating: 5,
    country: 'Mauritania',
    countryCode: 'MR',
    when: '1 year ago',
    priceBand: '$50',
    duration: '2 days',
    gig: 'tracking',
    serviceSlug: 'conversion-tracking',
    ongoing: true,
  }),
  t({
    id: 't03',
    quote: 'Amazing work',
    rating: 5,
    country: 'Morocco',
    countryCode: 'MA',
    when: '1 year ago',
    priceBand: '$100–$200',
    duration: '1 day',
    gig: 'tracking',
    serviceSlug: 'conversion-tracking',
    ongoing: false,
  }),
  t({
    id: 't06',
    quote: 'Very good. Timing',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '1 year ago',
    priceBand: '$100–$200',
    duration: '5 days',
    gig: 'tracking',
    serviceSlug: 'conversion-tracking',
    ongoing: true,
  }),
  t({
    id: 't15',
    quote: 'Great job again',
    rating: 5,
    country: 'United States',
    countryCode: 'US',
    when: '2 years ago',
    priceBand: '$50',
    duration: '11 days',
    gig: 'landing-pages',
    serviceSlug: 'shopify-landing-pages',
    ongoing: true,
  }),
]

export function getTestimonial(id: string): Testimonial | undefined {
  return testimonials.find((item) => item.id === id)
}
