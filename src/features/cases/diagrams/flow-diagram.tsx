'use client'

import { m, useInView, useReducedMotion } from 'motion/react'
import { useId, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { ease } from '@/shared/lib/motion'
import type { DiagramEdge, DiagramNode, DiagramSpec } from './types'

const NODE_H = 58

type Box = { x: number; y: number; w: number; h: number }
const box = (n: DiagramNode): Box => ({ x: n.x, y: n.y, w: n.w ?? 150, h: n.h ?? NODE_H })

/** Caminho cúbico entre as bordas mais próximas de dois nós. Função pura. */
export function edgePath(a: Box, b: Box): string {
  const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 }
  const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 }
  const dx = bc.x - ac.x
  const dy = bc.y - ac.y
  if (Math.abs(dx) >= Math.abs(dy) * 0.9) {
    const x1 = dx > 0 ? a.x + a.w : a.x
    const x2 = dx > 0 ? b.x : b.x + b.w
    const mid = (x1 + x2) / 2
    return `M ${x1} ${ac.y} C ${mid} ${ac.y}, ${mid} ${bc.y}, ${x2} ${bc.y}`
  }
  const y1 = dy > 0 ? a.y + a.h : a.y
  const y2 = dy > 0 ? b.y : b.y + b.h
  const mid = (y1 + y2) / 2
  return `M ${ac.x} ${y1} C ${ac.x} ${mid}, ${bc.x} ${mid}, ${bc.x} ${y2}`
}

function midpoint(a: Box, b: Box) {
  return { x: (a.x + a.w / 2 + b.x + b.w / 2) / 2, y: (a.y + a.h / 2 + b.y + b.h / 2) / 2 }
}

/**
 * Contêiner com rolagem horizontal em telas estreitas. Focável e rotulado para
 * ser alcançável por teclado (WCAG 2.1.1 — axe: scrollable-region-focusable).
 */
export function DiagramScroller({
  label,
  children,
  ref,
}: {
  label: string
  children: React.ReactNode
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <section
      ref={ref}
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: região rolável precisa ser alcançável por teclado
      tabIndex={0}
      className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
      data-lenis-prevent
    >
      {children}
    </section>
  )
}

export function FlowDiagram({ spec, title }: { spec: DiagramSpec; title: string }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const nodes = new Map(spec.nodes.map((n) => [n.id, n]))

  const nodeDelay = (i: number) => i * 0.08
  const edgeDelay = (i: number) => 0.35 + i * 0.12
  const flowStart = 0.35 + spec.edges.length * 0.12

  const edges = spec.edges.flatMap((e: DiagramEdge, i) => {
    const from = nodes.get(e.from)
    const to = nodes.get(e.to)
    if (!from || !to) return []
    const a = box(from)
    const b = box(to)
    return [{ ...e, i, d: edgePath(a, b), mid: midpoint(a, b) }]
  })

  return (
    <DiagramScroller ref={ref} label={title}>
      <svg
        viewBox={`0 0 ${spec.width} ${spec.height}`}
        role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}
        className="h-auto w-full min-w-[640px] text-muted"
      >
        <title id={`${uid}-t`}>{title}</title>
        <desc id={`${uid}-d`}>{spec.description}</desc>
        <defs>
          <marker
            id={`${uid}-arrow`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-line-strong" />
          </marker>
        </defs>

        {spec.groups?.map((g) => (
          <m.g
            key={g.label}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6 }}
          >
            <rect
              x={g.x}
              y={g.y}
              width={g.w}
              height={g.h}
              rx={16}
              className="fill-surface-2/60 stroke-line"
              strokeDasharray="4 5"
            />
            <text x={g.x + 14} y={g.y + 20} className="fill-muted font-mono" fontSize={11} letterSpacing={1}>
              {g.label.toUpperCase()}
            </text>
          </m.g>
        ))}

        {edges.map((e) => (
          <g key={`${e.from}-${e.to}`}>
            <m.path
              d={e.d}
              fill="none"
              className="stroke-line-strong"
              strokeWidth={1.5}
              strokeDasharray={e.dashed ? '5 6' : undefined}
              markerEnd={`url(#${uid}-arrow)`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.7, ease: ease.inOutQuart, delay: edgeDelay(e.i) }}
            />
            {e.label ? (
              <m.text
                x={e.mid.x}
                y={e.mid.y - 8}
                textAnchor="middle"
                className="fill-muted font-mono"
                fontSize={10.5}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ delay: edgeDelay(e.i) + 0.5 }}
              >
                {e.label}
              </m.text>
            ) : null}
            {/* Mensagens fluindo entre serviços (SMIL, sem JS por frame). */}
            {e.flow && inView && !reduce ? (
              <circle r={3.5} className="fill-accent">
                <animateMotion
                  dur={`${1.8 + (e.i % 3) * 0.35}s`}
                  repeatCount="indefinite"
                  begin={`${flowStart + e.i * 0.25}s`}
                  path={e.d}
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.65 0 0.35 1"
                />
              </circle>
            ) : null}
          </g>
        ))}

        {spec.nodes.map((n, i) => {
          const b = box(n)
          return (
            <m.g
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease: ease.outExpo, delay: nodeDelay(i) }}
            >
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={12}
                className={cn(
                  n.tone === 'ink' && 'fill-ink stroke-ink',
                  n.tone === 'accent' && 'fill-accent-soft stroke-accent',
                  (!n.tone || n.tone === 'default') && 'fill-surface stroke-line-strong',
                )}
                strokeWidth={1}
              />
              <text
                x={b.x + b.w / 2}
                y={b.y + (n.sub ? b.h / 2 - 5 : b.h / 2 + 5)}
                textAnchor="middle"
                className={cn('font-sans font-medium', n.tone === 'ink' ? 'fill-bg' : 'fill-ink')}
                fontSize={14}
              >
                {n.label}
              </text>
              {n.sub ? (
                <text
                  x={b.x + b.w / 2}
                  y={b.y + b.h / 2 + 13}
                  textAnchor="middle"
                  className={cn('font-mono', n.tone === 'ink' ? 'fill-bg/70' : 'fill-muted')}
                  fontSize={10.5}
                >
                  {n.sub}
                </text>
              ) : null}
            </m.g>
          )
        })}
      </svg>
    </DiagramScroller>
  )
}
