'use client'

import type { ComponentProps, PointerEvent } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Card com brilho radial que acompanha o cursor. Atualiza apenas CSS custom
 * properties (sem re-render do React) — custo praticamente zero.
 */
export function SpotlightCard({ className, children, ...props }: ComponentProps<'div'>) {
  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      onPointerMove={onMove}
      className={cn(
        'spotlight rounded-(--radius-card) border border-line bg-surface transition-colors duration-(--duration-base) hover:border-line-strong',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
