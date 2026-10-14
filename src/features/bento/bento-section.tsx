import { ArrowUpRight, GitCommitHorizontal, GraduationCap, MapPin } from 'lucide-react'
import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { roles } from '@/features/career/data/roles'
import { currentRole } from '@/features/career/domain/career'
import { certifications } from '@/features/certifications/data'
import { Seal } from '@/features/certifications/seal'
import type { Commit } from '@/features/github/domain/github'
import { coreStack } from '@/features/stack/data'
import { site } from '@/shared/config/site'
import type { Locale } from '@/shared/i18n/routing'
import { cn } from '@/shared/lib/cn'
import { pick } from '@/shared/lib/l10n'
import { relativeTime } from '@/shared/lib/time'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { SpotlightCard } from '@/shared/ui/spotlight-card'
import { LocalClock } from './local-clock'

function Cell({
  className,
  delay,
  children,
}: {
  className?: string
  delay?: number
  children: React.ReactNode
}) {
  return (
    <Reveal delay={delay} className={className}>
      <SpotlightCard className="flex h-full flex-col p-6">{children}</SpotlightCard>
    </Reveal>
  )
}

export async function BentoSection({ latestCommit }: { latestCommit: Commit | null }) {
  const t = await getTranslations('bento')
  const locale = (await getLocale()) as Locale
  const role = currentRole(roles)
  const oracle = certifications.filter((c) => c.issuer === 'Oracle')

  return (
    <Section id="about" index="02" eyebrow={t('eyebrow')} title={t.rich('title', rich)}>
      <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-12">
        {/* Foto */}
        <Cell className="md:col-span-4 md:row-span-2" delay={0}>
          <div className="relative -mx-6 -mt-6 mb-6 aspect-[4/5] overflow-hidden rounded-t-(--radius-card) bg-surface-2 md:aspect-auto md:flex-1">
            <Image
              src={site.avatar}
              alt={t('photoAlt')}
              fill
              sizes="(min-width: 768px) 380px, 100vw"
              className="object-cover grayscale-[20%]"
              priority
            />
          </div>
          <p className="text-h3 font-medium">{site.name}</p>
          <p className="mt-1 text-sm text-ink-2">
            {pick(role.title, locale)} · {role.company}
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-3.5" aria-hidden /> {pick(site.location, locale)}
          </p>
        </Cell>

        {/* Agora */}
        <Cell className="md:col-span-8" delay={0.05}>
          <p className="eyebrow">{t('now')}</p>
          <p className="mt-4 max-w-2xl text-h3 leading-snug font-medium md:text-[1.75rem]">
            {pick(site.nowWorkingOn, locale)}
          </p>
          <p className="mt-auto pt-6 text-sm text-ink-2">{t.rich('nowFoot', rich)}</p>
        </Cell>

        {/* Relógio */}
        <Cell className="md:col-span-4" delay={0.1}>
          <p className="eyebrow">{t('clock.label')}</p>
          <div className="mt-auto pt-6">
            <LocalClock timeZone={site.timeZone} />
          </div>
        </Cell>

        {/* Último commit */}
        <Cell className="md:col-span-4" delay={0.15}>
          <p className="eyebrow flex items-center gap-2">
            <GitCommitHorizontal className="size-3.5" aria-hidden /> {t('commit.label')}
          </p>
          {latestCommit ? (
            <a
              href={latestCommit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-auto block pt-6"
            >
              <p className="font-mono text-xs text-muted">
                {latestCommit.repo} · <span className="text-accent">{latestCommit.sha}</span>
              </p>
              <p className="mt-2 line-clamp-2 font-medium group-hover:underline">{latestCommit.message}</p>
              <p className="mt-2 text-sm text-muted">
                {latestCommit.date ? relativeTime(latestCommit.date, new Date(), locale) : null}
              </p>
            </a>
          ) : (
            <p className="mt-auto pt-6 text-sm text-muted">{t('commit.empty')}</p>
          )}
        </Cell>

        {/* Stack */}
        <Cell className="md:col-span-6" delay={0.2}>
          <p className="eyebrow">{t('stack')}</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-6">
            {coreStack.map((s, i) => (
              <li
                key={s}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm',
                  i < 3 ? 'border-ink bg-ink text-bg' : 'border-line-strong text-ink',
                )}
              >
                {s}
              </li>
            ))}
          </ul>
        </Cell>

        {/* Oracle */}
        <Cell className="md:col-span-6" delay={0.25}>
          <p className="eyebrow">{t('oracle')}</p>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
            <div className="flex -space-x-3">
              {oracle.map((c) => (
                <Seal key={c.id} cert={c} className="size-14 rounded-full ring-4 ring-surface" />
              ))}
            </div>
            <a href="#certifications" className="group text-sm leading-snug">
              {oracle.map((c) => (
                <span key={c.id} className="block font-medium group-hover:text-accent">
                  {c.title} <span className="font-mono text-xs text-muted">· {c.year}</span>
                </span>
              ))}
            </a>
          </div>
        </Cell>

        {/* Formação + fora do código */}
        <Cell className="md:col-span-12" delay={0.3}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <GraduationCap className="size-3.5" aria-hidden /> {t('education')}
              </p>
              <p className="mt-3 font-medium">{site.education.school}</p>
              <p className="text-sm text-ink-2">{pick(site.education.course, locale)}</p>
            </div>
            <div>
              <p className="eyebrow">{t('offline')}</p>
              <p className="mt-3 text-ink-2">{pick(site.offline, locale)}</p>
              <a
                href={site.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm hover:text-accent"
              >
                github.com/{site.github.user} <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </Cell>
      </div>
    </Section>
  )
}
