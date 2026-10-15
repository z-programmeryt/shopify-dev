import type { Metadata, Viewport } from 'next'
import './globals.css'
import { instrumentSans, instrumentSerif, jetbrainsMono } from './fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/ui/JsonLd'
import { ClientEnhancements } from '@/components/layout/ClientEnhancements'
import { graph, personSchema, websiteSchema } from '@/lib/schema'
import { positioning } from '@/data/professional'
import { siteConfig } from '@/data/site-config'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${positioning.title}`, template: `%s | ${siteConfig.name}` },
  description: positioning.summary,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: siteConfig.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Marks JS availability before paint so reveal animations never hide content for no-JS users. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-navy-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={graph(personSchema(), websiteSchema())} />
        <ClientEnhancements />
      </body>
    </html>
  )
}
