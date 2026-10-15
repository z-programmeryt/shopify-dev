import type { MetadataRoute } from 'next'
import { articles, isPublished } from '@/data/articles'
import { caseStudies } from '@/data/case-studies'
import { routeSeo } from '@/data/seo'
import { services } from '@/data/services'
import { absoluteUrl, siteConfig } from '@/data/site-config'

/**
 * Sitemap of indexable URLs only. Excluded: case files and draft articles (noindex), the brand kit,
 * API routes and the PDF. Non-production deployments return an empty sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexable) return []
  const lastModified = new Date(`${siteConfig.lastVerified}T00:00:00Z`)

  const staticRoutes = Object.keys(routeSeo).map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: (path === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '/' ? 1 : path === '/services' || path === '/work' || path === '/contact' ? 0.8 : 0.6,
  }))

  const serviceRoutes = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const caseRoutes = caseStudies
    .filter((study) => study.status === 'published')
    .map((study) => ({ url: absoluteUrl(`/case-studies/${study.slug}`), lastModified: new Date(`${study.lastReviewed}T00:00:00Z`), priority: 0.7 }))

  const articleRoutes = articles
    .filter(isPublished)
    .map((article) => ({ url: absoluteUrl(`/insights/${article.slug}`), lastModified: new Date(`${article.reviewedOn ?? article.drafted}T00:00:00Z`), priority: 0.6 }))

  return [...staticRoutes, ...serviceRoutes, ...caseRoutes, ...articleRoutes]
}
