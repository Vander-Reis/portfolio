import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { owaspTop10 } from '@/features/security/owasp'
import { site } from '@/shared/config/site'
import { routing } from '@/shared/i18n/routing'
import { redactNonce, securityHeaders } from '@/shared/lib/csp'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'securityPage' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

const pipeline = [
  'lint',
  'typecheck',
  'test',
  'build',
  'CodeQL',
  'gitleaks',
  'pnpm audit',
  'SBOM',
  'ZAP',
  'Lighthouse',
] as const

export default async function SecurityPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('securityPage')
  // A mesma CSP enviada nesta resposta (o middleware a repassa na requisição).
  const csp = redactNonce((await headers()).get('content-security-policy') ?? '')

  const formLayers = ['honeypot', 'rateLimit', 'zod', 'turnstile', 'sanitize', 'logs'] as const

  return (
    <article className="pt-32 pb-24 sm:pt-40">
      <div className="container-x">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1 className="mt-4 max-w-[18ch] text-h1 font-medium">{t.rich('title', rich)}</h1>
        <p className="mt-6 max-w-2xl text-lead text-ink-2">{t('intro')}</p>

        {/* Headers */}
        <section aria-labelledby="headers" className="mt-20">
          <h2 id="headers" className="text-h2 font-medium">
            {t('headersTitle')}
          </h2>
          <div className="mt-8 overflow-hidden rounded-(--radius-card) border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 font-mono text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="p-4">
                    Header
                  </th>
                  <th scope="col" className="hidden p-4 md:table-cell">
                    {t('value')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {Object.entries(securityHeaders).map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row" className="p-4 align-top font-medium">
                      {k}
                      <code className="mt-1 block font-mono text-xs font-normal break-all text-muted md:hidden">
                        {v}
                      </code>
                    </th>
                    <td className="hidden p-4 font-mono text-xs break-all text-ink-2 md:table-cell">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CSP */}
        <section aria-labelledby="csp" className="mt-20 grid gap-8 md:grid-cols-12">
          <div className="min-w-0 md:col-span-4">
            <h2 id="csp" className="text-h2 font-medium">
              CSP
            </h2>
            <p className="mt-4 text-ink-2">{t('cspBody')}</p>
          </div>
          <div className="min-w-0 md:col-span-8">
            <p className="eyebrow mb-3">{t('cspLive')}</p>
            <pre
              className="overflow-x-auto rounded-(--radius-card) bg-ink p-6 font-mono text-xs leading-relaxed text-bg/90"
              data-lenis-prevent
              // biome-ignore lint/a11y/noNoninteractiveTabindex: região rolável precisa ser alcançável por teclado (WCAG 2.1.1)
              tabIndex={0}
            >
              {csp
                .split('; ')
                .map((d) => d.trim())
                .join(';\n')}
            </pre>
          </div>
        </section>

        {/* Formulário */}
        <section aria-labelledby="form" className="mt-20">
          <h2 id="form" className="text-h2 font-medium">
            {t('formTitle')}
          </h2>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-(--radius-card) border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {formLayers.map((layer, i) => (
              <Reveal as="li" key={layer} delay={i * 0.05} className="bg-surface p-6">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="mt-3 font-medium">{t(`form.${layer}.title`)}</h3>
                <p className="mt-2 text-sm text-ink-2">{t(`form.${layer}.body`)}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* CI */}
        <section aria-labelledby="ci" className="mt-20">
          <h2 id="ci" className="text-h2 font-medium">
            {t('ciTitle')}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-2">{t('ciBody')}</p>
          <ol className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs">
            {pipeline.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-line-strong bg-surface px-3 py-1.5">{step}</span>
                {i < pipeline.length - 1 ? (
                  <span className="text-muted" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        {/* OWASP */}
        <section aria-labelledby="owasp" className="mt-20">
          <h2 id="owasp" className="text-h2 font-medium">
            OWASP Top 10 <span className="em-serif text-muted">2025</span>
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {owaspTop10.map((item) => (
              <li key={item.id} className="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
                <span className="font-mono text-sm text-accent md:col-span-1">{item.id}</span>
                <span className="font-medium md:col-span-4">{item.name}</span>
                <p className="text-sm text-ink-2 md:col-span-7">{item.how[locale]}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Divulgação */}
        <section
          aria-labelledby="disclosure"
          className="mt-20 rounded-(--radius-card) border border-line bg-surface p-8"
        >
          <h2 id="disclosure" className="text-h3 font-medium">
            {t('disclosureTitle')}
          </h2>
          <p className="mt-3 max-w-2xl text-ink-2">{t('disclosureBody')}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a
              href="/.well-known/security.txt"
              className="inline-flex items-center gap-1 font-mono hover:text-accent"
            >
              /.well-known/security.txt <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
            <a
              href={`${site.github.url}/vander-portfolio/blob/main/SECURITY.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono hover:text-accent"
            >
              SECURITY.md <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </div>
        </section>
      </div>
    </article>
  )
}
