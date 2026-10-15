import Link from 'next/link'
import { LinkButton, SectionHeader } from '@/components/ui/primitives'
import { ProjectCard } from '@/components/work/ProjectCard'
import { fit, nextSteps, trustStack } from '@/data/professional'
import { processSteps } from '@/data/process'
import { projects } from '@/data/projects'
import { services } from '@/data/services'
import { ctas } from '@/data/site-config'
import { croExperiments, teardownHotspots, teardownStore } from '@/data/lab'

/* 03 — Selected work */
export function SelectedWork() {
  const selected = projects.filter((project) => project.caseStudySlug).concat(projects.filter((p) => p.slug === 'beauty-products-store'))
  return (
    <section className="section-y" aria-labelledby="work-heading">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            index="03"
            label="Selected work"
            title={<span id="work-heading">Stores across fashion, beauty, jewelry and personalised products.</span>}
            intro="Every record shows where it comes from and how confident the evidence is. No client logos borrowed, no screenshots used without permission."
          />
          <LinkButton href="/work" variant="secondary" cursor="explore" track="cta_click" trackLabel="home_all_work">
            All work
          </LinkButton>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {selected.slice(0, 4).map((project, index) => (
            <div key={project.slug} data-reveal style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 04 — Services index (an index, not a card grid) */
export function ServicesIndex() {
  return (
    <section className="section-y border-t border-line bg-white" aria-labelledby="services-heading">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            index="04"
            label="Services"
            title={<span id="services-heading">Nine services. Each one with its own evidence.</span>}
            intro="Organised by what you are trying to do — build, redesign, convert, speed up or measure."
          />
          <div className="mt-8">
            <LinkButton href="/services" variant="secondary" cursor="explore">
              Compare services
            </LinkButton>
          </div>
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                data-cursor="explore"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 transition-colors hover:bg-paper md:px-3"
              >
                <span className="label-mono text-subtle">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block text-xl font-semibold tracking-tight text-ink group-hover:text-emerald-700">{service.name}</span>
                  <span className="mt-1.5 block text-[0.95rem] text-muted">{service.intent}</span>
                </span>
                <span aria-hidden="true" className="text-xl text-subtle transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1 group-hover:text-emerald-700">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 05 — Process preview (single line — the full spatial journey lives on /process) */
export function ProcessPreview() {
  return (
    <section className="section-y" aria-labelledby="process-heading">
      <div className="container-x">
        <SectionHeader
          index="05"
          label="Process"
          title={<span id="process-heading">From first message to a store you can run yourself.</span>}
          intro="Seven steps, each with a clear output. Nothing starts until scope, timeline and price are agreed in writing."
        />
        <div className="relative mt-14" data-reveal>
          <div className="absolute left-0 right-0 top-[11px] hidden h-px bg-line-strong md:block" aria-hidden="true" />
          <ol className="grid gap-8 md:grid-cols-7 md:gap-4">
            {processSteps.map((step) => (
              <li key={step.id} className="relative">
                <span className="relative z-10 block h-[23px] w-[23px] rounded-full border border-line-strong bg-paper p-[5px]" aria-hidden="true">
                  <span className="block h-full w-full rounded-full bg-emerald-600" />
                </span>
                <p className="label-mono mt-4 text-subtle">{String(step.index + 1).padStart(2, '0')}</p>
                <p className="mt-1 font-semibold text-ink">{step.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.youGet}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12">
          <LinkButton href="/process" variant="ghost" cursor="explore">
            Walk through the full process →
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

/* 06 — Lab teaser */
export function LabTeaser() {
  const high = teardownHotspots.filter((spot) => spot.priority === 'High').length
  return (
    <section className="section-y border-t border-line bg-paper-2" aria-labelledby="lab-heading">
      <div className="container-x">
        <SectionHeader
          index="06"
          label="Lab"
          title={<span id="lab-heading">See how the thinking works before you hire it.</span>}
          intro="A teardown of a fictional store and a set of experiment designs — clearly labelled demos, not client results."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Link href="/lab#teardown" data-cursor="explore" className="group rounded-xl border border-line bg-white p-8 shadow-card transition-shadow hover:shadow-lift" data-reveal>
            <p className="label-mono text-amber-600">{teardownStore.label}</p>
            <h3 className="text-h3 mt-4 text-ink">Store teardown: {teardownStore.product}</h3>
            <p className="mt-3 text-muted">
              {teardownHotspots.length} findings on one product page — {high} high priority — each with the issue, why it matters, the fix and how to measure it.
            </p>
            <p className="mt-8 font-medium text-ink group-hover:text-emerald-700">Open the teardown →</p>
          </Link>
          <Link href="/lab#cro-lab" data-cursor="explore" className="group rounded-xl border border-navy-700 bg-navy-900 p-8 text-white transition-shadow hover:shadow-lift" data-reveal>
            <p className="label-mono text-emerald-400">CRO Lab · experiment designs</p>
            <h3 className="text-h3 mt-4">What → Why → Expected effect</h3>
            <p className="mt-3 text-silver-300">
              {croExperiments.length} conversion experiments with interactive before/after demos and the metric that would prove each one.
            </p>
            <p className="mt-8 font-medium text-emerald-300 group-hover:text-emerald-400">Open the lab →</p>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* 07 — Fit + what happens next */
export function FitAndNext() {
  return (
    <section className="section-y" aria-labelledby="fit-heading">
      <div className="container-x grid gap-16 lg:grid-cols-2">
        <div>
          <SectionHeader index="07" label="Fit" title={<span id="fit-heading">Who this work is for.</span>} />
          <ul className="mt-10 space-y-6">
            {fit.map((item) => (
              <li key={item.title} className="border-l-2 border-emerald-600 pl-5" data-reveal>
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1.5 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader label="After you reach out" title="What happens next." />
          <ol className="mt-10 space-y-4">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-4 rounded-lg border border-line bg-white p-5" data-reveal>
                <span className="label-mono pt-1 text-emerald-700">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-semibold text-ink">{step.title}</span>
                  <span className="mt-1 block text-[0.95rem] text-muted">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* 08 — Trust stack + final CTA */
export function FinalCta() {
  return (
    <section className="border-t border-line bg-white" aria-labelledby="cta-heading">
      <div className="container-x section-y">
        <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6" aria-label="Trust stack">
          {trustStack.map((item, index) => (
            <li key={item.step} className="bg-white">
              <Link href={item.href} className="block h-full p-5 transition-colors hover:bg-paper">
                <span className="label-mono text-subtle">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-2 block font-semibold text-ink">{item.step}</span>
                <span className="mt-1 block text-sm text-muted">{item.body}</span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-20 text-center">
          <h2 id="cta-heading" className="text-h1 mx-auto max-w-3xl text-ink">
            Have a store that should be selling more?
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-xl text-muted">Send a short brief. You will get questions or a plan back — not a sales script.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <LinkButton href={ctas.primary.href} track="cta_click" trackLabel="final_start_project" cursor="start">
              {ctas.primary.label}
            </LinkButton>
            <LinkButton href={ctas.contextual.href} variant="secondary" track="cta_click" trackLabel="final_store_review" cursor="start">
              {ctas.contextual.label}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
