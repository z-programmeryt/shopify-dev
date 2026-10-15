'use client'

import { useEffect } from 'react'
import { ENGINE_FOCUS_EVENT, ENGINE_PROGRESS_EVENT } from '@/data/engine'

/**
 * Connects page scroll to the Commerce Engine:
 *  - the panel nearest the viewport centre ([data-engine-layer]) becomes the focused layer
 *  - progress through the region ([data-engine-region]) drives plate separation
 * Also lets hover/focus on any [data-engine-focus] element highlight a layer.
 * Communication is via window CustomEvents so renderers stay decoupled.
 */
export function EngineScrollDriver({ regionId }: { regionId: string }) {
  useEffect(() => {
    const region = document.getElementById(regionId)
    if (!region) return
    const panels = Array.from(region.querySelectorAll<HTMLElement>('[data-engine-layer]'))
    let current: number | null = null
    let frame = 0

    const emitFocus = (index: number | null) => {
      if (index === current) return
      current = index
      window.dispatchEvent(new CustomEvent(ENGINE_FOCUS_EVENT, { detail: { index } }))
    }

    const update = () => {
      frame = 0
      const rect = region.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = rect.height - viewport
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      window.dispatchEvent(new CustomEvent(ENGINE_PROGRESS_EVENT, { detail: { progress } }))

      const centre = viewport * 0.5
      let best: number | null = null
      let bestDistance = Infinity
      for (const panel of panels) {
        const box = panel.getBoundingClientRect()
        if (box.bottom < viewport * 0.15 || box.top > viewport * 0.85) continue
        const distance = Math.abs(box.top + box.height / 2 - centre)
        if (distance < bestDistance) {
          bestDistance = distance
          best = Number(panel.dataset.engineLayer)
        }
      }
      emitFocus(best)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const onPointer = (event: Event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-engine-focus]')
      if (target) emitFocus(Number(target.dataset.engineFocus))
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    region.addEventListener('pointerover', onPointer)
    region.addEventListener('focusin', onPointer)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      region.removeEventListener('pointerover', onPointer)
      region.removeEventListener('focusin', onPointer)
      window.dispatchEvent(new CustomEvent(ENGINE_FOCUS_EVENT, { detail: { index: null } }))
    }
  }, [regionId])

  return null
}
