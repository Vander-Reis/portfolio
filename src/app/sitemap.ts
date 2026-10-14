import type { MetadataRoute } from 'next'
import { getAllCaseSlugs } from '@/features/cases/lib/cases'
import { env } from '@/shared/config/env'
import { getPathname } from '@/shared/i18n/navigation'
import { routing } from '@/shared/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const entry = (href: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${base}${getPathname({ href, locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${base}${getPathname({ href, locale: l })}`]),
      ),
    },
  })

  const slugs = [...new Set(getAllCaseSlugs().map((c) => c.slug))]
  return [entry('/', 1), entry('/security', 0.5), ...slugs.map((s) => entry(`/cases/${s}`, 0.8))]
}
