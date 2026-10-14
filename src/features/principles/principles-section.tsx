import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { SpotlightCard } from '@/shared/ui/spotlight-card'

const principles = [
  { id: 'tdd', code: 'red → green → refactor' },
  { id: 'clean', code: 'domain ← application ← infra' },
  { id: 'ddd', code: 'bounded context · ubiquitous language' },
  { id: 'mentoring', code: 'pair · review · explain why' },
  { id: 'docs', code: 'ADR · README · runbook' },
] as const

export async function PrinciplesSection() {
  const t = await getTranslations('principles')
  return (
    <Section
      id="principles"
      index="07"
      eyebrow={t('eyebrow')}
      title={t.rich('title', rich)}
      intro={t('intro')}
    >
      <ol className="grid gap-4 md:grid-cols-6">
        {principles.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 0.06} className={i < 2 ? 'md:col-span-3' : 'md:col-span-2'}>
            <SpotlightCard className="flex h-full flex-col p-7">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-8 text-h3 font-medium">{t(`items.${p.id}.title`)}</h3>
              <p className="mt-3 text-ink-2">{t(`items.${p.id}.body`)}</p>
              <code className="mt-auto pt-8 font-mono text-xs text-accent">{p.code}</code>
            </SpotlightCard>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
