import { ArrowUpRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link as TransitionLink } from 'next-view-transitions'
import { getPathname } from '@/shared/i18n/navigation'
import type { Locale } from '@/shared/i18n/routing'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { SpotlightCard } from '@/shared/ui/spotlight-card'
import { earlyProjects } from './early-projects'
import { getCases } from './lib/cases'

export async function CasesSection() {
  const t = await getTranslations('cases')
  const locale = (await getLocale()) as Locale
  const cases = getCases(locale)

  return (
    <Section id="cases" index="03" eyebrow={t('eyebrow')} title={t.rich('title', rich)} intro={t('intro')}>
      <ol className="grid gap-4">
        {cases.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={0.04 * i}>
            <SpotlightCard className="group">
              <TransitionLink
                href={getPathname({ href: `/cases/${c.slug}`, locale })}
                className="grid gap-6 p-6 sm:p-8 md:grid-cols-12 md:items-center"
              >
                <span className="font-mono text-sm text-muted md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="md:col-span-7">
                  <p className="eyebrow">{c.kicker}</p>
                  <h3
                    className="mt-2 text-h3 font-medium sm:text-[1.75rem]"
                    style={{ viewTransitionName: `case-${c.slug}` }}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-ink-2">{c.summary}</p>
                </div>
                <ul className="flex flex-wrap gap-1.5 md:col-span-3">
                  {c.stack.slice(0, 4).map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] text-ink-2"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <span className="hidden justify-self-end md:col-span-1 md:block">
                  <span className="grid size-11 place-items-center rounded-full border border-line-strong transition-[background-color,color,transform] duration-(--duration-base) ease-(--ease-out-expo) group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
                    <ArrowUpRight className="size-4 rotate-45" aria-hidden />
                  </span>
                </span>
                <span className="sr-only">{t('read')}</span>
              </TransitionLink>
            </SpotlightCard>
          </Reveal>
        ))}
      </ol>

      <div className="mt-20 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="text-h3 font-medium">{t.rich('earlyTitle', rich)}</h3>
          <p className="mt-3 text-ink-2">{t('earlyIntro')}</p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-(--radius-card) border border-line bg-line sm:grid-cols-2 md:col-span-8">
          {earlyProjects.map((p) => (
            <li key={p.name} className="bg-surface">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface-2"
              >
                <span className="flex items-center justify-between font-mono text-sm">
                  {p.name}
                  <ArrowUpRight className="size-3.5 text-muted group-hover:text-accent" aria-hidden />
                </span>
                <span className="text-sm text-ink-2">{p.description[locale]}</span>
                <span className="mt-auto pt-2 font-mono text-[0.7rem] text-muted">{p.stack}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
