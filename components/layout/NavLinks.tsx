'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from '@/data/site-config'

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-[var(--dur-micro)] ${
                active ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {item.label}
              {active ? <span className="absolute inset-x-3.5 -bottom-[1px] h-px bg-emerald-600" aria-hidden="true" /> : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
