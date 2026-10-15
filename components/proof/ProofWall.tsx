import { LinkButton, ProofBadge, SectionHeader, SourceLink } from '@/components/ui/primitives'
import { ReviewCard } from './ReviewCard'
import { RatingBreakdown } from './RatingBreakdown'
import { proofFacts, reviewCountries } from '@/data/professional'
import { testimonials } from '@/data/testimonials'
import { countryFlag } from '@/lib/utils'

/** "Proof, not promises" (brief §13) — every item has a source and a proof level. */
export function ProofWall() {
  const featured = testimonials.filter((item) => item.featured).slice(0, 3)
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white" aria-labelledby="proof-heading">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x section-y relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            tone="dark"
            index="02"
            label="Proof, not promises"
            title={<span id="proof-heading">Numbers you can check. Words clients actually wrote.</span>}
            intro="No inflated counts, no revenue claims. Only platform-verified figures and verbatim reviews — each linked to where it lives."
          />
          <LinkButton href="/proof" variant="onDarkSecondary" cursor="verify" track="cta_click" trackLabel="proofwall_all_proof">
            All proof & sources
          </LinkButton>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {proofFacts.map((fact) => (
            <div key={fact.id} className="flex flex-col justify-between gap-6 bg-navy-900 p-6">
              <div className="flex items-center justify-between">
                <p className="label-mono text-silver-500">{fact.label}</p>
                <ProofBadge level={fact.level} tone="dark" />
              </div>
              <div>
                <p className="text-4xl font-semibold tracking-tight">{fact.value}</p>
                <p className="mt-2 text-sm text-silver-300">{fact.detail}</p>
              </div>
              <SourceLink href={fact.sourceUrl} label={fact.sourceLabel} tone="dark" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_2.2fr]">
          <div className="rounded-xl border border-white/10 bg-navy-850 p-6" data-reveal>
            <RatingBreakdown tone="dark" />
            <p className="label-mono mt-8 text-silver-500">Reviewed by clients in</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {reviewCountries.map((country) => (
                <li key={country.code} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-silver-300">
                  <span aria-hidden="true">{countryFlag(country.code)} </span>
                  {country.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((review, index) => (
              <div key={review.id} data-reveal style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}>
                <ReviewCard review={review} tone="dark" compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
