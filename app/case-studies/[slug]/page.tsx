import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LinkButton, Notice, PageHero } from '@/components/ui/primitives'
import { ProjectCover } from '@/components/work/ProjectCover'
import { caseSectionOrder, caseSectionTitles, caseStudies, getCaseStudy } from '@/data/case-studies'
import { getProject } from '@/data/projects'
import { getService } from '@/data/services'
import { ctas } from '@/data/site-config'
import { relatedProjects } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params }: PageProps<'/case-studies/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}
  return buildMetadata({
    path: `/case-studies/${study.slug}`,
    title: study.seo.title,
    description: study.seo.description,
    // Case files are evidence-limited: kept out of the index until completed (thin-content protection).
    noindex: study.status !== 'published',
    type: 'article',
  })
}

export default async function CaseStudyPage({ params }: PageProps<'/case-studies/[slug]'>) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()
  const project = getProject(study.projectSlug)
  if (!project) notFound()

  const sectionsById = new Map(study.sections.map((section) => [section.id, section]))
  const documented = caseSectionOrder.filter((id) => sectionsById.has(id))
  const related = relatedProjects(project)

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Case studies', path: '/case-studies' },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ]}
        label={study.status === 'case-file' ? 'Case file' : 'Case study'}
        title={study.title}
        intro={study.subtitle}
      />

      <section className="section-y pt-12">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <article>
            <ProjectCover project={project} className="aspect-[16/8] rounded-xl" />
            {study.status === 'case-file' ? (
              <div className="mt-8">
                <Notice title="Case file — evidence-limited">
                  This record shows only what is documented in Ring Lot’s published portfolio. Results, metrics and screenshots are not shown because they have not
                  been verified. Last reviewed {formatDate(study.lastReviewed)}.
                </Notice>
              </div>
            ) : null}

            <div className="mt-12 space-y-12">
              {documented.map((id, index) => {
                const section = sectionsById.get(id)!
                return (
                  <section key={id} aria-labelledby={`cs-${id}`} data-reveal>
                    <p className="label-mono text-subtle">{String(index + 1).padStart(2, '0')}</p>
                    <h2 id={`cs-${id}`} className="mt-2 text-h3 text-ink">
                      {caseSectionTitles[id]}
                    </h2>
                    {section.body ? <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{section.body}</p> : null}
                    {section.items ? (
                      <ul className="mt-4 space-y-2 text-lg text-ink-soft">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                )
              })}

              {study.whyThisDesign.length > 0 ? (
                <section>
                  <h2 className="text-h3 text-ink">Why this design?</h2>
                  {study.whyThisDesign.map((item) => (
                    <details key={item.element} className="mt-4 rounded-lg border border-line bg-white p-5">
                      <summary className="cursor-pointer font-medium text-ink">{item.element}</summary>
                      <dl className="mt-3 grid gap-2 text-sm text-muted">
                        <div>Problem: {item.problem}</div>
                        <div>User need: {item.userNeed}</div>
                        <div>Business goal: {item.businessGoal}</div>
                        <div>Decision: {item.decision}</div>
                        <div>Expected effect: {item.expectedEffect}</div>
                      </dl>
                    </details>
                  ))}
                </section>
              ) : null}
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <p className="label-mono text-subtle">At a glance</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Industry</dt>
                  <dd className="text-right text-ink">{project.industry}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Platform</dt>
                  <dd className="text-right text-ink">{project.platform}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Role</dt>
                  <dd className="text-right text-ink">{project.role}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Timeline</dt>
                  <dd className="text-right text-ink">{project.timeline ?? 'Not documented'}</dd>
                </div>
              </dl>
              <p className="label-mono mt-6 text-subtle">Services</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.services.map((serviceSlug) => (
                  <li key={serviceSlug}>
                    <Link href={`/services/${serviceSlug}`} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-emerald-600 hover:text-ink">
                      {getService(serviceSlug)?.navLabel ?? serviceSlug}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="label-mono mt-6 text-subtle">Evidence</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {project.evidence.map((evidence) => (
                  <li key={evidence.url}>
                    <a href={evidence.url} target="_blank" rel="noopener" data-cursor="verify" className="text-emerald-700 underline underline-offset-4">
                      {evidence.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-line bg-paper-2 p-6">
              <p className="label-mono text-subtle">
                Documented {documented.length} / {caseSectionOrder.length}
              </p>
              <p className="mt-3 text-sm text-muted">Pending owner or client input:</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {study.pending.map((id) => (
                  <li key={id} className="rounded-full border border-dashed border-line-strong px-2.5 py-1 text-xs text-subtle">
                    {caseSectionTitles[id]}
                  </li>
                ))}
              </ul>
            </div>

            {related.length > 0 ? (
              <div className="rounded-xl border border-line bg-white p-6">
                <p className="label-mono text-subtle">Related records</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link href={item.caseStudySlug ? `/case-studies/${item.caseStudySlug}` : `/work#${item.slug}`} className="text-ink hover:text-emerald-700">
                        {item.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <LinkButton href={ctas.primary.href} className="w-full" cursor="start" track="cta_click" trackLabel={`case_${study.slug}_start`}>
              Start a similar project
            </LinkButton>
          </aside>
        </div>
      </section>
    </>
  )
}
