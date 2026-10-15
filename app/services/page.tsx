import Link from 'next/link'
import { LinkButton, PageHero } from '@/components/ui/primitives'
import { engineLayers } from '@/data/engine'
import { serviceRecord } from '@/data/professional'
import { services } from '@/data/services'
import { ctas } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/services' })

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Services', path: '/services' }]}
        label="Services"
        title="Organised by what you are trying to do."
        intro="Each service maps to a layer of the Commerce Engine and lists its own evidence. No prices or turnaround promises here — those depend on scope and are agreed per project."
      />

      <section className="section-y">
        <div className="container-x space-y-16">
          {engineLayers.map((layer) => {
            const layerServices = services.filter((service) => service.engineLayer === layer.id)
            if (layerServices.length === 0) return null
            return (
              <div key={layer.id} className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[0.8fr_2fr]" data-reveal>
                <div>
                  <p className="label-mono text-emerald-700">
                    {String(layer.index + 1).padStart(2, '0')} · {layer.label}
                  </p>
                  <p className="mt-3 max-w-xs text-muted">{layer.title}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {layerServices.map((service) => {
                    const record = serviceRecord.find((item) => item.serviceSlug === service.slug)
                    return (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        data-cursor="explore"
                        className="group flex flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
                      >
                        <h2 className="text-xl font-semibold tracking-tight text-ink group-hover:text-emerald-700">{service.name}</h2>
                        <p className="mt-2 text-[0.95rem] text-muted">{service.summary}</p>
                        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
                          <span className="text-subtle">
                            {record ? `Fiverr: ${record.rating.toFixed(1)} from ${record.reviews} reviews` : `${service.evidence.claimIds.length} evidence sources`}
                          </span>
                          <span aria-hidden="true" className="text-ink transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-h3 text-ink">Not sure which service fits?</h2>
            <p className="mt-2 text-muted">Describe the problem instead — the brief form adapts to what you need.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={ctas.primary.href} cursor="start" track="cta_click" trackLabel="services_start_project">
              {ctas.primary.label}
            </LinkButton>
            <LinkButton href={ctas.contextual.href} variant="secondary" cursor="start" track="cta_click" trackLabel="services_store_review">
              {ctas.contextual.label}
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  )
}
