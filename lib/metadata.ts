import type { Metadata } from 'next'
import { routeSeo } from '@/data/seo'
import { absoluteUrl, siteConfig } from '@/data/site-config'

interface BuildMetadataInput {
  path: string
  title?: string
  description?: string
  /** Force noindex regardless of environment (drafts, case files, brand kit). */
  noindex?: boolean
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Single metadata factory for every route. Pulls defaults from data/seo.ts, sets canonical URLs,
 * Open Graph and Twitter data, and robots rules. Non-production environments are always noindex.
 * OG images come from the file-based `opengraph-image` convention (per route where defined).
 */
export function buildMetadata({
  path,
  title,
  description,
  noindex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const defaults = routeSeo[path]
  const resolvedTitle = title ?? defaults?.title ?? siteConfig.name
  const resolvedDescription = description ?? defaults?.description ?? ''
  const canonical = absoluteUrl(path)
  const indexable = siteConfig.isIndexable && !noindex

  return {
    title: defaults?.absolute && !title ? { absolute: resolvedTitle } : resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
      : siteConfig.isIndexable
        ? { index: false, follow: true } // production page deliberately kept out of the index
        : { index: false, follow: false }, // preview/staging: never indexable
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description: resolvedDescription,
      locale: 'en_US',
      ...(type === 'article' && publishedTime ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
    },
  }
}
