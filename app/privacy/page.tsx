import { PageHero } from '@/components/ui/primitives'
import { analyticsConfig, siteConfig } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const metadata = buildMetadata({ path: '/privacy' })

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Privacy', path: '/privacy' }]} label="Privacy" title="What this site collects — and what it does not." />
      <section className="section-y pt-12">
        <div className="container-x prose-rl max-w-3xl">
          <p>Last updated {formatDate(siteConfig.lastVerified)}. This notice covers {siteConfig.url.replace(/^https?:\/\//, '')}.</p>
          <h2 id="contact-form">Contact form</h2>
          <p>
            When you send a project brief, the details you enter (name, email, optional company and store URL, your answers and message) are used only to reply to
            your request. They are delivered by email or to a private workspace used to manage enquiries. They are not sold, shared for marketing, or added to a
            newsletter.
          </p>
          <p>Briefs are kept only as long as needed to handle the enquiry and any resulting project. You can ask for your data to be deleted at any time.</p>
          <h2 id="analytics">Analytics and cookies</h2>
          <p>
            {analyticsConfig.plausibleDomain
              ? 'This site uses Plausible Analytics, a privacy-friendly tool that does not use cookies or collect personal data. It records aggregate page views and events such as button clicks.'
              : 'This site does not currently load any third-party analytics. Interaction events stay in your browser and are not sent anywhere.'}{' '}
            The site does not set advertising or tracking cookies. Your 2D/3D display preference is stored locally in your browser.
          </p>
          <h2 id="assistant">“Ask Ring Lot” assistant</h2>
          <p>
            The assistant answers from information published on this site, entirely in your browser. Questions are not sent to a server. Voice input is used only
            when you press the microphone button, relies on your browser’s speech recognition, and stops when you press stop or close the assistant.
          </p>
          <h2 id="third-parties">Third-party links</h2>
          <p>Links to external platforms (for example Fiverr) are governed by those platforms’ own privacy policies.</p>
          <h2 id="contact">Questions</h2>
          <p>To ask about or delete your data, send a message through the contact form and mention “privacy request”.</p>
        </div>
      </section>
    </>
  )
}
