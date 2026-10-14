/**
 * Tokens de animação. Uma única fonte para curvas e durações — os mesmos
 * valores existem como CSS custom properties em globals.css.
 */
export const ease = {
  /** Entradas: rápido no início, pousa suave. Padrão do site. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Transições de estado (ida e volta). */
  inOutQuart: [0.76, 0, 0.24, 1],
} as const

export const duration = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  slower: 0.9,
} as const

export const spring = {
  /** Botões magnéticos e micro-interações. */
  snappy: { type: 'spring', stiffness: 300, damping: 22, mass: 0.6 },
  /** Contadores e elementos maiores. */
  soft: { type: 'spring', stiffness: 90, damping: 20 },
} as const

export const stagger = {
  words: 0.045,
  items: 0.08,
} as const

/** Entra uma vez quando ~30% do elemento aparece. */
export const viewportOnce = { once: true, amount: 0.3 } as const
