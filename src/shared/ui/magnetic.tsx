'use client'

import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { type PointerEvent, type ReactNode, useRef } from 'react'
import { spring } from '@/shared/lib/motion'

/** Atrai levemente o conteúdo em direção ao cursor. Desligado com reduced motion e em touch. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), spring.snappy)
  const y = useSpring(useMotionValue(0), spring.snappy)

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.span ref={ref} className="inline-block" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.span>
  )
}
