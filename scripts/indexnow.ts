/**
 * Notify IndexNow-participating search engines (Bing, Yandex, Seznam, Naver…) about URLs.
 * Usage (after a production deploy): INDEXNOW_KEY=... NEXT_PUBLIC_SITE_URL=https://ringlotmorong.com SITE_ENV=production npx tsx scripts/indexnow.ts
 * Optional: pass specific paths as arguments, e.g. `npx tsx scripts/indexnow.ts /services /work`.
 * IndexNow is a hint to crawl — it never guarantees indexing.
 */
import sitemap from '../app/sitemap'

async function main() {
  const key = process.env.INDEXNOW_KEY
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (!key || !site) throw new Error('INDEXNOW_KEY and NEXT_PUBLIC_SITE_URL are required.')
  if (process.env.SITE_ENV !== 'production') throw new Error('Refusing to submit: SITE_ENV is not "production".')

  const origin = new URL(site).origin
  const paths = process.argv.slice(2)
  const urlList = paths.length ? paths.map((path) => `${origin}${path}`) : sitemap().map((entry) => entry.url)
  if (urlList.length === 0) throw new Error('No URLs to submit (is the site indexable?).')

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(origin).host, key, keyLocation: `${origin}/indexnow.txt`, urlList }),
  })
  console.info(`IndexNow responded ${response.status} for ${urlList.length} URLs.`)
  if (response.status >= 400) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
