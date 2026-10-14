import '../globals.css'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ViewTransitions } from 'next-view-transitions'
import type { ReactNode } from 'react'
import { env } from '@/shared/config/env'
import { geist, geistMono, instrument } from '@/shared/config/fonts'
import { site } from '@/shared/config/site'
import { getPathname } from '@/shared/i18n/navigation'
import { type Locale, routing } from '@/shared/i18n/routing'
import { cn } from '@/shared/lib/cn'
import { personJsonLd, serializeJsonLd } from '@/shared/lib/json-ld'
import { Footer } from '@/shared/ui/footer'
import { Header } from '@/shared/ui/header'
import { Providers } from '@/shared/ui/providers'
import { themeInitScript } from '@/shared/ui/theme-toggle'

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

// CSP com nonce exige HTML gerado por requisição (o nonce muda a cada resposta).
// Os dados externos continuam cacheados no Data Cache (GitHub: 1h).
export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0c' },
  ],
  colorScheme: 'light dark',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ href: '/', locale: l })]))

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t('title'), template: `%s · ${site.name}` },
    description: t('description'),
    applicationName: site.name,
    authors: [{ name: site.name, url: site.github.url }],
    creator: site.name,
    keywords: [
      'Vander Reis',
      'Back-end',
      '.NET',
      'C#',
      'Node.js',
      'TypeScript',
      'Next.js',
      'Clean Architecture',
      'DDD',
    ],
    alternates: {
      canonical: getPathname({ href: '/', locale }),
      languages: { ...languages, 'x-default': '/' },
    },
    openGraph: {
      type: 'profile',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
      siteName: site.name,
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      creator: site.x.handle,
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const nonce = (await headers()).get('x-nonce') ?? undefined
  const jsonLd = personJsonLd(locale as Locale, env.NEXT_PUBLIC_SITE_URL)

  return (
    <ViewTransitions>
      <html
        lang={locale}
        data-theme="light"
        suppressHydrationWarning
        className={cn(geist.variable, geistMono.variable, instrument.variable)}
      >
        <head>
          <script
            nonce={nonce}
            suppressHydrationWarning
            // biome-ignore lint/security/noDangerouslySetInnerHtml: script estático com nonce, evita flash de tema
            dangerouslySetInnerHTML={{ __html: themeInitScript }}
          />
          <script
            type="application/ld+json"
            nonce={nonce}
            suppressHydrationWarning
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado com escape
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
          />
        </head>
        <body>
          <NextIntlClientProvider>
            <Providers>
              <Header />
              <main id="main">{children}</main>
              <Footer />
            </Providers>
          </NextIntlClientProvider>
          {process.env.VERCEL ? <Analytics /> : null}
        </body>
      </html>
    </ViewTransitions>
  )
}
