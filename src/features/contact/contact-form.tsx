'use client'

import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { type ContactState, submitContact } from './actions'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

/** Carrega o Turnstile sob demanda. Permitido pela CSP via 'strict-dynamic'. */
function useTurnstile(siteKey: string | undefined, container: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!siteKey || !container.current) return
    const el = container.current
    const render = () => {
      if (window.turnstile && !el.dataset.rendered) {
        el.dataset.rendered = '1'
        window.turnstile.render(el, { sitekey: siteKey, theme: 'auto', appearance: 'interaction-only' })
      }
    }
    if (window.turnstile) return render()
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = render
    document.head.appendChild(script)
  }, [siteKey, container])
}

const inputClass =
  'mt-2 block w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-ink placeholder:text-muted transition-colors focus:border-ink focus:outline-none aria-[invalid=true]:border-red-500'

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const t = useTranslations('contact')
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)
  const captchaRef = useRef<HTMLDivElement>(null)
  useTurnstile(turnstileSiteKey, captchaRef)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  const fieldError = (f: 'name' | 'email' | 'message') =>
    state.status === 'invalid' && state.fieldErrors[f] ? t(`errors.${state.fieldErrors[f]}`) : undefined

  const field = (name: 'name' | 'email' | 'message', type: string, autoComplete: string) => {
    const error = fieldError(name)
    const Tag = name === 'message' ? 'textarea' : 'input'
    return (
      <div>
        <label htmlFor={`contact-${name}`} className="text-sm font-medium">
          {t(`fields.${name}`)}
        </label>
        <Tag
          id={`contact-${name}`}
          name={name}
          required
          autoComplete={autoComplete}
          {...(Tag === 'input' ? { type } : { rows: 5 })}
          maxLength={name === 'message' ? 5000 : 254}
          placeholder={t(`placeholders.${name}`)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `contact-${name}-error` : undefined}
          className={cn(inputClass, name === 'message' && 'resize-y')}
        />
        {error ? (
          <p id={`contact-${name}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {field('name', 'text', 'name')}
        {field('email', 'email', 'email')}
      </div>
      {field('message', 'text', 'off')}

      {/* Honeypot: invisível para humanos e leitores de tela. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey ? <div ref={captchaRef} /> : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <ArrowUpRight aria-hidden />}
          {pending ? t('sending') : t('submit')}
        </Button>
        <output aria-live="polite" className="text-sm">
          {state.status === 'success' ? (
            <span className="flex items-center gap-1.5 text-ok">
              <Check className="size-4" aria-hidden /> {t('success')}
            </span>
          ) : state.status === 'error' ? (
            <span className="text-red-600 dark:text-red-400">{t(`errors.${state.code}`)}</span>
          ) : null}
        </output>
      </div>
    </form>
  )
}
