import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/shared/i18n/routing'
import { FlowDiagram } from './flow-diagram'
import { LegacyDiagram } from './legacy-diagram'
import { getDiagramSpec } from './specs'
import type { DiagramKey } from './types'

export async function CaseDiagram({
  diagram,
  title,
  locale,
}: {
  diagram: DiagramKey
  title: string
  locale: Locale
}) {
  const t = await getTranslations('cases')
  if (diagram === 'legacy') {
    return <LegacyDiagram title={title} description={t('legacyDiagram')} arrowLabel={t('legacyArrow')} />
  }
  return <FlowDiagram spec={getDiagramSpec(diagram, locale)} title={title} />
}
