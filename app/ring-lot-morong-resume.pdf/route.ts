import { getResumeData } from '@/lib/resume'
import { renderResumePdf } from '@/lib/resume-pdf'

/** Static PDF résumé generated at build time from master data (/data). */
export const dynamic = 'force-static'

export async function GET() {
  const bytes = await renderResumePdf(getResumeData())
  return new Response(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="ring-lot-morong-resume.pdf"',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
