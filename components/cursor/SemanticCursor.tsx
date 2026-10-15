'use client'

import { useEffect, useRef } from 'react'

const LABELS: Record<string, string> = {
  'view-case': 'VIEW CASE',
  explore: 'EXPLORE',
  start: 'START',
  verify: 'VERIFY',
}

/**
 * Semantic cursor (brief §33): a small follower that reveals intent labels on elements marked with
 * data-cursor="view-case|explore|start|verify". Mounted only for fine pointers with motion allowed.
 * The native cursor is kept — this is an enhancement, never a replacement.
 */
export default function SemanticCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    const label = labelRef.current
    if (!node || !label) return
    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let frame = 0
    let running = false

    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) frame = requestAnimationFrame(loop)
      else running = false
    }

    const onMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      node.removeAttribute('data-hidden')
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      const key = target?.dataset.cursor
      if (key && LABELS[key]) {
        node.setAttribute('data-label', key)
        label.textContent = LABELS[key]
      } else {
        node.removeAttribute('data-label')
      }
      if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    const onLeave = () => node.setAttribute('data-hidden', '')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className="semantic-cursor" data-hidden="" aria-hidden="true">
      <div className="semantic-cursor__ring">
        <span ref={labelRef} className="semantic-cursor__label" />
      </div>
    </div>
  )
}
