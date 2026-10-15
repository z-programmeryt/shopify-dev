'use client'

import { useMemo, useState, type ReactNode } from 'react'

type Item = { id: string; gig: string; gigLabel: string; node: ReactNode }

/** Client-side service filter for reviews (no indexed filter URLs). Cards are rendered on the server. */
export function ReviewsExplorer({ items, gigs }: { items: Item[]; gigs: { id: string; label: string; count: number }[] }) {
  const [gig, setGig] = useState<string | null>(null)
  const visible = useMemo(() => (gig ? items.filter((item) => item.gig === gig) : items), [items, gig])
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-muted hover:border-ink hover:text-ink'}`
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter reviews by service">
        <button type="button" className={chip(gig === null)} aria-pressed={gig === null} onClick={() => setGig(null)}>
          All ({items.length})
        </button>
        {gigs.map((item) => (
          <button key={item.id} type="button" className={chip(gig === item.id)} aria-pressed={gig === item.id} onClick={() => setGig(gig === item.id ? null : item.id)}>
            {item.label} ({item.count})
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} reviews
      </p>
      <div className="mt-10 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
        {visible.map((item) => (
          <div key={item.id}>{item.node}</div>
        ))}
      </div>
    </div>
  )
}
