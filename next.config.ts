import type { NextConfig } from 'next'

/**
 * Security + indexing headers.
 *
 * - CSP is nonce-free on purpose: nonces force every page to render dynamically, which would
 *   throw away static generation (and our TTFB/LCP budget). No user-generated HTML is ever
 *   rendered and JSON-LD is serialised with `<` escaped, so 'unsafe-inline' scripts are an
 *   accepted, documented trade-off (see docs/SECURITY-AUDIT.md).
 * - Non-production deployments are never indexable (X-Robots-Tag + robots.ts).
 */
const isProdBuild = process.env.NODE_ENV === 'production'
const siteEnv = process.env.SITE_ENV ?? process.env.VERCEL_ENV ?? 'development'
const isIndexable = siteEnv === 'production'
const allowEmbedding = process.env.ALLOW_EMBEDDING === 'true'

const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  ? new URL(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? 'https://plausible.io/js/script.js').origin
  : ''

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProdBuild ? '' : " 'unsafe-eval'"}${plausibleSrc ? ` ${plausibleSrc}` : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${plausibleSrc ? ` ${plausibleSrc}` : ''}${isProdBuild ? '' : ' ws: wss:'}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  allowEmbedding ? 'frame-ancestors *' : "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Microphone is allowed for this origin only: the optional voice assistant needs explicit user activation.
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(allowEmbedding ? [] : [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }]),
  ...(isIndexable
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: false,
  allowedDevOrigins: ['*.e2b.app'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/brand/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default nextConfig
