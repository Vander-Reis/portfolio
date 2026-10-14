import { useTranslations } from 'next-intl'
import { Link } from '@/shared/i18n/navigation'
import { buttonVariants } from '@/shared/ui/button'
import { rich } from '@/shared/ui/rich'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <section className="container-x grid min-h-[70vh] place-content-center py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-h1 font-medium">{t.rich('title', rich)}</h1>
      <p className="mt-4 text-ink-2">{t('body')}</p>
      <Link href="/" className={`${buttonVariants()} mx-auto mt-8`}>
        {t('cta')}
      </Link>
    </section>
  )
}
