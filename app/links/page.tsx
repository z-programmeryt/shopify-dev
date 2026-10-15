import Link from 'next/link'
import { LogoMark } from '@/components/layout/Logo'
import { identity } from '@/data/identity'
import { positioning } from '@/data/professional'
import { publicProfiles } from '@/data/social-profiles'
import { ctas } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/links' })

/** Link hub (brief §57) — only verified destinations. */
export default function LinksPage() {
  const links: { label: string; description: string; href: string; external?: boolean; track: string }[] = [
    { label: ctas.primary.label, description: 'Send a short project brief', href: ctas.primary.href, track: 'cta_click' },
    { label: 'Explore the work', description: 'Portfolio records and case files', href: '/work', track: 'cta_click' },
    { label: 'Services', description: 'Stores, landing pages, CRO and tracking', href: '/services', track: 'cta_click' },
    { label: 'Proof & reviews', description: 'Verified record with sources', href: '/proof', track: 'cta_click' },
    { label: 'Résumé', description: 'Web, print and PDF', href: '/resume', track: 'resume_download' },
    ...publicProfiles.map((profile) => ({
      label: `${profile.platform} profile`,
      description: `@${profile.username} · verified`,
      href: profile.url ?? '#',
      external: true,
      track: 'social_click',
    })),
  ]
  return (
    <section className="grid-lines-light min-h-[calc(100dvh-var(--header-h))] py-16">
      <div className="container-x max-w-xl">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-16 w-16" />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink">{identity.name}</h1>
          <p className="mt-1 text-muted">{positioning.title}</p>
          <p className="mt-4 max-w-sm text-sm text-muted">{positioning.promise}</p>
        </div>
        <ul className="mt-10 space-y-3">
          {links.map((link) => (
            <li key={link.href + link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener"
                  data-track={link.track}
                  data-track-label={link.label}
                  data-cursor="verify"
                  className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 shadow-card transition-shadow hover:shadow-lift"
                >
                  <span>
                    <span className="block font-medium text-ink">{link.label}</span>
                    <span className="block text-sm text-muted">{link.description}</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link
                  href={link.href}
                  data-track={link.track}
                  data-track-label={link.label}
                  className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 shadow-card transition-shadow hover:shadow-lift"
                >
                  <span>
                    <span className="block font-medium text-ink">{link.label}</span>
                    <span className="block text-sm text-muted">{link.description}</span>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-subtle">Only verified profiles are listed. Other profiles are added once confirmed.</p>
      </div>
    </section>
  )
}
