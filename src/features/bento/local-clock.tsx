'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { Locale } from '@/shared/i18n/routing'
import { formatClock, isWorkingHours } from '@/shared/lib/time'

/** Horário local ao vivo. Antes da hidratação mostra "--:--:--" (evita mismatch de SSR). */
export function LocalClock({ timeZone }: { timeZone: string }) {
  const locale = useLocale() as Locale
  const t = useTranslations('bento')
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const working = now ? isWorkingHours(now, timeZone) : false

  return (
    <div>
      <p className="font-mono text-h2 font-medium tabular-nums tracking-tight" suppressHydrationWarning>
        <time dateTime={now?.toISOString()}>{now ? formatClock(now, timeZone, locale) : '--:--:--'}</time>
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm text-ink-2">
        <span
          className={`inline-block size-2 rounded-full ${working ? 'bg-ok' : 'bg-line-strong'}`}
          aria-hidden
        />
        {now ? (working ? t('clock.working') : t('clock.off')) : t('clock.loading')}
      </p>
    </div>
  )
}
