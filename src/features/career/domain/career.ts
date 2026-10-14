import type { Locale } from '@/shared/i18n/routing'
import type { L10n } from '@/shared/lib/l10n'

/** "YYYY-MM" */
export type YearMonth = `${number}-${number}`

export type Role = {
  id: string
  start: YearMonth
  company: string
  /** 1 = estágio … 5 = sênior. Sobe a cada promoção. */
  level: number
  title: L10n
  summary: L10n
  highlights: L10n[]
}

const YEAR_MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/

function parse(ym: string): number {
  const match = YEAR_MONTH.exec(ym)
  if (!match) throw new Error(`Data inválida: ${ym}`)
  return Number(match[1]) * 12 + (Number(match[2]) - 1)
}

export function monthsBetween(from: string, to: string): number {
  const diff = parse(to) - parse(from)
  if (diff < 0) throw new Error(`Intervalo invertido: ${from} → ${to}`)
  return diff
}

export function currentRole(roles: readonly Role[]): Role {
  const last = roles.at(-1)
  if (!last) throw new Error('Trajetória vazia')
  return last
}

/** Meses do primeiro cargo até o primeiro cargo com nível ≥ `level`. */
export function timeToReachLevel(roles: readonly Role[], level: number): number | null {
  const first = roles[0]
  const reached = roles.find((r) => r.level >= level)
  if (!first || !reached) return null
  return monthsBetween(first.start, reached.start)
}

export function levelProgress(level: number, max: number): number {
  return Math.min(1, Math.max(0, level / max))
}

const units = {
  'pt-BR': { year: ['ano', 'anos'], month: ['mês', 'meses'], and: 'e' },
  en: { year: ['year', 'years'], month: ['month', 'months'], and: 'and' },
} as const

export function formatDuration(totalMonths: number, locale: Locale): string {
  const u = units[locale]
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const part = (n: number, [one, many]: readonly [string, string]) => `${n} ${n === 1 ? one : many}`
  const parts = [years > 0 && part(years, u.year), months > 0 && part(months, u.month)].filter(Boolean)
  return parts.join(` ${u.and} `)
}
