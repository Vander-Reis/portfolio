'use client'

import { m, useReducedMotion } from 'motion/react'
import { Fragment } from 'react'
import { cn } from '@/shared/lib/cn'
import { duration, ease, stagger } from '@/shared/lib/motion'

export type Segment = { text: string; style?: 'em' | 'accent' }

/**
 * Revela o texto palavra por palavra (blur → foco). O texto completo está no
 * HTML do SSR — leitores de tela e crawlers leem a frase normalmente.
 */
export function WordReveal({
  segments,
  className,
  delay = 0,
}: {
  segments: Segment[]
  className?: string
  delay?: number
}) {
  // Com reduced motion o texto aparece direto (sem blur nem opacidade animados).
  const reduce = useReducedMotion()
  let index = 0
  return (
    <span className={className}>
      {segments.map((segment, s) => {
        const words = segment.text.split(/(\s+)/)
        return (
          <Fragment key={`${s}-${segment.text}`}>
            {words.map((word, w) => {
              if (/^\s+$/.test(word) || word === '') return word
              const i = index++
              return (
                <m.span
                  key={`${s}-${w}-${word}`}
                  className={cn(
                    'inline-block will-change-[filter,transform,opacity]',
                    segment.style === 'em' && 'em-serif',
                    segment.style === 'accent' && 'em-serif text-accent',
                  )}
                  initial={reduce ? false : { opacity: 0, filter: 'blur(10px)', y: '0.25em' }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{
                    duration: duration.slower,
                    ease: ease.outExpo,
                    delay: delay + i * stagger.words,
                  }}
                >
                  {word}
                </m.span>
              )
            })}
          </Fragment>
        )
      })}
    </span>
  )
}
