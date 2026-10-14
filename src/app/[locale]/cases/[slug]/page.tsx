import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link as TransitionLink } from 'next-view-transitions'
import { CaseDiagram } from '@/features/cases/diagrams/case-diagram'
import { getAdjacentCases, getCase } from '@/features/cases/lib/cases'
import { MDXContent } from '@/features/cases/mdx-content'
import { getPathname } from '@/shared/i18n/navigation'
import { routing } from '@/shared/i18n/routing'
import { Reveal } from '@/shared/ui/reveal'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const entry = getCase(locale, slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.summary,
    alternates: {
      canonical: getPathname({ href: `/cases/${slug}`, locale }),
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, getPathname({ href: `/cases/${slug}`, locale: l })]),
      ),
    },
    openGraph: { type: 'article', title: entry.title, description: entry.summary },
  }
}

export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const entry = getCase(locale, slug)
  if (!entry) notFound()
  const t = await getTranslations('caseDetail')
  const { prev, next } = getAdjacentCases(locale, slug)
  const home = getPathname({ href: '/', locale })

  const steps = [
    { key: 'context', body: entry.context },
    { key: 'problem', body: entry.problem },
    { key: 'solution', body: entry.solution },
  ] as const

  return (
    <article className="pt-28 pb-24 sm:pt-36">
      <div className="container-x">
        <TransitionLink
          href={`${home === '/' ? '' : home}/#cases`}
          className="eyebrow inline-flex items-center gap-2 hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> {t('back')}
        </TransitionLink>

        <header className="mt-10 grid gap-8 border-b border-line pb-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="eyebrow">{entry.kicker}</p>
            <h1 className="mt-4 text-h1 font-medium" style={{ viewTransitionName: `case-${entry.slug}` }}>
              {entry.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-ink-2">{entry.summary}</p>
          </div>
          <div className="grid content-end gap-5 text-sm md:col-span-4">
            <dl className="grid gap-5">
              <div>
                <dt className="eyebrow">{t('period')}</dt>
                <dd className="mt-1">{entry.period}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t('role')}</dt>
                <dd className="mt-1">{entry.role}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t('stack')}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {entry.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem]"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            {entry.repo ? (
              <a
                href={entry.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-accent"
              >
                {t('repo')} <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : null}
            {entry.confidential ? (
              <p className="flex items-start gap-2 text-muted">
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {t('confidential')}
              </p>
            ) : null}
          </div>
        </header>

        <section aria-labelledby="architecture" className="py-14">
          <h2 id="architecture" className="eyebrow mb-6">
            {t('architecture')}
          </h2>
          <div className="rounded-(--radius-card) border border-line bg-surface p-4 sm:p-8">
            <CaseDiagram diagram={entry.diagram} title={entry.title} locale={locale} />
          </div>
        </section>

        <div className="grid gap-12 md:grid-cols-12">
          <ol className="grid gap-10 md:col-span-7">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.key}>
                <p className="font-mono text-xs text-muted">0{i + 1}</p>
                <h2 className="mt-2 text-h3 font-medium">{t(s.key)}</h2>
                <p className="mt-3 leading-relaxed text-ink-2">{s.body}</p>
              </Reveal>
            ))}
            <Reveal as="li">
              <p className="font-mono text-xs text-muted">04</p>
              <h2 className="mt-2 text-h3 font-medium">{t('decisions')}</h2>
              <ul className="mt-4 grid gap-3">
                {entry.architecture.map((a) => (
                  <li key={a} className="flex gap-3 text-ink-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </ol>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="sticky top-24 rounded-(--radius-card) border border-line bg-surface p-6">
              <h2 className="eyebrow">{t('results')}</h2>
              <dl className="mt-4 grid gap-5">
                {entry.results.map((r) => (
                  <div key={r.label} className="border-t border-line pt-4 first:border-0 first:pt-0">
                    <dt className="sr-only">{r.label}</dt>
                    <dd className="text-h2 font-medium tracking-tight">{r.value}</dd>
                    <dd className="mt-1 text-sm text-ink-2">{r.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <div className="mt-16 max-w-3xl border-t border-line pt-6">
          <MDXContent code={entry.body} />
        </div>

        <nav aria-label={t('more')} className="mt-20 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <TransitionLink href={getPathname({ href: `/cases/${prev.slug}`, locale })} className="group">
              <span className="eyebrow flex items-center gap-2">
                <ArrowLeft className="size-3.5" aria-hidden /> {t('prev')}
              </span>
              <span className="mt-2 block font-medium group-hover:text-accent">{prev.title}</span>
            </TransitionLink>
          ) : (
            <span />
          )}
          {next ? (
            <TransitionLink
              href={getPathname({ href: `/cases/${next.slug}`, locale })}
              className="group sm:text-right"
            >
              <span className="eyebrow flex items-center gap-2 sm:justify-end">
                {t('next')} <ArrowRight className="size-3.5" aria-hidden />
              </span>
              <span className="mt-2 block font-medium group-hover:text-accent">{next.title}</span>
            </TransitionLink>
          ) : null}
        </nav>
      </div>
    </article>
  )
}
