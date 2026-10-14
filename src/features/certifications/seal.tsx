import { useId } from 'react'
import { cn } from '@/shared/lib/cn'
import type { Certification } from './data'

const marks: Record<Certification['issuer'], string> = { Oracle: 'O', Rocketseat: 'RS', ProgramadorBr: 'PB' }

/** Selo circular com texto em arco — puro SVG, sem imagens externas. */
export function Seal({ cert, className }: { cert: Certification; className?: string }) {
  const id = `seal-${cert.id}-${useId().replace(/:/g, '')}`
  const featured = cert.featured
  return (
    <svg viewBox="0 0 100 100" className={cn('size-16 shrink-0', className)} aria-hidden="true">
      <defs>
        <path id={id} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="48" className={featured ? 'fill-accent' : 'fill-surface-2'} />
      <circle
        cx="50"
        cy="50"
        r="30"
        className={cn('fill-none', featured ? 'stroke-accent-ink/40' : 'stroke-line-strong')}
        strokeDasharray="2 3"
      />
      <text
        className={cn('font-mono uppercase', featured ? 'fill-accent-ink' : 'fill-muted')}
        fontSize="8.5"
        letterSpacing="2.4"
      >
        <textPath href={`#${id}`}>
          {cert.issuer} · {cert.year} · {cert.issuer} · {cert.year} ·
        </textPath>
      </text>
      <text
        x="50"
        y="50"
        dominantBaseline="central"
        textAnchor="middle"
        className={cn('em-serif', featured ? 'fill-accent-ink' : 'fill-ink')}
        fontSize={marks[cert.issuer].length > 1 ? 22 : 30}
      >
        {marks[cert.issuer]}
      </text>
    </svg>
  )
}
