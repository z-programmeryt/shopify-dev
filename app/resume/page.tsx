import Link from 'next/link'
import { PrintButton } from '@/components/ui/PrintButton'
import { getResumeData } from '@/lib/resume'
import { buildMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const metadata = buildMetadata({ path: '/resume', type: 'profile' })

/** Web résumé + print view. The PDF (/ring-lot-morong-resume.pdf) renders the same data object. */
export default function ResumePage() {
  const data = getResumeData()
  return (
    <section className="py-12 md:py-16">
      <div className="container-x max-w-4xl">
        <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="label-mono text-subtle">Résumé · generated from site data</p>
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            <a
              href="/ring-lot-morong-resume.pdf"
              data-track="resume_download"
              data-track-label="pdf"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700"
            >
              Download PDF <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <article className="print-plain rounded-xl border border-line bg-white p-8 shadow-card md:p-12">
          <header className="border-b border-line pb-8">
            <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">{data.name}</h1>
            <p className="mt-2 text-lg text-emerald-700">{data.title}</p>
            <p className="mt-3 text-sm text-muted">
              {data.location} · {data.languages} ·{' '}
              {data.links.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? ' · ' : ''}
                  <a href={link.href} className="underline underline-offset-2">
                    {link.value}
                  </a>
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-3xl leading-relaxed text-ink-soft">{data.summary}</p>
          </header>

          <ResumeSection title="Experience">
            {data.experience.map((item) => (
              <div key={item.role}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-ink">
                    {item.role} — {item.org}
                  </h3>
                  <p className="text-sm text-muted">{item.period}</p>
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft marker:text-emerald-600">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection title="Verified record">
            <dl className="grid gap-4 sm:grid-cols-2">
              {data.record.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="font-semibold text-ink">
                    {fact.value} <span className="font-normal text-muted">— {fact.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title="Services">
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {data.services.map((service) => (
                <li key={service.name}>
                  <p className="font-medium text-ink">{service.name}</p>
                  <p className="text-sm text-muted">{service.summary}</p>
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection title="Skills">
            <dl className="space-y-2">
              {data.skills.map((group) => (
                <div key={group.group} className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="text-sm font-medium text-ink">{group.group}</dt>
                  <dd className="text-sm text-ink-soft">{group.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title="Selected portfolio entries">
            <ul className="space-y-2">
              {data.portfolio.map((project) => (
                <li key={project.title} className="text-sm text-ink-soft">
                  <span className="font-medium text-ink">{project.title}</span> ({project.industry}) — {project.contribution}
                </li>
              ))}
            </ul>
          </ResumeSection>

          <p className="mt-10 border-t border-line pt-6 text-xs text-muted">
            {data.note} Verified {formatDate(data.verifiedOn)}.{' '}
            <Link href="/proof" className="no-print underline">
              Sources
            </Link>
          </p>
        </article>
      </div>
    </section>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="label-mono text-emerald-700">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
