import { ratingBreakdown } from '@/data/professional'
import { cn } from '@/lib/utils'

/** Full rating distribution — including the lower ratings — as published by Fiverr (TL-012). */
export function RatingBreakdown({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  const rows = ([5, 4, 3, 2, 1] as const).map((star) => ({ star, count: ratingBreakdown.stars[star] }))
  return (
    <div>
      <div className="flex items-end gap-3">
        <p className={cn('text-5xl font-semibold tracking-tight', dark ? 'text-white' : 'text-ink')}>{ratingBreakdown.average}</p>
        <p className={cn('pb-1.5 text-sm', dark ? 'text-silver-300' : 'text-muted')}>average from {ratingBreakdown.total} Fiverr reviews</p>
      </div>
      <dl className="mt-5 space-y-2">
        {rows.map((row) => (
          <div key={row.star} className="grid grid-cols-[3.25rem_1fr_2.5rem] items-center gap-3 text-sm">
            <dt className={dark ? 'text-silver-300' : 'text-muted'}>{row.star} star</dt>
            <dd className={cn('h-1.5 overflow-hidden rounded-full', dark ? 'bg-white/10' : 'bg-line')}>
              <span
                className={cn('block h-full rounded-full', dark ? 'bg-emerald-400' : 'bg-emerald-600')}
                style={{ width: `${(row.count / ratingBreakdown.total) * 100}%` }}
              />
            </dd>
            <dd className={cn('text-right tabular-nums', dark ? 'text-white' : 'text-ink')}>{row.count}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
