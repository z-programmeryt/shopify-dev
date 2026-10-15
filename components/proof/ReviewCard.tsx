import type { Testimonial } from '@/data/testimonials'
import { gigs } from '@/data/testimonials'
import { cn } from '@/lib/utils'

function Stars({ rating, tone }: { rating: number; tone: 'light' | 'dark' }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 12 12" className={cn('h-3 w-3', star <= Math.round(rating) ? (tone === 'dark' ? 'text-emerald-400' : 'text-emerald-600') : 'text-line-strong')} aria-hidden="true">
          <path fill="currentColor" d="M6 .8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6 9l-3.2 1.7.6-3.6L.8 4.6l3.6-.5z" />
        </svg>
      ))}
      <span className={cn('ml-1 text-xs tabular-nums', tone === 'dark' ? 'text-silver-300' : 'text-muted')}>{rating.toFixed(1)}</span>
    </span>
  )
}

/** Verbatim review with full context (service, price band, duration, country) and a source link. */
export function ReviewCard({ review, tone = 'light', compact = false }: { review: Testimonial; tone?: 'light' | 'dark'; compact?: boolean }) {
  const dark = tone === 'dark'
  return (
    <figure
      className={cn(
        'flex h-full flex-col justify-between rounded-lg border p-6',
        dark ? 'border-white/10 bg-navy-850' : 'border-line bg-white shadow-card',
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <Stars rating={review.rating} tone={tone} />
          {review.ongoing ? (
            <span className={cn('label-mono text-[0.58rem]', dark ? 'text-emerald-300' : 'text-emerald-700')}>Repeat client</span>
          ) : null}
        </div>
        <blockquote className={cn('mt-4 leading-relaxed', compact ? 'text-[0.97rem]' : 'text-[1.02rem]', dark ? 'text-white' : 'text-ink')}>
          <p>“{review.quote}”</p>
        </blockquote>
      </div>
      <figcaption className={cn('mt-6 border-t pt-4 text-xs', dark ? 'border-white/10 text-silver-500' : 'border-line text-muted')}>
        <p>
          Fiverr client · {review.country} · {review.when} (as of Oct 2026)
        </p>
        <p className="mt-1">
          {gigs[review.gig].label} · {review.priceBand} · {review.duration}
        </p>
        <a
          href={review.sourceUrl}
          target="_blank"
          rel="noopener"
          data-cursor="verify"
          className={cn('mt-2 inline-flex items-center gap-1 underline underline-offset-[3px]', dark ? 'decoration-white/25 hover:text-white' : 'decoration-line-strong hover:text-ink')}
        >
          View on Fiverr <span aria-hidden="true">↗</span>
        </a>
      </figcaption>
    </figure>
  )
}
