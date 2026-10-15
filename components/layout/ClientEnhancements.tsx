'use client'

import dynamic from 'next/dynamic'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useReportWebVitals } from 'next/web-vitals'
import { track, type AnalyticsEvent } from '@/components/analytics/track'
import { analyticsConfig, features } from '@/data/site-config'
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher'
import { onIdle } from '@/lib/idle'

const SemanticCursor = dynamic(() => import('@/components/cursor/SemanticCursor'), { ssr: false })

/**
 * Small, always-present client layer:
 *  - reveal-on-scroll for [data-reveal]
 *  - delegated analytics for [data-track] elements (one listener for the whole page)
 *  - Web Vitals → analytics
 *  - lazy semantic cursor (fine pointers, motion allowed) and the assistant launcher
 */
export function ClientEnhancements() {
  const [cursorEnabled, setCursorEnabled] = useState(false)

  useReportWebVitals((metric) => {
    track('web_vital', { name: metric.name, value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), rating: metric.rating ?? 'unknown' })
  })

  useEffect(() => {
    // Reveal observer (re-scans on DOM changes caused by client navigation).
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            reveal.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => reveal.observe(el))
    scan()
    const mutation = new MutationObserver(scan)
    mutation.observe(document.getElementById('main') ?? document.body, { childList: true, subtree: true })

    // Delegated click analytics.
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (!target) return
      track(target.dataset.track as AnalyticsEvent, { label: target.dataset.trackLabel ?? '', path: window.location.pathname })
    }
    document.addEventListener('click', onClick)

    // Semantic cursor only where it makes sense.
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cancelIdle = features.semanticCursor && fine && !reduced ? onIdle(() => setCursorEnabled(true), 3000) : undefined

    return () => {
      reveal.disconnect()
      mutation.disconnect()
      document.removeEventListener('click', onClick)
      cancelIdle?.()
    }
  }, [])

  return (
    <>
      {cursorEnabled ? <SemanticCursor /> : null}
      {features.assistant ? <AssistantLauncher /> : null}
      {analyticsConfig.plausibleDomain ? (
        <Script src={analyticsConfig.plausibleSrc} data-domain={analyticsConfig.plausibleDomain} strategy="lazyOnload" />
      ) : null}
    </>
  )
}
