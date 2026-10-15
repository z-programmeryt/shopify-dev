import { LinkButton, Notice, PageHero, SectionHeader } from '@/components/ui/primitives'
import { StoreTeardown } from '@/components/lab/StoreTeardown'
import { CroLab } from '@/components/lab/CroLab'
import { croExperiments, teardownHotspots, teardownStore } from '@/data/lab'
import { ctas } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/lab' })

export default function LabPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Lab', path: '/lab' }]}
        label="Lab"
        title="How the thinking works — on demo data."
        intro="A teardown of a fictional product page and a set of conversion experiment designs. Useful for seeing the method before hiring it; never presented as client results."
      />

      <section id="teardown" className="section-y scroll-mt-20 pt-14">
        <div className="container-x">
          <SectionHeader
            index="01"
            label="Store teardown · demo"
            title={`${teardownStore.name}: one product page, ${teardownHotspots.length} findings.`}
            intro="Select a marker to see the issue, why it matters, the recommendation, the expected effect and how it would be measured."
          />
          <div className="mt-8">
            <Notice title={teardownStore.label} tone="draft">
              {teardownStore.note} When reviewing a real store that is not a client, the output is labelled “Independent UX/CRO analysis”.
            </Notice>
          </div>
          <div className="mt-10">
            <StoreTeardown hotspots={teardownHotspots} storeName={teardownStore.name} product={teardownStore.product} />
          </div>
        </div>
      </section>

      <section id="cro-lab" className="section-y scroll-mt-20 bg-navy-950">
        <div className="container-x">
          <SectionHeader
            tone="dark"
            index="02"
            label="CRO Lab · experiment designs"
            title="What → Why → Expected effect → Measure."
            intro="Each experiment is a hypothesis with the metric that would confirm or reject it. Toggle the demos to compare before and after."
          />
          <div className="mt-12">
            <CroLab experiments={croExperiments} />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-h3 text-ink">Want this for your real store?</h2>
            <p className="mt-2 text-muted">A store review applies the same method to your pages and your data.</p>
          </div>
          <LinkButton href={ctas.contextual.href} cursor="start" track="cta_click" trackLabel="lab_store_review">
            {ctas.contextual.label}
          </LinkButton>
        </div>
      </section>
    </>
  )
}
