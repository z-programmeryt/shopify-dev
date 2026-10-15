import Link from 'next/link'
import { LinkButton, PageHero, ProofBadge, SectionHeader, SourceLink } from '@/components/ui/primitives'
import { RatingBreakdown } from '@/components/proof/RatingBreakdown'
import { ReviewCard } from '@/components/proof/ReviewCard'
import { proofFacts, reviewCountries, serviceRecord, type ProofLevel } from '@/data/professional'
import { projects } from '@/data/projects'
import { testimonials } from '@/data/testimonials'
import { siteConfig } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'
import { countryFlag, formatDate } from '@/lib/utils'

export const metadata = buildMetadata({ path: '/proof' })

const LEVELS: { level: ProofLevel; meaning: string }[] = [
  { level: 'DIRECT', meaning: 'Observable on this site itself (for example, the site’s own code and measured performance).' },
  { level: 'VERIFIED', meaning: 'Computed or issued by a platform — ratings, levels, membership dates — and checked against the source.' },
  { level: 'CORROBORATED', meaning: 'Self-reported by Ring Lot and backed by independent client reviews.' },
  { level: 'CLAIM', meaning: 'Self-reported and not independently confirmed. Labelled as such wherever it appears.' },
]

export default function ProofPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Proof', path: '/proof' }]}
        label="Proof engine"
        title="Every claim on this site has a source."
        intro={`Platform-verified figures, verbatim client reviews and self-reported portfolio records — each labelled with how far it can be trusted. Last verified ${formatDate(siteConfig.lastVerified)}.`}
      />

      <section className="section-y pt-14">
        <div className="container-x">
          <SectionHeader index="01" label="Verified record" title="What the platform says." />
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {proofFacts.map((fact) => (
              <div key={fact.id} className="flex flex-col justify-between gap-5 bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="label-mono text-subtle">{fact.label}</p>
                  <ProofBadge level={fact.level} />
                </div>
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-ink">{fact.value}</p>
                  <p className="mt-1.5 text-sm text-muted">{fact.detail}</p>
                </div>
                <SourceLink href={fact.sourceUrl} label={fact.sourceLabel} />
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <RatingBreakdown />
              <p className="mt-6 text-sm text-muted">The full distribution is shown — including the lower ratings — exactly as Fiverr publishes it.</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <p className="label-mono text-subtle">By service (Fiverr gig ratings)</p>
              <table className="mt-4 w-full text-sm">
                <thead className="sr-only">
                  <tr>
                    <th>Service</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {serviceRecord.map((row) => (
                    <tr key={row.service}>
                      <td className="py-3">
                        <Link href={`/services/${row.serviceSlug}`} className="text-ink hover:text-emerald-700">
                          {row.service}
                        </Link>
                      </td>
                      <td className="py-3 text-right font-medium tabular-nums text-ink">{row.rating.toFixed(1)}</td>
                      <td className="py-3 text-right tabular-nums text-muted">{row.reviews} reviews</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="label-mono mt-8 text-subtle">Reviewed by clients in</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {reviewCountries.map((country) => (
                  <li key={country.code} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                    <span aria-hidden="true">{countryFlag(country.code)} </span>
                    {country.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader index="02" label="Client voice" title="Verbatim reviews." intro="Unedited, with service, price band and duration. Buyer usernames are withheld for privacy." />
            <LinkButton href="/reviews" variant="secondary" cursor="verify">
              All {testimonials.length} collected reviews
            </LinkButton>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((review) => (
              <ReviewCard key={review.id} review={review} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader index="03" label="Portfolio records" title={`${projects.length} self-reported records.`} />
            <p className="mt-5 text-muted">
              Portfolio entries come from Ring Lot’s own Fiverr portfolio. They are shown with a confidence level, without client screenshots or live links until
              permission and attribution are confirmed.
            </p>
            <div className="mt-6">
              <LinkButton href="/work" variant="secondary" cursor="explore">
                See the records
              </LinkButton>
            </div>
          </div>
          <div>
            <SectionHeader index="04" label="Method" title="How proof is labelled." />
            <dl className="mt-8 space-y-5">
              {LEVELS.map((item) => (
                <div key={item.level} className="grid grid-cols-[9rem_1fr] gap-4">
                  <dt>
                    <ProofBadge level={item.level} />
                  </dt>
                  <dd className="text-[0.95rem] text-muted">{item.meaning}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 rounded-lg border border-line bg-white p-5 text-[0.95rem] text-muted">
              This site does not publish client counts, project counts, revenue figures or years of experience, because none of them can currently be verified
              against a source. They will appear only when they can.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
