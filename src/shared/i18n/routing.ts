import { defineRouting } from 'next-intl/routing'

export const locales = ['pt-BR', 'en'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'pt-BR',
  // pt-BR em "/", inglês em "/en".
  localePrefix: 'as-needed',
})

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
