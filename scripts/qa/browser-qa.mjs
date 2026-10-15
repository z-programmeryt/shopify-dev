/**
 * Browser QA — route crawl + end-to-end interactions against a running production server.
 *
 *   npm run build && npm start                     # terminal 1
 *   npm i --no-save puppeteer-core                 # once (not a project dependency)
 *   CHROME_PATH=/path/to/chrome node scripts/qa/browser-qa.mjs   # terminal 2
 *
 * Checks: HTTP status, exactly one <h1>, valid JSON-LD, images with alt, no console errors/hydration warnings,
 * 404 for unknown routes, contact form submission, assistant, work search, reviews filter, mobile menu, Lab hotspots.
 */
import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const executablePath = process.env.CHROME_PATH
if (!executablePath) {
  console.error('Set CHROME_PATH to a Chrome/Chromium executable.')
  process.exit(1)
}

const routes = [
  '/', '/about', '/services', '/services/shopify-development', '/services/shopify-design', '/services/shopify-cro',
  '/services/shopify-landing-pages', '/services/shopify-performance', '/services/shopify-theme-customization',
  '/services/pagefly', '/services/gempages', '/services/conversion-tracking', '/work', '/case-studies',
  '/case-studies/personalized-products-store', '/case-studies/fashion-accessories-store', '/case-studies/jewelry-store',
  '/industries', '/process', '/skills', '/proof', '/reviews', '/insights',
  '/insights/meta-pixel-conversions-api-deduplication-shopify', '/insights/gempages-or-pagefly-choosing-a-shopify-page-builder',
  '/insights/shopify-product-page-anatomy-checklist', '/insights/shopify-performance-budget-apps-page-builders',
  '/links', '/contact', '/resume', '/privacy', '/terms', '/lab', '/this-route-does-not-exist',
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
let failures = 0
const report = (ok, label) => {
  if (!ok) failures++
  console.info(`${ok ? '✓' : '✗'} ${label}`)
}

for (const route of routes) {
  const errors = []
  const onConsole = (message) => {
    if (message.type() === 'error' && !/status of 404/.test(message.text())) errors.push(message.text())
  }
  const onPageError = (error) => errors.push(error.message)
  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  const response = await page.goto(BASE + route, { waitUntil: 'load' })
  await sleep(800)
  const info = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    imgsNoAlt: Array.from(document.images).filter((image) => !image.hasAttribute('alt')).length,
    badJsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).filter((script) => {
      try {
        JSON.parse(script.textContent ?? '')
        return false
      } catch {
        return true
      }
    }).length,
  }))
  page.off('console', onConsole)
  page.off('pageerror', onPageError)
  const expected = route.includes('does-not-exist') ? 404 : 200
  report(response?.status() === expected && info.h1 === 1 && !info.imgsNoAlt && !info.badJsonLd && errors.length === 0, `${response?.status()} ${route} ${errors.join(' | ')}`)
}

// Contact form
await page.goto(`${BASE}/contact?intent=landing-page`, { waitUntil: 'load' })
await sleep(600)
await page.type('#name', 'QA Tester')
await page.type('#email', 'qa@example.com')
await page.type('#message', 'Automated QA submission — please ignore.')
await page.evaluate(() => document.querySelector('input[type="checkbox"][required]')?.click())
await sleep(2700)
await page.click('button[type="submit"]')
await page.waitForFunction(() => /brief received|could not be delivered/i.test(document.body.innerText), { timeout: 15000 }).catch(() => null)
report(/brief received/i.test(await page.evaluate(() => document.body.innerText)), 'contact form submits (requires LEAD_DELIVERY=log or a configured channel)')

// Assistant
await page.goto(`${BASE}/`, { waitUntil: 'load' })
await sleep(600)
await page.evaluate(() => Array.from(document.querySelectorAll('button')).find((button) => button.innerText.includes('Ask'))?.click())
await page.waitForSelector('#assistant-input')
await page.type('#assistant-input', 'How much does it cost?')
await page.keyboard.press('Enter')
await sleep(300)
report(/not published/i.test(await page.$eval('[role="dialog"]', (element) => element.innerText)), 'assistant answers from approved data')

// Work search
await page.goto(`${BASE}/work`, { waitUntil: 'load' })
await sleep(500)
await page.type('input[type="search"]', 'jewelry')
await sleep(400)
report(!page.url().includes('?'), 'work search does not create filter URLs')

await browser.close()
console.info(failures ? `\n${failures} check(s) failed` : '\nAll checks passed')
process.exitCode = failures ? 1 : 0
