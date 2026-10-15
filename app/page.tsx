import { HeroEngine } from '@/components/home/HeroEngine'
import { ProofWall } from '@/components/proof/ProofWall'
import { FinalCta, FitAndNext, LabTeaser, ProcessPreview, SelectedWork, ServicesIndex } from '@/components/home/sections'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/' })

/**
 * Home — not Hero→Services→Portfolio→About→Contact. The narrative follows the Commerce Engine:
 * identity + engine (DISCOVER) → proof (DIAGNOSE trust) → work → services → process → lab → fit → contact.
 */
export default function HomePage() {
  return (
    <>
      <HeroEngine />
      <ProofWall />
      <SelectedWork />
      <ServicesIndex />
      <ProcessPreview />
      <LabTeaser />
      <FitAndNext />
      <FinalCta />
    </>
  )
}
