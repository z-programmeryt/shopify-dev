import { LinkButton, PageHero } from '@/components/ui/primitives'
import { ProcessJourney } from '@/components/process/ProcessJourney'
import { processSteps } from '@/data/process'
import { nextSteps } from '@/data/professional'
import { ctas } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/process' })

export default function ProcessPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Process', path: '/process' }]}
        label="Process"
        title="Discover → Diagnose → Strategize → Design → Build → Optimize → Launch."
        intro="Each step has a clear output, and each moves one layer of the Commerce Engine forward. Scroll to watch the engine come together."
      />
      <section className="section-y">
        <div className="container-x">
          <ProcessJourney steps={processSteps} />
        </div>
      </section>
      <section className="border-t border-line bg-white">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="text-h3 text-ink">Before step one</h2>
            <p className="mt-3 text-muted">What happens after you send a brief.</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {nextSteps.map((item, index) => (
              <li key={item.title} className="rounded-lg border border-line p-5">
                <p className="label-mono text-emerald-700">{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-2 font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="container-x flex justify-center pb-20">
          <LinkButton href={ctas.primary.href} cursor="start" track="cta_click" trackLabel="process_start_project">
            {ctas.primary.label}
          </LinkButton>
        </div>
      </section>
    </>
  )
}
