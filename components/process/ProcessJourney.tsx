'use client'

import { useEffect, useRef, useState } from 'react'
import { EngineFallback } from '@/components/engine/EngineFallback'
import { engineLayers } from '@/data/engine'
import type { ProcessStep } from '@/data/process'

/**
 * Spatial process journey (brief §25): steps scroll on the left; the Commerce Engine (SVG) is
 * pinned on the right and evolves — the layer each step moves forward lights up, and the plates
 * separate as the project progresses. Content remains fully readable without JS.
 */
export function ProcessJourney({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    refs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const step = steps[active]
  const layerIndex = step?.engine ? (engineLayers.find((layer) => layer.id === step.engine)?.index ?? null) : null

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <ol className="relative">
        <span className="absolute bottom-0 left-[11px] top-0 w-px bg-line-strong" aria-hidden="true" />
        {steps.map((item, index) => (
          <li
            key={item.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            data-step={index}
            className="relative min-h-[62vh] pb-16 pl-12"
          >
            <span
              className={`absolute left-0 top-1 flex h-[23px] w-[23px] items-center justify-center rounded-full border transition-colors duration-[var(--dur-ui)] ${
                index <= active ? 'border-emerald-600 bg-emerald-600' : 'border-line-strong bg-paper'
              }`}
              aria-hidden="true"
            >
              <span className={`h-2 w-2 rounded-full ${index <= active ? 'bg-white' : 'bg-line-strong'}`} />
            </span>
            <p className="label-mono text-subtle">
              Step {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </p>
            <h2 className="text-h2 mt-3 text-ink">{item.name}</h2>
            <p className="text-lead mt-3 max-w-lg text-muted">{item.question}</p>
            <div className="mt-8 grid max-w-xl gap-6 sm:grid-cols-2">
              <div>
                <p className="label-mono text-emerald-700">What happens</p>
                <ul className="mt-3 space-y-2 text-[0.95rem] text-ink">
                  {item.happens.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="label-mono text-emerald-700">You get</p>
                  <p className="mt-2 text-[0.95rem] text-ink">{item.youGet}</p>
                </div>
                <div>
                  <p className="label-mono text-subtle">Needed from you</p>
                  <p className="mt-2 text-[0.95rem] text-muted">{item.needFromYou}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+24px)] overflow-hidden rounded-xl bg-navy-900 p-6">
          <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative flex items-center justify-between">
            <p className="label-mono text-silver-500">Engine state</p>
            <p className="label-mono text-emerald-400" aria-live="polite">
              {step?.name}
              {layerIndex !== null ? ` → ${engineLayers[layerIndex]?.label}` : ' → mapping the store'}
            </p>
          </div>
          <EngineFallback active={layerIndex} spread={active / Math.max(1, steps.length - 1)} className="relative mt-4 h-[min(64vh,560px)] w-full" />
        </div>
      </div>
    </div>
  )
}
