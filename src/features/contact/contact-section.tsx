import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { env } from '@/shared/config/env'
import { site } from '@/shared/config/site'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'
import { ContactForm } from './contact-form'

export async function ContactSection() {
  const t = await getTranslations('contact')
  const links = [
    { label: 'LinkedIn', href: site.linkedin, handle: 'vander-reis' },
    { label: 'GitHub', href: site.github.url, handle: site.github.user },
    { label: 'X', href: site.x.url, handle: site.x.handle },
  ]
  return (
    <Section id="contact" index="10" eyebrow={t('eyebrow')} title={t.rich('title', rich)} intro={t('intro')}>
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <ContactForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
          <p className="eyebrow">{t('elsewhere')}</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4"
                >
                  <span>
                    <span className="block font-medium">{l.label}</span>
                    <span className="font-mono text-xs text-muted">{l.handle}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
