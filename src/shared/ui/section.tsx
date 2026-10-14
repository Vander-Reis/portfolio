import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** Cabeçalho editorial de seção: número + eyebrow + título com palavra em serif. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('container-x py-20 sm:py-28', className)}>
      <header className="mb-12 grid gap-6 border-t border-line pt-6 sm:mb-16 md:grid-cols-12">
        <p className="eyebrow md:col-span-3">
          <span className="text-ink">{index}</span> — {eyebrow}
        </p>
        <div className="md:col-span-9">
          <h2 id={`${id}-title`} className="text-h2 font-medium">
            {title}
          </h2>
          {intro ? <p className="mt-5 max-w-2xl text-lead text-ink-2">{intro}</p> : null}
        </div>
      </header>
      {children}
    </section>
  )
}
