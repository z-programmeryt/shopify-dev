import Link from 'next/link'
import { PageHero } from '@/components/ui/primitives'
import { industries } from '@/data/industries'
import { projectsForIndustry } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/industries' })

/** One page, not thin per-industry doorway pages (brief §8). */
export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Industries', path: '/industries' }]}
        label="Industries"
        title="Categories in the portfolio — and what matters in each."
        intro="Industry lists reflect published portfolio records only. The notes below are the design considerations each category demands."
      />
      <section className="section-y pt-14">
        <div className="container-x divide-y divide-line border-y border-line">
          {industries.map((industry, index) => {
            const records = projectsForIndustry(industry.id)
            return (
              <article key={industry.id} id={industry.id} className="grid scroll-mt-28 gap-8 py-12 lg:grid-cols-[0.9fr_1.4fr_0.9fr]" data-reveal>
                <div>
                  <p className="label-mono text-subtle">{String(index + 1).padStart(2, '0')}</p>
                  <h2 className="text-h3 mt-2 text-ink">{industry.name}</h2>
                  <p className="mt-3 text-muted">{industry.summary}</p>
                </div>
                <div>
                  <p className="label-mono text-emerald-700">What matters</p>
                  <ul className="mt-4 space-y-3">
                    {industry.whatMatters.map((item) => (
                      <li key={item} className="flex gap-3 text-ink">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label-mono text-subtle">Records ({records.length})</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {records.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={project.caseStudySlug ? `/case-studies/${project.caseStudySlug}` : `/work#${project.slug}`}
                          data-cursor={project.caseStudySlug ? 'view-case' : 'explore'}
                          className="text-ink underline decoration-line-strong underline-offset-4 hover:text-emerald-700"
                        >
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
