import type { ProjectDNA } from '@/data/projects'

const HUES: Record<ProjectDNA['cover']['hue'], { bg: string; plate: string; accent: string; line: string }> = {
  emerald: { bg: '#0D1C3B', plate: '#18315F', accent: '#3CC594', line: 'rgba(127,221,185,0.35)' },
  navy: { bg: '#0A1630', plate: '#102347', accent: '#45C2C2', line: 'rgba(201,207,218,0.3)' },
  teal: { bg: '#0B1A33', plate: '#16305C', accent: '#45C2C2', line: 'rgba(143,223,240,0.32)' },
  silver: { bg: '#111A2E', plate: '#1C2A47', accent: '#C9CFDA', line: 'rgba(201,207,218,0.35)' },
}

/**
 * Generated cover art for portfolio records. Deliberately abstract and labelled — it is NOT a
 * screenshot of client work (no approved screenshots exist yet; see TL-026).
 */
export function ProjectCover({ project, className = '' }: { project: Pick<ProjectDNA, 'slug' | 'cover'>; className?: string }) {
  const hue = HUES[project.cover.hue]
  const motif = project.cover.motif
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: hue.bg }}>
      <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`grid-${project.slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={hue.line} strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="260" fill={`url(#grid-${project.slug})`} />
        <g transform="translate(200 132)">
          {motif === 'grid' && (
            <g transform="matrix(0.866 0.4 -0.866 0.4 0 0)">
              <rect x="-90" y="-90" width="180" height="180" rx="10" fill={hue.plate} stroke={hue.line} />
              {[0, 1, 2].map((c) =>
                [0, 1, 2].map((r) => (
                  <rect key={`${c}${r}`} x={-76 + c * 52} y={-76 + r * 52} width="44" height="44" rx="5" fill={c === 1 && r === 1 ? hue.accent : hue.line} opacity={c === 1 && r === 1 ? 0.95 : 0.6} />
                )),
              )}
            </g>
          )}
          {motif === 'stack' &&
            [0, 1, 2].map((i) => (
              <g key={i} transform={`translate(0 ${-40 + i * 36}) matrix(0.866 0.4 -0.866 0.4 0 0)`}>
                <rect x="-80" y="-80" width="160" height="160" rx="10" fill={hue.plate} stroke={i === 0 ? hue.accent : hue.line} opacity={1 - i * 0.18} />
              </g>
            ))}
          {motif === 'orbit' && (
            <g fill="none">
              <ellipse rx="120" ry="48" stroke={hue.line} />
              <ellipse rx="78" ry="31" stroke={hue.line} />
              <circle r="18" fill={hue.accent} />
              <circle cx="120" cy="0" r="6" fill={hue.accent} />
              <circle cx="-55" cy="22" r="5" fill={hue.line} />
            </g>
          )}
          {motif === 'flow' && (
            <g fill="none">
              <path d="M-150 40 C -80 -60, 0 80, 60 -10 S 140 -40, 160 -30" stroke={hue.accent} strokeWidth="2" />
              <path d="M-150 60 C -70 -20, 10 100, 70 20 S 140 0, 160 4" stroke={hue.line} strokeWidth="1.2" />
              <circle cx="60" cy="-10" r="7" fill={hue.accent} />
            </g>
          )}
        </g>
      </svg>
      <span className="label-mono absolute bottom-3 left-3 text-[0.55rem] text-white/45">Cover art · not a screenshot</span>
    </div>
  )
}
