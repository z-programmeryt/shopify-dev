import Link from 'next/link'
import type { Metadata } from 'next'
import { EngineFallback } from '@/components/engine/EngineFallback'

export const metadata: Metadata = {
  title: 'Route unavailable',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="grid-lines-light">
      <div className="container-x grid min-h-[calc(100dvh-var(--header-h))] items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="label-mono text-emerald-700">404 · Route not found</p>
          <h1 className="text-h1 mt-5 text-ink">This storefront route is unavailable.</h1>
          <p className="text-lead mt-5 max-w-md text-muted">The page may have moved, or the link may be mistyped. These routes are live:</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {[
              { href: '/', label: 'Home' },
              { href: '/work', label: 'Work' },
              { href: '/services', label: 'Services' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-5 py-2.5 font-medium text-ink hover:border-ink">
                  {link.label} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden overflow-hidden rounded-xl bg-navy-900 p-8 lg:block">
          <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
          <EngineFallback active={null} spread={1} animated={false} className="relative h-[480px] w-full opacity-60" />
          <p className="label-mono absolute bottom-5 left-6 text-silver-500">Engine · route missing</p>
        </div>
      </div>
    </section>
  )
}
