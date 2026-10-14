import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { SpotlightCard } from '@/shared/ui/spotlight-card'
import { certifications } from './data'
import { Seal } from './seal'

export async function CertificationsSection() {
  const t = await getTranslations('certifications')
  return (
    <Section
      id="certifications"
      index="05"
      eyebrow={t('eyebrow')}
      title={t.rich('title', rich)}
      intro={t('intro')}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {certifications.map((cert, i) => (
          <Reveal
            as="li"
            key={cert.id}
            delay={(i % 4) * 0.06}
            className={cn(cert.featured && 'sm:col-span-2')}
          >
            <SpotlightCard
              className={cn('flex h-full flex-col gap-6 p-6', cert.featured && 'border-accent/30')}
            >
              <div className="flex items-start justify-between gap-4">
                <Seal cert={cert} className={cert.featured ? 'size-20' : undefined} />
                <span className="font-mono text-xs text-muted">{cert.year}</span>
              </div>
              <div className="mt-auto">
                <p className="eyebrow">{cert.issuer}</p>
                <h3 className={cn('mt-2 font-medium', cert.featured ? 'text-h3' : 'text-base')}>
                  {cert.title}
                </h3>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-ink-2 underline-offset-4 hover:text-accent hover:underline"
                >
                  {t('credential')}
                  <span className="sr-only">: {cert.title}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
