'use client'

import { useState } from 'react'
import type { CroExperiment } from '@/data/lab'
import { track } from '@/components/analytics/track'

function PhoneDemo({ demo, after }: { demo: NonNullable<CroExperiment['demo']>; after: boolean }) {
  return (
    <div className="relative mx-auto h-[300px] w-[170px] overflow-hidden rounded-[26px] border-[5px] border-navy-900 bg-white shadow-lift" aria-hidden="true">
      <div className="h-full overflow-hidden px-3 pt-3">
        <div className="h-24 rounded-lg bg-[linear-gradient(135deg,#e9ecf2,#dfe3ea)]" />
        <div className="mt-2.5 h-2.5 w-4/5 rounded bg-ink/80" />
        <div className="mt-1.5 h-2.5 w-1/3 rounded bg-ink/60" />
        {demo === 'swatches' ? (
          after ? (
            <div className="mt-3 flex gap-1.5">
              {['#0A1630', '#3CC594', '#C9CFDA', '#B26B00'].map((color, index) => (
                <span key={color} className={`relative h-5 w-5 rounded-full border ${index === 0 ? 'ring-2 ring-emerald-600 ring-offset-1' : ''}`} style={{ background: color }}>
                  {index === 3 ? <span className="absolute left-1/2 top-[-2px] h-6 w-px -translate-x-1/2 rotate-45 bg-red-700" /> : null}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 flex h-6 items-center justify-between rounded border border-line-strong px-2 text-[0.55rem] text-subtle">
              Colour: select <span>▾</span>
            </div>
          )
        ) : null}
        <div className="mt-3 h-7 rounded-md bg-navy-900" />
        {demo === 'delivery-line' && after ? (
          <p className="mt-1.5 text-[0.5rem] leading-snug text-emerald-700">Free delivery over $75 · arrives in 3–5 days · 30-day returns</p>
        ) : null}
        <div className="mt-3 space-y-1.5">
          {[100, 88, 94, 76, 90, 70, 84].map((width, index) => (
            <div key={index} className="h-1.5 rounded bg-line" style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>
      {demo === 'sticky-atc' && after ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-white px-3 py-2">
          <span className="text-[0.55rem] font-semibold text-ink">$148</span>
          <span className="rounded bg-navy-900 px-2.5 py-1 text-[0.5rem] text-white">Add to cart</span>
        </div>
      ) : null}
    </div>
  )
}

export function CroLab({ experiments }: { experiments: CroExperiment[] }) {
  const [after, setAfter] = useState<Record<string, boolean>>({})
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {experiments.map((experiment, index) => (
        <article key={experiment.id} className="flex flex-col rounded-xl border border-white/10 bg-navy-850 p-6 text-white">
          <p className="label-mono text-emerald-400">Experiment {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">{experiment.title}</h3>
          <div className={`mt-5 grid gap-6 ${experiment.demo ? 'sm:grid-cols-[1fr_auto]' : ''}`}>
            <dl className="space-y-3 text-[0.95rem]">
              {(
                [
                  ['What', experiment.what],
                  ['Why', experiment.why],
                  ['Expected effect', experiment.expectedEffect],
                  ['Measure', experiment.measure],
                  ['Fits when', experiment.fitsWhen],
                ] as const
              ).map(([term, value]) => (
                <div key={term}>
                  <dt className="label-mono text-[0.62rem] text-silver-500">{term}</dt>
                  <dd className="mt-0.5 text-silver-300">{value}</dd>
                </div>
              ))}
            </dl>
            {experiment.demo ? (
              <div className="flex flex-col items-center gap-3">
                <PhoneDemo demo={experiment.demo} after={Boolean(after[experiment.id])} />
                <div className="inline-flex rounded-full border border-white/15 p-1 text-xs" role="group" aria-label={`${experiment.title} demo state`}>
                  {(['Before', 'After'] as const).map((label) => {
                    const isAfter = label === 'After'
                    const pressed = Boolean(after[experiment.id]) === isAfter
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => {
                          setAfter((current) => ({ ...current, [experiment.id]: isAfter }))
                          track('cro_lab_interaction', { experiment: experiment.id, state: label })
                        }}
                        className={`rounded-full px-3 py-1 transition-colors ${pressed ? 'bg-emerald-400 text-navy-950' : 'text-silver-300 hover:text-white'}`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
