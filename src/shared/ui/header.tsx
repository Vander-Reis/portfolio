'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Link } from '@/shared/i18n/navigation'
import { cn } from '@/shared/lib/cn'
import { LocaleSwitch } from './locale-switch'
import { ThemeToggle } from './theme-toggle'

const items = ['cases', 'career', 'certifications', 'stack', 'contact'] as const

export function Header() {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-(--duration-base)',
        scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        {t('skip')}
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-medium tracking-tight"
          aria-label="Vander Reis — home"
        >
          <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-[0.7rem] text-bg transition-colors group-hover:bg-accent">
            VR
          </span>
          <span className="hidden sm:inline">Vander Reis</span>
        </Link>

        <nav aria-label={t('main')} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {items.map((item) => (
              <li key={item}>
                <Link
                  href={`/#${item}`}
                  className="rounded-full px-3 py-1.5 text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {t(item)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('close') : t('open')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label={t('main')} className="container-x pb-6 md:hidden">
          <ul className="grid gap-1 border-t border-line pt-4 text-lg">
            {items.map((item) => (
              <li key={item}>
                <Link href={`/#${item}`} onClick={() => setOpen(false)} className="block py-2">
                  {t(item)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/security" onClick={() => setOpen(false)} className="block py-2">
                {t('security')}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
