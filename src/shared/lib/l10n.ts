import type { Locale } from '@/shared/i18n/routing'

/** Texto de conteúdo nos dois idiomas. UI strings ficam em messages/*.json. */
export type L10n = Record<Locale, string>

export function pick(text: L10n, locale: Locale): string {
  return text[locale]
}
