import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/shared/i18n/navigation'
import { cn } from '@/shared/lib/cn'
import { buttonVariants } from '@/shared/ui/button'
import { Reveal } from '@/shared/ui/reveal'
import { rich } from '@/shared/ui/rich'
import { Section } from '@/shared/ui/section'

const checks = [
  "CSP · nonce + 'strict-dynamic'",
  'HSTS preload',
  'COOP · CORP',
  'frame-ancestors none',
  'Turnstile + rate limit',
  'CodeQL · gitleaks · ZAP',
] as const

export async function SecurityTeaser() {
  const t = await getTranslations('securityTeaser')
  return (
    <Section id="security" index="09" eyebrow={t('eyebrow')} title={t.rich('title', rich)}>
      <Reveal>
        <div className="grid gap-8 rounded-(--radius-card) border border-line bg-ink p-8 text-bg sm:p-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <ShieldCheck className="size-8 text-accent" aria-hidden />
            <p className="mt-6 text-lead text-bg/80">{t('body')}</p>
            <Link href="/security" className={cn(buttonVariants({ variant: 'accent' }), 'mt-8')}>
              {t('cta')} <ArrowUpRight aria-hidden />
            </Link>
          </div>
          <ul className="grid content-start gap-px overflow-hidden rounded-xl bg-bg/10 sm:grid-cols-2 md:col-span-7">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-3 bg-ink p-4 font-mono text-sm text-bg/85">
                <span className="text-accent" aria-hidden>
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
