/**
 * PDF résumé generator (pdf-lib, pure JS, no headless browser). Renders getResumeData().
 * Standard PDF fonts use WinAnsi encoding, so text is sanitised to that character set.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { ResumeData } from './resume'

const NAVY = rgb(0.039, 0.086, 0.188)
const EMERALD = rgb(0.043, 0.478, 0.341)
const MUTED = rgb(0.314, 0.376, 0.478)
const RULE = rgb(0.86, 0.88, 0.91)

const A4: [number, number] = [595.28, 841.89]
const MARGIN = 48

/** Map characters outside WinAnsi to safe equivalents; drop anything else unsupported. */
export function sanitizeWinAnsi(text: string): string {
  const map: Record<string, string> = {
    '→': '->',
    '←': '<-',
    '★': '*',
    '≈': '~',
    '≤': '<=',
    '≥': '>=',
    '·': '·',
    '\u00a0': ' ',
  }
  return Array.from(text)
    .map((char) => {
      if (map[char] !== undefined) return map[char]
      const code = char.charCodeAt(0)
      if (code < 256) return char
      // WinAnsi extras commonly used in copy
      if ('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'.includes(char)) return char
      return ''
    })
    .join('')
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitizeWinAnsi(text).split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function renderResumePdf(data: ResumeData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`${data.name} — Résumé`)
  pdf.setAuthor(data.name)
  pdf.setSubject(data.title)
  pdf.setKeywords(['Shopify', 'Shopify developer', 'Shopify designer', 'GemPages', 'PageFly', 'Meta Pixel', 'GA4'])
  pdf.setCreator('ringlotmorong.com')

  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const width = A4[0] - MARGIN * 2

  let page: PDFPage = pdf.addPage(A4)
  let y = A4[1] - MARGIN

  const ensure = (needed: number) => {
    if (y - needed < MARGIN) {
      page = pdf.addPage(A4)
      y = A4[1] - MARGIN
    }
  }

  const text = (value: string, opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}) => {
    const font = opts.font ?? regular
    const size = opts.size ?? 10
    const indent = opts.indent ?? 0
    const lines = wrap(value, font, size, width - indent)
    for (const line of lines) {
      ensure(size + 4)
      page.drawText(line, { x: MARGIN + indent, y: y - size, size, font, color: opts.color ?? NAVY })
      y -= size + 4
    }
    y -= opts.gap ?? 0
  }

  const heading = (label: string) => {
    ensure(34)
    y -= 10
    page.drawText(sanitizeWinAnsi(label.toUpperCase()), { x: MARGIN, y: y - 9, size: 9, font: bold, color: EMERALD })
    y -= 15
    page.drawLine({ start: { x: MARGIN, y }, end: { x: MARGIN + width, y }, thickness: 0.6, color: RULE })
    y -= 10
  }

  // Header
  page.drawRectangle({ x: 0, y: A4[1] - 6, width: A4[0], height: 6, color: EMERALD })
  text(data.name, { font: bold, size: 24, gap: 2 })
  text(data.title, { size: 12, color: EMERALD, gap: 6 })
  text(`${data.location}  ·  ${data.languages}  ·  ${data.links.map((link) => link.value).join('  ·  ')}`, { size: 9, color: MUTED, gap: 4 })
  text(data.summary, { size: 10, gap: 2 })

  heading('Experience')
  for (const item of data.experience) {
    text(`${item.role} — ${item.org}`, { font: bold, size: 10.5 })
    text(item.period, { size: 9, color: MUTED, gap: 2 })
    for (const point of item.points) text(`•  ${point}`, { size: 9.5, indent: 6 })
  }

  heading('Verified record')
  for (const fact of data.record) text(`${fact.label}: ${fact.value} — ${fact.detail}`, { size: 9.5 })

  heading('Services')
  for (const service of data.services) {
    text(service.name, { font: bold, size: 9.5 })
    text(service.summary, { size: 9, color: MUTED, gap: 2 })
  }

  heading('Skills')
  for (const group of data.skills) text(`${group.group}: ${group.items.join(', ')}`, { size: 9.5, gap: 1 })

  heading('Selected portfolio entries')
  for (const project of data.portfolio) text(`${project.title} (${project.industry}) — ${project.contribution}`, { size: 9.5 })

  y -= 8
  text(`${data.note} Verified ${data.verifiedOn}.`, { size: 8, color: MUTED })

  return pdf.save()
}
