import { setRequestLocale } from 'next-intl/server'
import { BentoSection } from '@/features/bento/bento-section'
import { CareerSection } from '@/features/career/career-section'
import { CasesSection } from '@/features/cases/cases-section'
import { CertificationsSection } from '@/features/certifications/certifications-section'
import { ContactSection } from '@/features/contact/contact-section'
import { GithubSection } from '@/features/github/github-section'
import { getGithubSnapshot } from '@/features/github/infra/github-client'
import { Hero } from '@/features/hero/hero'
import { PrinciplesSection } from '@/features/principles/principles-section'
import { SecurityTeaser } from '@/features/security/security-teaser'
import { StackSection } from '@/features/stack/stack-section'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const github = await getGithubSnapshot()

  return (
    <>
      <Hero />
      <BentoSection latestCommit={github.latestCommit} />
      <CasesSection />
      <CareerSection />
      <CertificationsSection />
      <StackSection />
      <PrinciplesSection />
      <GithubSection snapshot={github} />
      <SecurityTeaser />
      <ContactSection />
    </>
  )
}
