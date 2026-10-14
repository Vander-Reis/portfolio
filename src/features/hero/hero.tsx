import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { roles } from '@/features/career/data/roles'
import { timeToReachLevel } from '@/features/career/domain/career'
import { certifications } from '@/features/certifications/data'
import { Link } from '@/shared/i18n/navigation'
import { cn } from '@/shared/lib/cn'
import { buttonVariants } from '@/shared/ui/button'
import { Counter } from '@/shared/ui/counter'
import { Magnetic } from '@/shared/ui/magnetic'
import { Reveal } from '@/shared/ui/reveal'
import { type Segment, WordReveal } from './word-reveal'

export async function Hero() {
  const t = await getTranslations('hero')
  const title = t.raw('title') as Segment[]
  const monthsToSenior = timeToReachLevel(roles, 5) ?? 0

  const stats = [
    { value: monthsToSenior, suffix: '', label: t('stats.months') },
    { value: roles.length, suffix: '', label: t('stats.roles') },
    { value: certifications.length, suffix: '', label: t('stats.certs') },
    { value: new Date().getFullYear() - 2020, suffix: '+', label: t('stats.years') },
  ]

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />
      <div className="container-x">
        <p className="eyebrow mb-8 flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-ok" />
            <span className="relative inline-flex size-2 rounded-full bg-ok" />
          </span>
          {t('eyebrow')}
        </p>

        <h1 id="hero-title" className="max-w-[16ch] text-display font-medium">
          <WordReveal segments={title} />
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={0.5} className="md:col-span-7">
            <p className="max-w-xl text-lead text-ink-2">{t('lead')}</p>
          </Reveal>
          <Reveal delay={0.65} className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Magnetic>
              <Link href="/#cases" className={cn(buttonVariants({ size: 'lg' }))}>
                {t('ctaCases')} <ArrowDownRight aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/#contact" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>
                {t('ctaContact')} <ArrowUpRight aria-hidden />
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.8}>
          <dl className="mt-16 grid grid-cols-2 border-t border-line sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  'border-line py-6 pr-4',
                  i > 0 && 'sm:border-l sm:pl-6',
                  i % 2 === 1 && 'border-l pl-6',
                )}
              >
                <dt className="eyebrow">{s.label}</dt>
                <dd className="mt-2 text-h2 font-medium tabular-nums">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
