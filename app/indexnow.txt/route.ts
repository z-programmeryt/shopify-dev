/**
 * IndexNow key file (served only when INDEXNOW_KEY is configured). Submissions reference it via
 * `keyLocation` (scripts/indexnow.ts). IndexNow is a notification, not a guarantee of indexing.
 */
export const dynamic = 'force-dynamic'

export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) return new Response('Not found', { status: 404 })
  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
