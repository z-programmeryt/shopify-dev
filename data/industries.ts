/**
 * INDUSTRIES — categories represented in the published portfolio (TL-027).
 * "What matters" bullets are category-level design considerations (approach), not claims of results.
 */

export interface Industry {
  id: string
  name: string
  summary: string
  whatMatters: string[]
}

export const industries: Industry[] = [
  {
    id: 'fashion-apparel',
    name: 'Fashion & apparel',
    summary: 'Clothing, footwear and accessories — where fit, variants and imagery decide the sale.',
    whatMatters: [
      'Size guides and fit notes next to the size selector, not in a footer link.',
      'Colour swatches that change the gallery, with sold-out variants clearly marked.',
      'Returns and exchange terms visible before checkout.',
      'Collection filters for size, colour and price that work on mobile.',
    ],
  },
  {
    id: 'beauty-cosmetics',
    name: 'Beauty & cosmetics',
    summary: 'Skincare, cosmetics and personal care — where trust and ingredient clarity matter.',
    whatMatters: [
      'Ingredients, usage and skin-type guidance structured for scanning.',
      'Shade or variant selection with accurate imagery.',
      'Reviews placed near the purchase decision, with real photos when available.',
      'Bundles and replenishment offers that fit how the products are used.',
    ],
  },
  {
    id: 'jewelry-accessories',
    name: 'Jewelry & accessories',
    summary: 'Small, detailed, often gifted products — where close-up media and reassurance carry the page.',
    whatMatters: [
      'Close-up, zoomable photography and scale references.',
      'Materials, sizing and care details next to the price.',
      'Gift messaging, packaging and delivery dates surfaced early.',
      'Trust signals sized for a considered purchase.',
    ],
  },
  {
    id: 'personalized-pod',
    name: 'Personalized & print-on-demand',
    summary: 'Custom and made-to-order products — where the personalisation step is the product page.',
    whatMatters: [
      'A personalisation flow that is obvious, forgiving and previewable.',
      'Production and delivery times stated before the customer commits.',
      'Upload and text validation that prevents unusable orders.',
      'Print-on-demand connections (Printify, Printful) mapped to the right variants.',
    ],
  },
  {
    id: 'social-commerce',
    name: 'Social commerce',
    summary: 'Facebook and Instagram Shops connected to the store catalog.',
    whatMatters: [
      'A clean product catalog synced from Shopify, with correct categories and images.',
      'Product tagging and shop approval handled without catalog errors.',
      'Pixel and Conversions API events consistent with the store’s own tracking.',
    ],
  },
  {
    id: 'general-store',
    name: 'General & dropshipping stores',
    summary: 'Single-niche and general stores, often launched fast for testing products.',
    whatMatters: [
      'Honest shipping times and clear policies — the basics that prevent chargebacks.',
      'A lean app stack so test stores stay fast.',
      'Product pages that can be duplicated quickly for new products.',
    ],
  },
]

export function getIndustry(id: string): Industry | undefined {
  return industries.find((industry) => industry.id === id)
}
