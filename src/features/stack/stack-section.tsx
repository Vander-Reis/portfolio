import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { stack } from './data'

export async function StackSection() {
  const t = await getTranslations('stack')
  return (
    <Section id="stack" index="06" eyebrow={t('eyebrow')} title={t.rich('title', rich)}>
      <div className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-5">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={i * 0.06} className="border-r border-b border-line p-6">
            <p className="font-mono text-xs text-muted">0{i + 1}</p>
            <h3 className="mt-6 text-h3 font-medium">{t(`groups.${group.id}`)}</h3>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.72rem] text-ink-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
