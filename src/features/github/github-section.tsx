import { ArrowUpRight, Star } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { site } from '@/shared/config/site'
import type { Locale } from '@/shared/i18n/routing'
import { relativeTime } from '@/shared/lib/time'
import { Counter } from '@/shared/ui/counter'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { SpotlightCard } from '@/shared/ui/spotlight-card'
import type { GithubSnapshot } from './infra/github-client'

export async function GithubSection({ snapshot }: { snapshot: GithubSnapshot }) {
  const t = await getTranslations('github')
  const locale = (await getLocale()) as Locale
  const now = new Date()
  const { profile, repos, latestCommit } = snapshot

  return (
    <Section id="github" index="08" eyebrow={t('eyebrow')} title={t.rich('title', rich)} intro={t('intro')}>
      <div className="grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <SpotlightCard className="flex h-full flex-col p-6">
            <p className="eyebrow">@{site.github.user}</p>
            {profile ? (
              <dl className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted">{t('repos')}</dt>
                  <dd className="text-h2 font-medium tabular-nums">
                    <Counter value={profile.publicRepos} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">{t('followers')}</dt>
                  <dd className="text-h2 font-medium tabular-nums">
                    <Counter value={profile.followers} />
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-6 text-sm text-muted">{t('unavailable')}</p>
            )}
            {latestCommit ? (
              <div className="mt-8 border-t border-line pt-5">
                <p className="eyebrow">{t('lastCommit')}</p>
                <a
                  href={latestCommit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-3 block"
                >
                  <span className="font-mono text-xs text-accent">{latestCommit.sha}</span>{' '}
                  <span className="font-medium group-hover:underline">{latestCommit.message}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {latestCommit.repo} ·{' '}
                    {latestCommit.date ? relativeTime(latestCommit.date, now, locale) : ''}
                  </span>
                </a>
              </div>
            ) : null}
            <a
              href={site.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1 pt-8 text-sm hover:text-accent"
            >
              {t('profile')} <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </SpotlightCard>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 md:col-span-8">
          {repos.length === 0 ? (
            <li className="rounded-(--radius-card) border border-dashed border-line p-6 text-sm text-muted sm:col-span-2">
              {t('unavailable')}
            </li>
          ) : (
            repos.map((r, i) => (
              <Reveal as="li" key={r.name} delay={i * 0.05}>
                <SpotlightCard className="h-full">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col p-5"
                  >
                    <span className="flex items-start justify-between gap-3 font-mono text-sm font-medium">
                      <span className="break-all">{r.name}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted" aria-hidden />
                    </span>
                    <span className="mt-2 line-clamp-2 text-sm text-ink-2">
                      {r.description ?? t('noDescription')}
                    </span>
                    <span className="mt-auto flex items-center gap-3 pt-4 font-mono text-[0.7rem] text-muted">
                      {r.language ? (
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-accent" aria-hidden />
                          {r.language}
                        </span>
                      ) : null}
                      {r.stars > 0 ? (
                        <span className="flex items-center gap-1">
                          <Star className="size-3" aria-hidden /> {r.stars}
                        </span>
                      ) : null}
                      <span>{relativeTime(r.pushedAt, now, locale)}</span>
                    </span>
                  </a>
                </SpotlightCard>
              </Reveal>
            ))
          )}
        </ul>
      </div>
      <p className="mt-6 font-mono text-xs text-muted">{t('cache')}</p>
    </Section>
  )
}
