import Link from 'next/link'
import { PageHero } from '@/components/ui/primitives'
import { skillGroups } from '@/data/skills'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/skills' })

/** Skill graph — evidence instead of percentage bars or seniority labels. */
export default function SkillsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Skills', path: '/skills' }]}
        label="Skills"
        title="No skill bars. Evidence instead."
        intro="Percentages and seniority labels cannot be verified. Each skill below links to the service, reviews or portfolio entries that back it."
      />
      <section className="section-y pt-14">
        <div className="container-x grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group) => (
            <section key={group.id} className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-card" aria-labelledby={`skills-${group.id}`} data-reveal>
              <h2 id={`skills-${group.id}`} className="text-xl font-semibold tracking-tight text-ink">
                {group.name}
              </h2>
              <p className="mt-1 text-sm text-muted">{group.description}</p>
              <ul className="mt-6 divide-y divide-line border-t border-line">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="py-4">
                    <p className="font-medium text-ink">{skill.name}</p>
                    <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      {skill.evidence.map((evidence) => (
                        <li key={evidence.href + evidence.label}>
                          {evidence.href.startsWith('/') ? (
                            <Link href={evidence.href} className="text-xs text-emerald-700 underline underline-offset-4">
                              {evidence.label}
                            </Link>
                          ) : (
                            <a href={evidence.href} target="_blank" rel="noopener" data-cursor="verify" className="text-xs text-muted underline underline-offset-4 hover:text-ink">
                              {evidence.label} ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
