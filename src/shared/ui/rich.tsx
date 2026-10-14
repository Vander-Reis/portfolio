import type { ReactNode } from 'react'

/** Tags usadas em mensagens do next-intl: <em>palavra</em> vira Instrument Serif itálico. */
export const rich = {
  em: (chunks: ReactNode) => <em className="em-serif">{chunks}</em>,
  accent: (chunks: ReactNode) => <em className="em-serif text-accent">{chunks}</em>,
  b: (chunks: ReactNode) => <strong className="font-semibold text-ink">{chunks}</strong>,
}
