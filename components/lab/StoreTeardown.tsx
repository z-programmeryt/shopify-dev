'use client'

import { useState } from 'react'
import type { TeardownHotspot } from '@/data/lab'
import { track } from '@/components/analytics/track'

const PRIORITY_STYLE: Record<TeardownHotspot['priority'], string> = {
  High: 'bg-emerald-700 text-white',
  Medium: 'bg-teal-700 text-white',
  Low: 'bg-muted text-white',
}

/** Interactive teardown of a FICTIONAL product page. All findings are also listed as text. */
export function StoreTeardown({ hotspots, storeName, product }: { hotspots: TeardownHotspot[]; storeName: string; product: string }) {
  const [activeId, setActiveId] = useState(hotspots[0]?.id ?? '')
  const active = hotspots.find((spot) => spot.id === activeId) ?? hotspots[0]

  const select = (id: string) => {
    setActiveId(id)
    track('teardown_interaction', { finding: id })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Mock product page (decorative wireframe with interactive markers) */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="text-sm font-semibold tracking-tight text-ink">{storeName}</span>
          <span className="flex gap-3" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-2 w-10 rounded-full bg-line" />
            ))}
          </span>
        </div>
        <div className="relative aspect-[4/3.6] p-5" aria-hidden="false">
          <div className="grid h-full grid-cols-[1.15fr_1fr] gap-5" aria-hidden="true">
            <div className="flex flex-col gap-2">
              <div className="flex-1 rounded-lg bg-[linear-gradient(135deg,#e9ecf2,#dfe3ea)]" />
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-md bg-line" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="h-4 w-4/5 rounded bg-ink/80" />
              <div className="h-3 w-1/3 rounded bg-line-strong" />
              <div className="h-5 w-1/4 rounded bg-ink/70" />
              <div className="mt-2 flex h-9 items-center justify-between rounded-md border border-line-strong px-3">
                <span className="h-2 w-16 rounded bg-line-strong" />
                <span className="text-xs text-subtle">▾</span>
              </div>
              <div className="h-10 rounded-md bg-navy-900" />
              <div className="space-y-1.5 pt-2">
                {[100, 92, 96, 70].map((w, i) => (
                  <div key={i} className="h-2 rounded bg-line" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-5 bottom-3 flex items-center justify-between rounded-md border border-dashed border-line-strong bg-paper px-3 py-1.5 text-[0.65rem] text-subtle" aria-hidden="true">
            <span>reviews-app.js · reviews-app-2.js · upsell-legacy.js</span>
            <span>fbq(&apos;track&apos;,&apos;Purchase&apos;) ×2</span>
          </div>
          {hotspots.map((spot, index) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => select(spot.id)}
              aria-pressed={spot.id === active?.id}
              aria-label={`Finding ${index + 1}: ${spot.area}`}
              className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-lift transition-transform duration-[var(--dur-micro)] hover:scale-110 ${
                spot.id === active?.id ? 'border-white bg-emerald-700 text-white' : 'border-white bg-navy-900 text-white'
              }`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="label-mono border-t border-line px-5 py-2.5 text-[0.6rem] text-amber-600">
          Demo data · fictional store · product: {product}
        </p>
      </div>

      {/* Finding detail */}
      <div>
        {active ? (
          <div className="rounded-xl border border-line bg-white p-6 shadow-card" aria-live="polite">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`label-mono rounded-full px-2.5 py-1 text-[0.6rem] ${PRIORITY_STYLE[active.priority]}`}>{active.priority} priority</span>
              <span className="label-mono text-subtle">Layer · {active.layer.toUpperCase()}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{active.area}</h3>
            <dl className="mt-5 space-y-4 text-[0.95rem]">
              {(
                [
                  ['Issue', active.issue],
                  ['Why it matters', active.whyItMatters],
                  ['Recommendation', active.recommendation],
                  ['Expected effect', active.expectedEffect],
                  ['How to measure', active.measure],
                ] as const
              ).map(([term, value]) => (
                <div key={term}>
                  <dt className="label-mono text-emerald-700">{term}</dt>
                  <dd className="mt-1 text-ink-soft">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        <ol className="mt-6 space-y-2">
          {hotspots.map((spot, index) => (
            <li key={spot.id}>
              <button
                type="button"
                onClick={() => select(spot.id)}
                aria-pressed={spot.id === active?.id}
                className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  spot.id === active?.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-ink hover:border-ink'
                }`}
              >
                <span>
                  <span className="label-mono mr-3 opacity-70">{String(index + 1).padStart(2, '0')}</span>
                  {spot.area}
                </span>
                <span className="label-mono text-[0.6rem] opacity-80">{spot.priority}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
