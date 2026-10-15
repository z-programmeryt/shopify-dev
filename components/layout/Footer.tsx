import Link from 'next/link'
import { Wordmark } from './Logo'
import { ctas, legalNav, primaryNav, secondaryNav, siteConfig } from '@/data/site-config'
import { publicProfiles } from '@/data/social-profiles'
import { services } from '@/data/services'
import { formatDate } from '@/lib/utils'

/** Studio-signature footer (brief §52): identity, signature line, verification date. */
export function Footer() {
  return (
    <footer data-site-footer className="relative overflow-hidden bg-navy-950 text-silver-300">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative py-16 md:py-20">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="label-mono text-emerald-400">Signature</p>
            <p className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-4xl">
              Design, build and measure —{' '}
              <span className="font-serif font-normal italic text-emerald-300">every claim with a source.</span>
            </p>
          </div>
          <Link
            href={ctas.primary.href}
            data-track="cta_click"
            data-track-label="footer_start_project"
            data-cursor="start"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-emerald-400 px-6 py-3 font-medium text-navy-950 transition-colors duration-[var(--dur-micro)] hover:bg-emerald-300 md:self-auto"
          >
            {ctas.primary.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Wordmark tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-500">
              Shopify developer &amp; designer. Stores, landing pages and tracking for e-commerce brands.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {publicProfiles.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={profile.url ?? '#'}
                    rel="me noopener"
                    target="_blank"
                    data-track="social_click"
                    data-track-label={profile.id}
                    data-cursor="verify"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white hover:border-emerald-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    {profile.platform} · verified
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title="Explore" items={primaryNav} />
          <FooterColumn title="More" items={secondaryNav} />
          <FooterColumn
            title="Services"
            items={services.slice(0, 6).map((service) => ({ label: service.navLabel, href: `/services/${service.slug}` }))}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-silver-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date(siteConfig.lastVerified).getFullYear()} {siteConfig.name}. Public facts last verified{' '}
            <time dateTime={siteConfig.lastVerified}>{formatDate(siteConfig.lastVerified)}</time>.
          </p>
          <ul className="flex gap-5">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="label-mono text-silver-500">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-silver-300 transition-colors hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
