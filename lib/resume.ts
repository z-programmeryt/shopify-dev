/**
 * RÉSUMÉ MODEL — built only from master data. The web résumé, print view and PDF all render this
 * object, so résumé facts can never drift from the site (brief §19).
 */
import { identity } from '@/data/identity'
import { positioning, proofFacts } from '@/data/professional'
import { projects } from '@/data/projects'
import { services } from '@/data/services'
import { skillGroups } from '@/data/skills'
import { contactChannels, siteConfig } from '@/data/site-config'

export interface ResumeData {
  name: string
  title: string
  summary: string
  location: string
  languages: string
  links: { label: string; value: string; href: string }[]
  experience: { role: string; org: string; period: string; points: string[] }[]
  services: { name: string; summary: string }[]
  skills: { group: string; items: string[] }[]
  record: { label: string; value: string; detail: string }[]
  portfolio: { title: string; industry: string; contribution: string }[]
  note: string
  verifiedOn: string
}

export function getResumeData(): ResumeData {
  return {
    name: identity.name,
    title: positioning.title,
    summary: positioning.intro,
    location: identity.countryName,
    languages: identity.languages.map((language) => language.name).join(', '),
    links: [
      { label: 'Website', value: siteConfig.url.replace(/^https?:\/\//, ''), href: siteConfig.url },
      { label: 'Fiverr', value: 'fiverr.com/ringlot465', href: contactChannels.fiverr.href },
    ],
    experience: [
      {
        role: 'Independent Shopify Developer & Designer',
        org: 'Fiverr (@ringlot465)',
        period: 'Dec 2021 – present',
        points: [
          'Shopify store builds and redesigns, including theme customization, apps and print-on-demand setups.',
          'Product and landing pages in GemPages, PageFly and Shogun.',
          'Meta Pixel + Conversions API, GA4 and Google Tag Manager tracking with deduplication.',
          'Facebook and Instagram Shop setup connected to store catalogs.',
        ],
      },
    ],
    services: services.map((service) => ({ name: service.name, summary: service.summary })),
    skills: skillGroups.map((group) => ({ group: group.name, items: group.skills.map((skill) => skill.name) })),
    record: proofFacts.map((fact) => ({ label: fact.label, value: fact.value, detail: fact.detail })),
    portfolio: projects
      .filter((project) => project.confidence !== 'low')
      .slice(0, 6)
      .map((project) => ({
        title: project.title,
        industry: project.industry,
        contribution: project.contribution.join(', '),
      })),
    note: 'Portfolio entries are self-reported on Fiverr. Platform figures verified on the date shown and may change.',
    verifiedOn: siteConfig.lastVerified,
  }
}
