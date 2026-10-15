import Link from 'next/link'
import { Wordmark } from './Logo'
import { NavLinks } from './NavLinks'
import { MobileNav } from './MobileNav'
import { ctas, primaryNav, secondaryNav } from '@/data/site-config'

export function Header() {
  return (
    <header
      data-site-header
      className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line/80 bg-paper/95 supports-[backdrop-filter]:bg-paper/85 supports-[backdrop-filter]:backdrop-blur-md"
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" className="rounded-md" aria-label="Ring Lot Morong — home">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks items={primaryNav} />
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={ctas.primary.href}
            data-track="cta_click"
            data-track-label="header_start_project"
            data-cursor="start"
            className="hidden rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-[var(--dur-micro)] hover:bg-navy-700 sm:inline-flex"
          >
            {ctas.primary.label}
          </Link>
          <MobileNav primary={primaryNav} secondary={secondaryNav} />
        </div>
      </div>
    </header>
  )
}
