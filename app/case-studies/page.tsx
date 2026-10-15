import Link from 'next/link'
import { Notice, PageHero } from '@/components/ui/primitives'
import { ProjectCover } from '@/components/work/ProjectCover'
import { caseSectionOrder, caseStudies } from '@/data/case-studies'
import { getProject } from '@/data/projects'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/case-studies' })

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Case studies', path: '/case-studies' }]}
        label="Case studies"
        title="Case files: what is documented, and what is not yet."
        intro="Case studies here follow a 20-section format. A section appears only when there is evidence for it — so early records are published as case files that show exactly what is documented and what is pending."
      />
      <section className="section-y pt-14">
        <div className="container-x">
          <Notice title="How to read case files">
            Case files contain facts from Ring Lot’s published portfolio only. Missing sections (results, metrics, screenshots) are listed as pending until the
            client or Ring Lot supplies evidence. Nothing is filled in by assumption.
          </Notice>
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {caseStudies.map((study) => {
              const project = getProject(study.projectSlug)
              const documented = study.sections.length
              return (
                <li key={study.slug}>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    data-cursor="view-case"
                    data-track="case_study_view"
                    data-track-label={study.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow hover:shadow-lift"
                  >
                    {project ? <ProjectCover project={project} className="aspect-[16/10]" /> : null}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="label-mono text-emerald-700">{study.status === 'case-file' ? 'Case file' : 'Case study'}</p>
                      <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink group-hover:text-emerald-700">{study.title}</h2>
                      <p className="mt-2 text-[0.95rem] text-muted">{study.subtitle}</p>
                      <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>
                            {documented} of {caseSectionOrder.length} sections documented
                          </span>
                          <span aria-hidden="true">→</span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
                          <span className="block h-full rounded-full bg-emerald-600" style={{ width: `${(documented / caseSectionOrder.length) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
