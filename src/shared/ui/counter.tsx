'use client'

import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ease } from '@/shared/lib/motion'

/** Número que conta de 0 até `value` ao entrar na tela. Renderiza o valor final no SSR (SEO / sem JS). */
export function Counter({
  value,
  suffix = '',
  className,
}: {
  value: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduce) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: ease.outExpo,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, suffix])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
