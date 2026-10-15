import Link from 'next/link'
import { CommerceEngine } from '@/components/engine/CommerceEngine'
import { EngineScrollDriver } from '@/components/engine/EngineScrollDriver'
import { LinkButton } from '@/components/ui/primitives'
import { engineLayers } from '@/data/engine'
import { positioning, proofFacts } from '@/data/professional'
import { getService } from '@/data/services'
import { ctas, siteConfig } from '@/data/site-config'
import { formatDate } from '@/lib/utils'

const REGION_ID = 'engine-region'

/**
 * Hero + Commerce Engine walkthrough. One grid, one engine instance:
 *  mobile  → hero, engine (SVG), layer panels
 *  desktop → left column scrolls (hero, then six layer panels); engine is sticky on the right.
 * All critical content is HTML — the canvas only illustrates it.
 */
export function HeroEngine() {
  return (
    <section id={REGION_ID} data-engine-region className="relative">
      <div className="grid-lines-light pointer-events-none absolute inset-x-0 top-0 h-[90vh] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="container-x relative grid gap-x-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)]">
        {/* HERO */}
        <div className="flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-14 lg:col-start-1 lg:row-start-1 lg:py-20">
          <p className="label-mono text-emerald-700">{positioning.title}</p>
          <h1 className="text-display mt-6 text-ink">
            Ring Lot
            <br />
            Morong<span className="sr-only">, Shopify developer and designer</span>
          </h1>
          <p className="label-mono mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-ink" aria-label="Specialization: Shopify, eCommerce, CRO">
            {positioning.specialization.map((item, index) => (
              <span key={item} className="flex items-center gap-3">
                {index > 0 ? (
                  <span className="text-emerald-600" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {item}
              </span>
            ))}
          </p>
          <p className="text-lead mt-6 max-w-[34rem] text-muted">{positioning.promise}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href={ctas.primary.href} track="cta_click" trackLabel="hero_start_project" cursor="start">
              {ctas.primary.label}
            </LinkButton>
            <LinkButton href={ctas.secondary.href} variant="secondary" track="cta_click" trackLabel="hero_explore_work" cursor="explore">
              {ctas.secondary.label}
            </LinkButton>
          </div>

          {/* Verified proof strip — every item links to its source */}
          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {proofFacts.map((fact) => (
              <div key={fact.id} className="bg-paper px-4 py-3.5">
                <dt className="label-mono text-[0.6rem] text-subtle">{fact.label}</dt>
                <dd className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-subtle">
            Platform-verified on Fiverr, {formatDate(siteConfig.lastVerified)}.{' '}
            <Link href="/proof" className="underline decoration-line-strong underline-offset-[3px] hover:text-ink" data-cursor="verify">
              See every source
            </Link>
          </p>
        </div>

        {/* ENGINE (sticky on desktop) */}
        <div className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="relative aspect-square max-h-[560px] w-full overflow-hidden rounded-xl bg-navy-900 sm:aspect-[5/4] lg:sticky lg:top-[calc(var(--header-h)+20px)] lg:aspect-auto lg:h-[calc(100svh-var(--header-h)-40px)] lg:max-h-[860px]">
            <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
            <CommerceEngine />
          </div>
        </div>

        {/* LAYER WALKTHROUGH */}
        <div className="lg:col-start-1 lg:row-start-2">
          <div className="pt-16 lg:pt-6">
            <p className="label-mono text-emerald-700">The Commerce Engine</p>
            <h2 className="text-h2 mt-4 max-w-lg text-ink">Six layers every Shopify store runs on.</h2>
            <p className="text-lead mt-5 max-w-lg text-muted">
              Most stores get one or two of these right. The work is making all six run together — and measuring the result.
            </p>
          </div>
          <ol className="mt-6">
            {engineLayers.map((layer) => (
              <li
                key={layer.id}
                data-engine-layer={layer.index}
                data-engine-focus={layer.index}
                className="flex min-h-[56vh] flex-col justify-center border-t border-line py-14 lg:min-h-[64vh]"
              >
                <p className="label-mono flex items-center gap-3 text-subtle">
                  <span className="text-emerald-700">{String(layer.index + 1).padStart(2, '0')}</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                  {layer.label}
                </p>
                <h3 className="text-h3 mt-5 max-w-md text-ink">{layer.title}</h3>
                <p className="mt-4 max-w-md text-muted">{layer.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {layer.serviceSlugs.map((slug) => {
                    const service = getService(slug)
                    if (!service) return null
                    return (
                      <li key={slug}>
                        <Link
                          href={`/services/${slug}`}
                          data-cursor="explore"
                          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:border-emerald-600"
                        >
                          {service.navLabel} <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <EngineScrollDriver regionId={REGION_ID} />
    </section>
  )
}
