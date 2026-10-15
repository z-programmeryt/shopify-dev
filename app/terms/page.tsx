import { PageHero } from '@/components/ui/primitives'
import { siteConfig } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const metadata = buildMetadata({ path: '/terms' })

export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Terms', path: '/terms' }]} label="Terms" title="Terms of use." />
      <section className="section-y pt-12">
        <div className="container-x prose-rl max-w-3xl">
          <p>Last updated {formatDate(siteConfig.lastVerified)}.</p>
          <h2 id="information">Information on this site</h2>
          <p>
            Platform figures (ratings, levels, dates) are shown as verified on the stated date and may have changed since. Portfolio records are self-reported
            entries from Ring Lot’s Fiverr portfolio and are labelled with a confidence level. Client names appear as published there; no affiliation with or
            endorsement by similarly named brands is implied.
          </p>
          <h2 id="demos">Demos</h2>
          <p>
            The Lab contains demonstrations built on fictional data (for example the “Northline Supply Co.” teardown) and experiment designs. They are not client
            work and do not report results.
          </p>
          <h2 id="engagements">Project engagements</h2>
          <p>
            Nothing on this site is an offer or a quote. Scope, timeline, price and terms for any project are agreed separately in writing before work begins. No
            outcome — such as a conversion rate, revenue or ranking — is promised.
          </p>
          <h2 id="ip">Content</h2>
          <p>Site text, design and the Commerce Engine visuals are original work for this site. Third-party trademarks belong to their owners.</p>
          <h2 id="liability">Liability</h2>
          <p>Articles and notes are general information, not professional advice for your specific store. Check changes against your own setup before applying them.</p>
        </div>
      </section>
    </>
  )
}
