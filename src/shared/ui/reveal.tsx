'use client'

import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { duration, ease, viewportOnce } from '@/shared/lib/motion'

/** Fade + leve subida quando entra na viewport. Reduced motion é tratado pelo MotionConfig. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  const Comp = m[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: duration.slow, ease: ease.outExpo, delay }}
    >
      {children}
    </Comp>
  )
}
