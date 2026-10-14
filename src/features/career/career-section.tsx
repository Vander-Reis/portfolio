import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale } from '@/shared/i18n/routing'
import { pick } from '@/shared/lib/l10n'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { roles } from './data/roles'
import { formatDuration, timeToReachLevel } from './domain/career'
import { Timeline, type TimelineItem } from './timeline'

function formatMonth(ym: string, locale: Locale): string {
  const [y, mo] = ym.split('-').map(Number)
  const date = new Date(Date.UTC(y ?? 2000, (mo ?? 1) - 1, 15))
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
  // pt-BR: "out. de 2021" → "out/2021"
  return locale === 'pt-BR'
    ? fmt
        .formatToParts(date)
        .filter((p) => p.type === 'month' || p.type === 'year')
        .map((p) => p.value.replace('.', ''))
        .join('/')
    : fmt.format(date)
}

export async function CareerSection() {
  const t = await getTranslations('career')
  const locale = (await getLocale()) as Locale
  const months = timeToReachLevel(roles, 5) ?? 0

  const items: TimelineItem[] = roles.map((r, i) => ({
    id: r.id,
    date: formatMonth(r.start, locale),
    dateTime: r.start,
    title: pick(r.title, locale),
    company: r.company,
    level: r.level,
    summary: pick(r.summary, locale),
    highlights: r.highlights.map((h) => pick(h, locale)),
    current: i === roles.length - 1,
  }))

  return (
    <Section
      id="career"
      index="04"
      eyebrow={t('eyebrow')}
      title={t.rich('title', { ...rich, duration: formatDuration(months, locale) })}
      intro={t('intro')}
    >
      <Timeline items={items} levelLabel={t('level')} currentLabel={t('current')} />
    </Section>
  )
}
