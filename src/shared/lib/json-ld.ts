import { certifications } from '@/features/certifications/data'
import { site } from '@/shared/config/site'
import type { Locale } from '@/shared/i18n/routing'

/** JSON-LD schema.org/Person com cargo, empresa e certificações. */
export function personJsonLd(locale: Locale, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url,
    image: site.avatar,
    jobTitle: site.role[locale],
    worksFor: { '@type': 'Organization', name: site.company },
    address: { '@type': 'PostalAddress', addressRegion: 'MG', addressCountry: 'BR' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: site.education.school },
    knowsAbout: [
      'Node.js',
      'C#',
      '.NET Core',
      'TypeScript',
      'Next.js',
      'React',
      'Clean Architecture',
      'DDD',
      'TDD',
    ],
    sameAs: [site.github.url, site.linkedin, site.x.url],
    hasCredential: certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.title,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      dateCreated: String(c.year),
    })),
  }
}

/** Serializa com segurança para <script type="application/ld+json"> (evita quebra por "</script>"). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}
