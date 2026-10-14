import { getTranslations } from 'next-intl/server'
import { site } from '@/shared/config/site'
import { Link } from '@/shared/i18n/navigation'

export async function Footer() {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {site.name}. {t('built')}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <Link href="/security" className="hover:text-ink">
              {t('security')}
            </Link>
          </li>
          <li>
            <a href={site.github.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.x.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              X
            </a>
          </li>
          <li>
            <a href="/.well-known/security.txt" className="font-mono hover:text-ink">
              security.txt
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
