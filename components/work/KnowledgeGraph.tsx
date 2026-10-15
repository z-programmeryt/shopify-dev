'use client'

import { useMemo, useState } from 'react'

type Node = { id: string; label: string; column: 0 | 1 | 2 }
type Edge = { from: string; to: string }

/**
 * Portfolio knowledge graph (brief §15): industries → projects → services.
 * Hover or focus a node to trace its connections. A visual summary only — every relationship
 * is also present as text in the record list below.
 */
export function KnowledgeGraph({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const [active, setActive] = useState<string | null>(null)
  const width = 960
  const columnX = [120, 480, 840]
  const layout = useMemo(() => {
    const byColumn = [0, 1, 2].map((column) => nodes.filter((node) => node.column === column))
    const height = Math.max(...byColumn.map((list) => list.length)) * 44 + 40
    const positions = new Map<string, { x: number; y: number }>()
    byColumn.forEach((list, column) => {
      const step = (height - 40) / Math.max(1, list.length)
      list.forEach((node, index) => positions.set(node.id, { x: columnX[column]!, y: 20 + step * (index + 0.5) }))
    })
    return { height, positions }
  }, [nodes]) // eslint-disable-line react-hooks/exhaustive-deps

  const connected = useMemo(() => {
    if (!active) return null
    const set = new Set<string>([active])
    // Walk one hop in both directions, then one more (industry ↔ project ↔ service).
    for (let pass = 0; pass < 2; pass++) {
      for (const edge of edges) {
        if (set.has(edge.from) || set.has(edge.to)) {
          if (pass === 0 || active.startsWith('project:')) {
            set.add(edge.from)
            set.add(edge.to)
          }
        }
      }
      if (!active.startsWith('project:')) break
    }
    return set
  }, [active, edges])

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900">
      <svg viewBox={`0 0 ${width} ${layout.height}`} className="min-w-[760px]" role="img" aria-label="Knowledge graph linking industries, projects and services">
        <g fill="none">
          {edges.map((edge) => {
            const a = layout.positions.get(edge.from)
            const b = layout.positions.get(edge.to)
            if (!a || !b) return null
            const lit = connected ? connected.has(edge.from) && connected.has(edge.to) : false
            const mid = (a.x + b.x) / 2
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`M${a.x + 70} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x - 70} ${b.y}`}
                stroke={lit ? '#3CC594' : 'rgba(201,207,218,0.16)'}
                strokeWidth={lit ? 1.6 : 1}
                style={{ transition: 'stroke 200ms ease' }}
              />
            )
          })}
        </g>
        {nodes.map((node) => {
          const p = layout.positions.get(node.id)
          if (!p) return null
          const lit = connected ? connected.has(node.id) : true
          return (
            <g
              key={node.id}
              transform={`translate(${p.x} ${p.y})`}
              tabIndex={0}
              role="button"
              aria-label={`Highlight connections for ${node.label}`}
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              style={{ cursor: 'pointer', opacity: lit ? 1 : 0.35, transition: 'opacity 200ms ease' }}
            >
              <rect x="-70" y="-15" width="140" height="30" rx="15" fill={active === node.id ? '#18315F' : '#0D1C3B'} stroke={active === node.id ? '#3CC594' : 'rgba(201,207,218,0.25)'} />
              <text textAnchor="middle" y="4.5" fontSize="12" fill="#E6EAF1" fontFamily="var(--font-instrument-sans), system-ui, sans-serif">
                {node.label.length > 21 ? `${node.label.slice(0, 20)}…` : node.label}
              </text>
            </g>
          )
        })}
        {['Industries', 'Projects', 'Services'].map((label, index) => (
          <text key={label} x={columnX[index]} y={12} textAnchor="middle" fontSize="10" letterSpacing="1.6" fill="#7D889C" fontFamily="var(--font-jetbrains-mono), monospace">
            {label.toUpperCase()}
          </text>
        ))}
      </svg>
    </div>
  )
}
