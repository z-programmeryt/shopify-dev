import { Suspense } from 'react'
import { PageHero } from '@/components/ui/primitives'
import { IntakeForm } from '@/components/contact/IntakeForm'
import { nextSteps } from '@/data/professional'
import { contactChannels } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/contact' })

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Start a project', path: '/contact' }]}
        label="Start a project"
        title="Tell me what is not working."
        intro="A short brief is enough. The form adapts to what you need — store build, landing page, conversion and tracking, or a review of an existing store."
      />
      <section className="section-y pt-12">
        <div className="container-x">
          <Suspense fallback={<div className="min-h-[640px] rounded-xl border border-line bg-white" aria-busy="true" />}>
            <IntakeForm />
          </Suspense>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-6 md:col-span-2">
              <p className="label-mono text-subtle">What happens next</p>
              <ol className="mt-4 grid gap-4 sm:grid-cols-2">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[1.75rem_1fr] gap-2 text-sm">
                    <span className="label-mono pt-0.5 text-emerald-700">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block font-medium text-ink">{step.title}</span>
                      <span className="block text-muted">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 text-sm">
              <p className="label-mono text-subtle">Prefer a marketplace?</p>
              <p className="mt-3 text-muted">Ring Lot’s verified Fiverr profile is an alternative way to get in touch, with platform payment protection.</p>
              <a
                href={contactChannels.fiverr.href}
                target="_blank"
                rel="noopener"
                data-track="social_click"
                data-track-label="contact_fiverr"
                data-cursor="verify"
                className="mt-4 inline-flex font-medium text-emerald-700 underline underline-offset-4"
              >
                {contactChannels.fiverr.label} ↗
              </a>
              <p className="mt-5 text-xs text-muted">No response-time promises: every brief is read personally. Mention your deadline so it can be taken into account.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
