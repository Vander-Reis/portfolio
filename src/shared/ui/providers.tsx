'use client'

import { ReactLenis } from 'lenis/react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { type ReactNode, useEffect, useState } from 'react'

// Recursos do Motion carregados sob demanda (fora do bundle inicial).
const loadFeatures = () => import('./motion-features').then((mod) => mod.default)

export function Providers({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(false)

  useEffect(() => {
    // Lenis só para quem não pediu menos movimento e usa ponteiro fino.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    setSmooth(!reduce && fine)
  }, [])

  const content = (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )

  return smooth ? (
    <ReactLenis root options={{ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -80 } }}>
      {content}
    </ReactLenis>
  ) : (
    content
  )
}
