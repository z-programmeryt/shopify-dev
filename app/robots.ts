import type { MetadataRoute } from 'next'
import { absoluteUrl, siteConfig } from '@/data/site-config'

/** Production: crawlable (API and brand kit excluded). Any other environment: blocked entirely. */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.isIndexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/brand'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  }
}
