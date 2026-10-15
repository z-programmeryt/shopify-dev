import Link from 'next/link'
import { LinkButton, PageHero, ProofBadge, SectionHeader, SourceLink } from '@/components/ui/primitives'
import { JsonLd } from '@/components/ui/JsonLd'
import { LogoMark } from '@/components/layout/Logo'
import { identity } from '@/data/identity'
import { fit, positioning, principles, proofFacts } from '@/data/professional'
import { identityNodes } from '@/data/social-profiles'
import { ctas, siteConfig } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'
import { graph, profilePageSchema } from '@/lib/schema'
import { formatDate } from '@/lib/utils'

export const metadata = buildMetadata({ path: '/about', type: 'profile' })

/** About — structured answers, not an autobiography (brief §44). */
export default function AboutPage() {
  const verified = identityNodes.filter((node) => node.status === 'verified')
  return (
    <>
      <PageHero
        crumbs={[{ name: 'About', path: '/about' }]}
        label="About"
        title={
          <>
            {identity.name}.{' '}
            <span className="font-serif font-normal italic text-emerald-700">Shopify developer &amp; designer.</span>
          </>
        }
        intro={positioning.intro}
      />

      <section className="section-y">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
              <div className="grid-lines relative flex aspect-[4/3] items-center justify-center bg-navy-900">
                {/* Monogram treatment until an owner-approved photo exists (data/identity.ts → photo). */}
                <LogoMark className="h-24 w-24" tone="light" />
                <span className="label-mono absolute bottom-3 left-4 text-[0.55rem] text-silver-500">Monogram · photo pending owner approval</span>
              </div>
              <dl className="divide-y divide-line text-sm">
                {[
                  ['Role', identity.jobTitle],
                  ['Based in', identity.countryName],
                  ['Works in', identity.languages.map((language) => language.name).join(' & ')],
                  ['Works with', 'Brands and agencies internationally, remotely'],
                ].map(([term, value]) => (
                  <div key={term} className="grid grid-cols-[7rem_1fr] gap-4 px-5 py-3.5">
                    <dt className="text-muted">{term}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          <div className="space-y-20">
            <div>
              <SectionHeader index="01" label="What he specialises in" title="Three things, done together." />
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {[
                  { title: 'Stores', body: 'Shopify builds and redesigns — themes, templates, apps and launch configuration.', href: '/services/shopify-development' },
                  { title: 'Pages', body: 'Product and landing pages in GemPages, PageFly, Shogun or theme sections.', href: '/services/shopify-landing-pages' },
                  { title: 'Tracking', body: 'Meta Pixel + Conversions API, GA4 and GTM, deduplicated and verified.', href: '/services/conversion-tracking' },
                ].map(({ title, body, href }) => (
                  <Link key={title} href={href} data-cursor="explore" className="rounded-lg border border-line bg-white p-5 transition-colors hover:border-emerald-600" data-reveal>
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-2 text-sm text-muted">{body}</p>
                  </Link>
                ))}
              </div>
              <p className="mt-6 text-muted">{positioning.differentiator}</p>
            </div>

            <div>
              <SectionHeader index="02" label="How he works" title="Principles that shape every project." />
              <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {principles.map((principle) => (
                  <li key={principle.title} data-reveal>
                    <p className="font-semibold text-ink">{principle.title}</p>
                    <p className="mt-2 text-muted">{principle.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader index="03" label="Who he works with" title="Founders, growing brands and agencies." />
              <ul className="mt-8 space-y-4">
                {fit.map((item) => (
                  <li key={item.title} className="border-l-2 border-emerald-600 pl-5">
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader
                index="04"
                label="Why trust him"
                title="A public record — not adjectives."
                intro={`Every figure below is computed by the platform, not written by Ring Lot. Verified ${formatDate(siteConfig.lastVerified)}.`}
              />
              <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                {proofFacts.map((fact) => (
                  <div key={fact.id} className="bg-white p-5">
                    <div className="flex items-center justify-between">
                      <p className="label-mono text-subtle">{fact.label}</p>
                      <ProofBadge level={fact.level} />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{fact.value}</p>
                    <p className="mt-1 text-sm text-muted">{fact.detail}</p>
                    <div className="mt-3">
                      <SourceLink href={fact.sourceUrl} label={fact.sourceLabel} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader index="05" label="Verified profiles" title="Where to find him." />
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {verified.map((node) => (
                  <li key={node.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-semibold text-ink">{node.platform}</p>
                      <p className="text-sm text-muted">{node.purpose}</p>
                    </div>
                    <a href={node.url ?? '#'} target="_blank" rel="me noopener" data-track="social_click" data-track-label={node.id} data-cursor="verify" className="text-sm font-medium text-emerald-700 underline underline-offset-4">
                      @{node.username} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                Only profiles confirmed to belong to Ring Lot are listed. More will appear here once verified — see{' '}
                <Link href="/links" className="underline underline-offset-4">
                  Links
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LinkButton href={ctas.primary.href} cursor="start" track="cta_click" trackLabel="about_start_project">
                {ctas.primary.label}
              </LinkButton>
              <LinkButton href="/resume" variant="secondary" track="resume_download" trackLabel="about_resume">
                View résumé
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={graph(profilePageSchema('/about', siteConfig.lastVerified))} />
    </>
  )
}
