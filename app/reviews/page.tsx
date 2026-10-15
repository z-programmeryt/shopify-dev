import { PageHero, SourceLink } from '@/components/ui/primitives'
import { RatingBreakdown } from '@/components/proof/RatingBreakdown'
import { ReviewCard } from '@/components/proof/ReviewCard'
import { ReviewsExplorer } from '@/components/proof/ReviewsExplorer'
import { gigs, testimonials } from '@/data/testimonials'
import { siteConfig } from '@/data/site-config'
import { reviewStats } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const metadata = buildMetadata({ path: '/reviews' })

export default function ReviewsPage() {
  const stats = reviewStats()
  const gigFacets = (Object.keys(gigs) as (keyof typeof gigs)[])
    .map((id) => ({ id, label: gigs[id].label, count: testimonials.filter((item) => item.gig === id).length }))
    .filter((facet) => facet.count > 0)

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Reviews', path: '/reviews' }]}
        label="Reviews"
        title="What clients wrote — unedited."
        intro={`${stats.collected} public reviews collected from Fiverr on ${formatDate(siteConfig.lastVerified)}, quoted verbatim (spelling included). ${stats.ongoing} of them are marked “Ongoing collaboration” — returning clients.`}
      />
      <section className="section-y pt-14">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_2.2fr]">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <RatingBreakdown />
              <div className="mt-6">
                <SourceLink href="https://www.fiverr.com/ringlot465" label="Fiverr profile" />
              </div>
            </div>
            <p className="text-sm text-muted">
              Reviews are shown as text with a source link rather than as star markup for search engines: they live on Fiverr, and marking them up here would
              not be appropriate.
            </p>
          </aside>
          <ReviewsExplorer
            gigs={gigFacets}
            items={testimonials.map((review) => ({
              id: review.id,
              gig: review.gig,
              gigLabel: gigs[review.gig].label,
              node: <ReviewCard review={review} />,
            }))}
          />
        </div>
      </section>
    </>
  )
}
