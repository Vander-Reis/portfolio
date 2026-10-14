'use client'

import { m, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { duration, ease } from '@/shared/lib/motion'

export type TimelineItem = {
  id: string
  date: string
  dateTime: string
  title: string
  company: string
  level: number
  summary: string
  highlights: string[]
  current: boolean
}

const MAX_LEVEL = 5

function LevelMeter({ level, label }: { level: number; label: string }) {
  return (
    <div className="flex items-end gap-1" role="img" aria-label={label}>
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <m.span
          // biome-ignore lint/suspicious/noArrayIndexKey: barras fixas e ordenadas
          key={i}
          className={cn('w-1.5 origin-bottom rounded-sm', i < level ? 'bg-accent' : 'bg-line')}
          style={{ height: 6 + i * 4 }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: duration.base, ease: ease.outExpo, delay: 0.15 + i * 0.07 }}
        />
      ))}
    </div>
  )
}

/** Linha vertical desenhada conforme o scroll; cada cargo "sobe de nível". */
export function Timeline({
  items,
  levelLabel,
  currentLabel,
}: {
  items: TimelineItem[]
  levelLabel: string
  currentLabel: string
}) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[calc(25%+7px)]" />
      <m.span
        aria-hidden
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent md:left-[calc(25%+7px)]"
        style={{ scaleY }}
      />
      {items.map((item, i) => (
        <li
          key={item.id}
          className="relative grid gap-3 pb-14 pl-10 last:pb-0 md:grid-cols-4 md:gap-8 md:pl-0"
        >
          <div className="md:pt-0.5 md:pr-10 md:text-right">
            <time dateTime={item.dateTime} className="font-mono text-sm text-muted">
              {item.date}
            </time>
          </div>

          <m.span
            aria-hidden
            className={cn(
              'absolute top-1 left-0 grid size-[15px] place-items-center rounded-full border-2 bg-bg md:left-[25%]',
              item.current ? 'border-accent' : 'border-line-strong',
            )}
            initial={{ scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
          >
            {item.current ? <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" /> : null}
          </m.span>

          <m.div
            className="md:col-span-3 md:pl-10"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.7rem] text-ink-2">
                LV.{item.level}
              </span>
              <LevelMeter level={item.level} label={`${levelLabel} ${item.level}/${MAX_LEVEL}`} />
              {item.current ? (
                <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[0.7rem] text-accent-ink">
                  {currentLabel}
                </span>
              ) : null}
            </div>
            <h3 className={cn('mt-4 font-medium', i === items.length - 1 ? 'text-h2' : 'text-h3')}>
              {item.title} <span className="em-serif text-muted">· {item.company}</span>
            </h3>
            <p className="mt-3 max-w-2xl text-ink-2">{item.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.highlights.map((h) => (
                <li key={h} className="rounded-full border border-line px-3 py-1 text-sm text-ink-2">
                  {h}
                </li>
              ))}
            </ul>
          </m.div>
        </li>
      ))}
    </ol>
  )
}
