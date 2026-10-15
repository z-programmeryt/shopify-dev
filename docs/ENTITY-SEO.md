# Entity SEO

Goal: search engines and AI systems should consistently understand **Ring Lot Morong** as a Shopify developer &
designer, connected only to profiles that are verifiably his.

## Entity definition (rendered on every page)

```json
{
  "@type": "Person",
  "@id": "https://ringlotmorong.com/#person",
  "name": "Ring Lot Morong",
  "givenName": "Ring Lot",
  "familyName": "Morong",
  "alternateName": ["Ringlot Morong", "Ringlot"],
  "jobTitle": "Shopify Developer & Designer",
  "description": "Shopify developer and designer building conversion-focused stores, GemPages/PageFly landing pages and Meta/GA4 tracking for e-commerce brands.",
  "url": "https://ringlotmorong.com",
  "sameAs": ["https://www.fiverr.com/ringlot465"],
  "knowsLanguage": ["en", "bn"],
  "address": { "@type": "PostalAddress", "addressCountry": "BD" },
  "knowsAbout": ["Shopify", "Shopify theme customization", "E-commerce website design", "Landing page design",
                 "GemPages", "PageFly", "Conversion rate optimization", "Meta Pixel", "Meta Conversions API",
                 "Google Analytics 4", "Google Tag Manager"]
}
```

`WebSite` (`/#website`) is published by the Person; `/about` is a `ProfilePage` whose `mainEntity` is the Person.

## Consistency rules

| Signal | Rule |
| --- | --- |
| Name | "Ring Lot Morong" everywhere on-site; alternate spellings only in `alternateName` |
| Title | "Shopify Developer & Designer" (site, résumé, OG, profiles) |
| Location | Country only (Bangladesh); never emphasised |
| Photo | None yet — monogram used consistently until an approved photo exists (`data/identity.ts`) |
| sameAs | Verified nodes only (test-enforced) |
| Facts | Only publishable ledger claims; dated |

## Known inconsistencies to resolve (owner)

1. Fiverr display name "Ecom R" and bio spelling "RINGLOT" vs "Ring Lot Morong".
2. Fiverr bio numbers that contradict each other (see TRUTH-LEDGER conflicts).
3. Domain ownership (ringlotmorong.com) unconfirmed.

## Strengthening the entity (no spam)

- LinkedIn profile with identical name/title + website link (highest value missing node).
- Profiles link back to the canonical website (reciprocal links are the strongest identity evidence).
- Publish reviewed insights under his name (author entity) once he has reviewed the drafts.
- Upgrade case files with client-approved detail — real, specific work is what creates authority.
