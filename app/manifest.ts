import type { MetadataRoute } from 'next'
import { positioning } from '@/data/professional'
import { siteConfig } from '@/data/site-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${positioning.title}`,
    short_name: siteConfig.shortName,
    description: positioning.summary,
    start_url: '/',
    display: 'browser',
    background_color: '#F7F6F2',
    theme_color: siteConfig.themeColor,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
