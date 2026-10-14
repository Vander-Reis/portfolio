import { cases as allCases } from '#content'
import type { Locale } from '@/shared/i18n/routing'

export type CaseEntry = (typeof allCases)[number]

/** Consultas sobre o conteúdo gerado pelo Velite (validado por Zod no build). */
export function getCases(locale: Locale): CaseEntry[] {
  return allCases.filter((c) => c.locale === locale).sort((a, b) => a.order - b.order)
}

export function getCase(locale: Locale, slug: string): CaseEntry | undefined {
  return allCases.find((c) => c.locale === locale && c.slug === slug)
}

export function getAdjacentCases(locale: Locale, slug: string) {
  const list = getCases(locale)
  const i = list.findIndex((c) => c.slug === slug)
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  }
}

export function getAllCaseSlugs() {
  return allCases.map((c) => ({ locale: c.locale, slug: c.slug }))
}
