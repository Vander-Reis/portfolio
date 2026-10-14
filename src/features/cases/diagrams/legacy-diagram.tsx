'use client'

import { m, useInView, useReducedMotion } from 'motion/react'
import { useId, useRef } from 'react'
import { ease } from '@/shared/lib/motion'
import { DiagramScroller } from './flow-diagram'

const cobol = [
  'IDENTIFICATION DIVISION.',
  'PROGRAM-ID. CALCJUROS.',
  'DATA DIVISION.',
  '01 WS-SALDO  PIC 9(9)V99.',
  '01 WS-TAXA   PIC 9V9999.',
  'PROCEDURE DIVISION.',
  '    PERFORM CALC-JUROS',
  '    MOVE WS-RESULT TO OUT-REC',
  '    WRITE OUT-REC.',
  '    STOP RUN.',
]

/** Anéis da Clean Architecture, de dentro para fora. */
const rings = [
  { label: 'Domain', sub: 'entities · value objects', w: 150, h: 70 },
  { label: 'Application', sub: 'use cases', w: 230, h: 150 },
  { label: 'Infrastructure', sub: 'Oracle · EF Core', w: 310, h: 230 },
  { label: 'API', sub: '.NET Core', w: 380, h: 300 },
]

const CX = 680
const CY = 205

export function LegacyDiagram({
  title,
  description,
  arrowLabel,
}: {
  title: string
  description: string
  arrowLabel: string
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const arrow = 'M 345 205 C 400 205, 420 205, 480 205'
  const codeDone = cobol.length * 0.09

  return (
    <DiagramScroller ref={ref} label={title}>
      <svg
        viewBox="0 0 900 400"
        role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}
        className="h-auto w-full min-w-[640px]"
      >
        <title id={`${uid}-t`}>{title}</title>
        <desc id={`${uid}-d`}>{description}</desc>

        {/* COBOL */}
        <m.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4 }}
        >
          <rect x={20} y={40} width={325} height={330} rx={14} className="fill-ink" />
          <circle cx={42} cy={62} r={4} className="fill-bg/25" />
          <circle cx={56} cy={62} r={4} className="fill-bg/25" />
          <circle cx={70} cy={62} r={4} className="fill-bg/25" />
          <text
            x={325}
            y={66}
            textAnchor="end"
            className="fill-bg/50 font-mono"
            fontSize={10.5}
            letterSpacing={1}
          >
            CALCJUROS.CBL
          </text>
        </m.g>
        {cobol.map((line, i) => (
          <m.text
            key={line}
            x={40}
            y={100 + i * 25}
            className="fill-bg/85 font-mono"
            fontSize={12}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: [0, 1, 1, 0.35], x: 40 } : undefined}
            transition={{ duration: 2.2, times: [0, 0.15, 0.7, 1], delay: i * 0.09, ease: ease.outExpo }}
          >
            {line}
          </m.text>
        ))}

        {/* Seta de migração */}
        <m.path
          d={arrow}
          fill="none"
          strokeWidth={1.5}
          className="stroke-accent"
          strokeDasharray="4 5"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.8, delay: codeDone, ease: ease.inOutQuart }}
        />
        <m.text
          x={412}
          y={190}
          textAnchor="middle"
          className="fill-accent font-mono"
          fontSize={10.5}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: codeDone + 0.4 }}
        >
          {arrowLabel}
        </m.text>
        {inView && !reduce
          ? [0, 0.6, 1.2].map((offset) => (
              <rect key={offset} width={7} height={7} rx={1.5} className="fill-accent">
                <animateMotion
                  dur="1.8s"
                  repeatCount="indefinite"
                  begin={`${codeDone + 0.8 + offset}s`}
                  path="M 345 201 C 400 201, 420 201, 476 201"
                />
              </rect>
            ))
          : null}

        {/* Clean Architecture: anéis desenhados de dentro para fora */}
        {rings.map((ring, i) => {
          const x = CX - ring.w / 2
          const y = CY - ring.h / 2
          const delay = codeDone + 0.6 + i * 0.35
          const isCore = i === 0
          return (
            <g key={ring.label}>
              <m.rect
                x={x}
                y={y}
                width={ring.w}
                height={ring.h}
                rx={16 + i * 4}
                className={isCore ? 'fill-accent stroke-accent' : 'fill-none stroke-line-strong'}
                strokeWidth={1.25}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.8, delay, ease: ease.inOutQuart }}
              />
              <m.text
                x={CX}
                y={isCore ? CY - 2 : y + 22}
                textAnchor="middle"
                className={
                  isCore ? 'fill-accent-ink font-sans font-medium' : 'fill-ink font-sans font-medium'
                }
                fontSize={isCore ? 15 : 13}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ delay: delay + 0.4 }}
              >
                {ring.label}
              </m.text>
              <m.text
                x={CX}
                y={isCore ? CY + 16 : y + 37}
                textAnchor="middle"
                className={isCore ? 'fill-accent-ink/75 font-mono' : 'fill-muted font-mono'}
                fontSize={10}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ delay: delay + 0.5 }}
              >
                {ring.sub}
              </m.text>
            </g>
          )
        })}
      </svg>
    </DiagramScroller>
  )
}
