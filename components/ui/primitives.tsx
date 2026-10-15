import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ProofLevel } from '@/data/professional'
import { cn } from '@/lib/utils'
import { JsonLd } from './JsonLd'
import { breadcrumbSchema, graph } from '@/lib/schema'

/* ── Buttons ────────────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkSecondary'

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-700',
  secondary: 'border border-line-strong bg-white text-ink hover:border-ink',
  ghost: 'text-ink hover:text-emerald-700',
  onDark: 'bg-emerald-400 text-navy-950 hover:bg-emerald-300',
  onDarkSecondary: 'border border-white/20 text-white hover:border-white/60',
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
  className,
  track,
  trackLabel,
  cursor,
  external = false,
}: {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  className?: string
  track?: string
  trackLabel?: string
  cursor?: 'view-case' | 'explore' | 'start' | 'verify'
  external?: boolean
}) {
  const classes = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.95rem] font-medium transition-all duration-[var(--dur-micro)] ease-[var(--ease-standard)]',
    buttonStyles[variant],
    className,
  )
  const data = { 'data-track': track, 'data-track-label': trackLabel, 'data-cursor': cursor }
  const arrow = (
    <span aria-hidden="true" className="transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">
      {external ? '↗' : '→'}
    </span>
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={classes} {...data}>
        {children}
        {arrow}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...data}>
      {children}
      {variant !== 'ghost' ? arrow : null}
    </Link>
  )
}

/* ── Section header ─────────────────────────────────────────────────────── */

export function SectionHeader({
  index,
  label,
  title,
  intro,
  tone = 'light',
  align = 'left',
  as: Tag = 'h2',
  reveal = true,
}: {
  index?: string
  label: string
  title: ReactNode
  intro?: ReactNode
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  /** Above-the-fold headers must never wait for JS (LCP) — pass reveal={false}. */
  reveal?: boolean
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')} data-reveal={reveal ? '' : undefined}>
      <p className={cn('label-mono flex items-center gap-3', tone === 'dark' ? 'text-emerald-400' : 'text-emerald-700', align === 'center' && 'justify-center')}>
        {index ? <span className={tone === 'dark' ? 'text-silver-500' : 'text-subtle'}>{index}</span> : null}
        <span>{label}</span>
      </p>
      <Tag className={cn(Tag === 'h1' ? 'text-h1' : 'text-h2', 'mt-4', tone === 'dark' ? 'text-white' : 'text-ink')}>{title}</Tag>
      {intro ? <div className={cn('text-lead mt-5', tone === 'dark' ? 'text-silver-300' : 'text-muted')}>{intro}</div> : null}
    </div>
  )
}

/* ── Proof level badge (brief §13: DIRECT / VERIFIED / CORROBORATED / CLAIM) ── */

const proofStyles: Record<ProofLevel, { dot: string; text: string; title: string }> = {
  DIRECT: { dot: 'bg-emerald-500', text: 'text-emerald-700', title: 'Directly observable on this site' },
  VERIFIED: { dot: 'bg-emerald-500', text: 'text-emerald-700', title: 'Verified against a platform-computed source' },
  CORROBORATED: { dot: 'bg-teal-500', text: 'text-teal-700', title: 'Self-reported and corroborated by independent reviews' },
  CLAIM: { dot: 'bg-silver-500', text: 'text-muted', title: 'Self-reported; not independently verified' },
}

export function ProofBadge({ level, tone = 'light' }: { level: ProofLevel; tone?: 'light' | 'dark' }) {
  const style = proofStyles[level]
  return (
    <span title={style.title} className={cn('label-mono inline-flex items-center gap-1.5', tone === 'dark' ? 'text-emerald-300' : style.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {level}
    </span>
  )
}

export function ConfidenceBadge({ confidence }: { confidence: 'high' | 'medium' | 'low' }) {
  const map = { high: 'VERIFIED', medium: 'SELF-REPORTED', low: 'LOW CONFIDENCE' } as const
  const color = { high: 'bg-emerald-500', medium: 'bg-teal-500', low: 'bg-silver-500' }[confidence]
  return (
    <span className="label-mono inline-flex items-center gap-1.5 text-muted" title={`Evidence confidence: ${confidence}`}>
      <span className={cn('h-1.5 w-1.5 rounded-full', color)} aria-hidden="true" />
      {map[confidence]}
    </span>
  )
}

/* ── Source link ────────────────────────────────────────────────────────── */

export function SourceLink({ href, label, tone = 'light' }: { href: string; label: string; tone?: 'light' | 'dark' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      data-cursor="verify"
      data-track="social_click"
      data-track-label={`source:${label}`}
      className={cn(
        'inline-flex items-center gap-1 text-xs underline decoration-1 underline-offset-[3px] transition-colors',
        tone === 'dark' ? 'text-silver-300 decoration-white/25 hover:text-white' : 'text-muted decoration-line-strong hover:text-ink',
      )}
    >
      Source: {label} <span aria-hidden="true">↗</span>
    </a>
  )
}

/* ── Breadcrumbs (visible + BreadcrumbList JSON-LD) ─────────────────────── */

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: 'Home', path: '/' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="label-mono text-subtle">
        <ol className="flex flex-wrap items-center gap-2">
          {all.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index < all.length - 1 ? (
                <>
                  <Link href={item.path} className="hover:text-ink">
                    {item.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : (
                <span aria-current="page" className="text-muted">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbSchema(all))} />
    </>
  )
}

/* ── Inner page hero ────────────────────────────────────────────────────── */

export function PageHero({
  crumbs,
  label,
  title,
  intro,
  children,
}: {
  crumbs: { name: string; path: string }[]
  label: string
  title: ReactNode
  intro?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="container-x relative pb-14 pt-10 md:pb-20 md:pt-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 md:mt-14">
          <SectionHeader as="h1" label={label} title={title} intro={intro} reveal={false} />
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  )
}

/* ── Notice (honest status banners) ─────────────────────────────────────── */

export function Notice({ title, children, tone = 'info' }: { title: string; children: ReactNode; tone?: 'info' | 'draft' }) {
  return (
    <div
      role="note"
      className={cn(
        'rounded-lg border px-5 py-4 text-sm leading-relaxed',
        tone === 'draft' ? 'border-amber-600/30 bg-[#fff8eb] text-ink-soft' : 'border-emerald-600/25 bg-emerald-50 text-ink-soft',
      )}
    >
      <p className={cn('label-mono mb-1.5', tone === 'draft' ? 'text-amber-600' : 'text-emerald-700')}>{title}</p>
      {children}
    </div>
  )
}

/* ── Tag chip ───────────────────────────────────────────────────────────── */

export function Chip({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs',
        tone === 'dark' ? 'border-white/15 text-silver-300' : 'border-line bg-white text-muted',
      )}
    >
      {children}
    </span>
  )
}
