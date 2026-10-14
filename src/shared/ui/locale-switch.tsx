'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/shared/i18n/navigation'
import { cn } from '@/shared/lib/cn'

const labels = { 'pt-BR': 'PT', en: 'EN' } as const

export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('nav')

  return (
    <nav
      aria-label={t('language')}
      className="flex rounded-full border border-line p-0.5 font-mono text-[0.7rem]"
    >
      {(Object.keys(labels) as (keyof typeof labels)[]).map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          aria-current={l === locale ? 'true' : undefined}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            l === locale ? 'bg-ink text-bg' : 'text-muted hover:text-ink',
          )}
        >
          {labels[l]}
        </Link>
      ))}
    </nav>
  )
}
