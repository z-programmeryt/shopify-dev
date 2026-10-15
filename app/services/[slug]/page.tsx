import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LinkButton, PageHero, SectionHeader } from '@/components/ui/primitives'
import { JsonLd } from '@/components/ui/JsonLd'
import { ReviewCard } from '@/components/proof/ReviewCard'
import { ProjectCard } from '@/components/work/ProjectCard'
import { getService, services } from '@/data/services'
import { serviceRecord } from '@/data/professional'
import { ctas } from '@/data/site-config'
import { engineLayers } from '@/data/engine'
import { articlesForService, projectsForService, testimonialsForService } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { graph, serviceSchema } from '@/lib/schema'

export const dynamicParams = false

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return buildMetadata({ path: `/services/${service.slug}`, title: service.seo.title, description: service.seo.description })
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const reviews = testimonialsForService(service)
  const projects = projectsForService(service.slug).filter((project) => service.evidence.projectIds.includes(project.slug)).slice(0, 3)
  const articles = articlesForService(service.slug)
  const record = serviceRecord.find((item) => item.serviceSlug === service.slug)
  const layer = engineLayers.find((item) => item.id === service.engineLayer)
  const related = service.related.map((relatedSlug) => getService(relatedSlug)).filter(Boolean)

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        label={`${service.name}${layer ? ` · Engine layer ${String(layer.index + 1).padStart(2, '0')} ${layer.label}` : ''}`}
        title={service.headline}
        intro={service.summary}
      >
        <div className="flex flex-wrap items-center gap-3">
          <LinkButton href={`/contact?intent=${service.slug === 'conversion-tracking' || service.slug === 'shopify-cro' ? 'cro-tracking' : service.slug.includes('landing') || service.slug === 'gempages' || service.slug === 'pagefly' ? 'landing-page' : 'development'}`} cursor="start" track="cta_click" trackLabel={`service_${service.slug}_start`}>
            {ctas.primary.label}
          </LinkButton>
          {record ? (
            <p className="text-sm text-muted">
              Fiverr record for this service: <span className="font-medium text-ink">{record.rating.toFixed(1)}</span> from {record.reviews} reviews
            </p>
          ) : null}
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeader index="01" label="The problem" title="Sound familiar?" />
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {service.problems.map((problem) => (
              <li key={problem} className="flex gap-4 py-5 text-lg text-ink" data-reveal>
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-line bg-white">
        <div className="container-x">
          <SectionHeader index="02" label="What is included" title="Scope, in plain terms." intro={`Intent: ${service.intent}`} />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {service.included.map((item) => (
              <div key={item.title} className="bg-white p-6" data-reveal>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <p className="label-mono text-subtle">Deliverables</p>
              <ul className="mt-3 space-y-2 text-[0.95rem] text-ink">
                {service.deliverables.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-mono text-subtle">Tools</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-mono text-subtle">Not included</p>
              <ul className="mt-3 space-y-2 text-[0.95rem] text-muted">
                {service.notIncluded.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </div>
          </div>
          {service.notes ? <p className="mt-10 max-w-3xl rounded-lg border border-line bg-paper p-5 text-[0.95rem] text-muted">{service.notes}</p> : null}
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeader index="03" label="How it works" title="The approach." />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {service.approach.map((step, index) => (
              <li key={step.step} className="rounded-xl border border-line bg-white p-6" data-reveal>
                <p className="label-mono text-emerald-700">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.step}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {reviews.length > 0 || projects.length > 0 ? (
        <section className="section-y border-t border-line bg-white">
          <div className="container-x">
            <SectionHeader
              index="04"
              label="Evidence"
              title="What clients and the portfolio show."
              intro="Verbatim reviews from related services and portfolio records, each with its source."
            />
            {reviews.length > 0 ? (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.id} review={review} compact />
                ))}
              </div>
            ) : null}
            {projects.length > 0 ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="section-y">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeader index="05" label="Questions" title="Before you ask." />
          <div className="divide-y divide-line border-y border-line">
            {service.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-ink">
                  {faq.q}
                  <span aria-hidden="true" className="text-xl text-subtle transition-transform duration-[var(--dur-ui)] group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <p className="label-mono text-subtle">Related services</p>
            <ul className="mt-4 space-y-3">
              {related.map((item) =>
                item ? (
                  <li key={item.slug}>
                    <Link href={`/services/${item.slug}`} data-cursor="explore" className="text-lg font-medium text-ink hover:text-emerald-700">
                      {item.name} →
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
          {articles.length > 0 ? (
            <div>
              <p className="label-mono text-subtle">Further reading</p>
              <ul className="mt-4 space-y-3">
                {articles.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/insights/${article.slug}`} className="text-lg font-medium text-ink hover:text-emerald-700">
                      {article.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
      <JsonLd data={graph(serviceSchema(service))} />
    </>
  )
}
