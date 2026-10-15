/**
 * JSON-LD builders. Policy (docs/ENTITY-SEO.md):
 *  - Structured data only describes information visible on the page.
 *  - No AggregateRating / Review markup: the reviews live on Fiverr and self-serving review
 *    markup is not eligible — showing them as text with a source link is the honest option.
 *  - No FAQPage markup: Google deprecated the FAQ rich result (May 2026) and removed its docs (June 2026).
 *  - `sameAs` contains verified profiles only (data/social-profiles.ts → showPublicly).
 */
import { identity } from '@/data/identity'
import { positioning } from '@/data/professional'
import { publicProfiles } from '@/data/social-profiles'
import { absoluteUrl, siteConfig } from '@/data/site-config'
import type { Service } from '@/data/services'
import type { Article } from '@/data/articles'

type JsonLd = Record<string, unknown>

export const PERSON_ID = `${siteConfig.url}/#person`
export const WEBSITE_ID = `${siteConfig.url}/#website`

export function personSchema(): JsonLd {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: identity.name,
    givenName: identity.givenName,
    familyName: identity.familyName,
    alternateName: [...identity.alternateNames],
    jobTitle: identity.jobTitle,
    description: positioning.summary,
    url: siteConfig.url,
    ...(identity.photo ? { image: absoluteUrl(identity.photo.src) } : {}),
    sameAs: publicProfiles.map((profile) => profile.url),
    knowsLanguage: identity.languages.map((language) => language.code),
    address: { '@type': 'PostalAddress', addressCountry: identity.countryCode },
    knowsAbout: [
      'Shopify',
      'Shopify theme customization',
      'E-commerce website design',
      'Landing page design',
      'GemPages',
      'PageFly',
      'Conversion rate optimization',
      'Meta Pixel',
      'Meta Conversions API',
      'Google Analytics 4',
      'Google Tag Manager',
    ],
  }
}

export function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: positioning.summary,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

export function profilePageSchema(path: string, dateModified: string): JsonLd {
  return {
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl(path)}#profile`,
    url: absoluteUrl(path),
    name: `About ${identity.name}`,
    dateModified,
    mainEntity: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function serviceSchema(service: Service): JsonLd {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': PERSON_ID },
    areaServed: 'Worldwide',
  }
}

export function articleSchema(article: Article): JsonLd {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: absoluteUrl(`/insights/${article.slug}`),
    datePublished: article.reviewedOn ?? article.drafted,
    dateModified: article.reviewedOn ?? article.drafted,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
  }
}

/** Wrap one or more nodes in a single @graph document. */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/** Serialise safely for a <script type="application/ld+json"> tag (escape "<" per Next.js guidance). */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
