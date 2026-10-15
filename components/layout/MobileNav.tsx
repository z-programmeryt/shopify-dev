'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { ctas, type NavItem } from '@/data/site-config'

export function MobileNav({ primary, secondary }: { primary: NavItem[]; secondary: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const pathname = usePathname()
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close on route change (derived state — no effect needed).
  if (open && openedAt !== null && openedAt !== pathname) {
    setOpen(false)
    setOpenedAt(null)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const toggle = () => {
    setOpen((value) => !value)
    setOpenedAt(pathname)
  }

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-paper"
      >
        <nav aria-label="Mobile" className="container-x flex flex-col gap-10 py-8">
          <ul className="flex flex-col">
            {primary.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  className="flex items-baseline justify-between py-4 text-2xl font-semibold tracking-tight text-ink"
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.label}
                  <span className="label-mono text-subtle">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
            {secondary.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={ctas.primary.href}
            data-track="cta_click"
            data-track-label="mobile_menu_start_project"
            className="inline-flex justify-center rounded-full bg-navy-900 px-6 py-3.5 font-medium text-white"
          >
            {ctas.primary.label}
          </Link>
        </nav>
      </div>
    </div>
  )
}
