import localFont from 'next/font/local'

/**
 * Self-hosted fonts (SIL OFL — licences in app/fonts). No network font requests to third parties.
 * Files are subset to Latin + the punctuation the site uses (fonttools); JetBrains Mono is a static
 * 500 instance. Only the primary family is preloaded; mono and serif are small accents.
 */
export const instrumentSans = localFont({
  src: './fonts/InstrumentSans-Variable.woff2',
  variable: '--font-instrument-sans',
  weight: '400 700',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
})

export const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-Medium.woff2',
  variable: '--font-jetbrains-mono',
  weight: '500',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
})

export const instrumentSerif = localFont({
  src: './fonts/InstrumentSerif-Italic.woff2',
  variable: '--font-instrument-serif',
  weight: '400',
  style: 'italic',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Times New Roman',
})
