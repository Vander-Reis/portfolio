import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'
import { env } from '@/shared/config/env'
import { site } from '@/shared/config/site'
import type { CaptchaVerifier, Mailer, RateLimiter } from '../application/send-message'

/** 3 mensagens a cada 10 minutos por cliente. */
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 3

/** Fallback em memória (dev / sem Upstash). Não é distribuído — apenas por instância. */
export function createMemoryRateLimiter(max = MAX_REQUESTS, windowMs = WINDOW_MS): RateLimiter {
  const hits = new Map<string, number[]>()
  return {
    async limit(key) {
      const now = Date.now()
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
      if (recent.length >= max) return { success: false }
      recent.push(now)
      hits.set(key, recent)
      return { success: true }
    },
  }
}

let rateLimiter: RateLimiter | undefined
export function getRateLimiter(): RateLimiter {
  if (rateLimiter) return rateLimiter
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const upstash = new Ratelimit({
      redis: new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '10 m'),
      prefix: 'portfolio:contact',
    })
    rateLimiter = { limit: (key) => upstash.limit(key) }
  } else {
    rateLimiter = createMemoryRateLimiter()
  }
  return rateLimiter
}

export function getCaptchaVerifier(): CaptchaVerifier {
  const secret = env.TURNSTILE_SECRET_KEY
  return {
    async verify(token) {
      // Sem segredo configurado (dev local) o captcha é desativado.
      if (!secret) return env.NODE_ENV !== 'production'
      if (!token) return false
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret, response: token }),
        cache: 'no-store',
      })
      if (!res.ok) return false
      const data = (await res.json()) as { success?: boolean }
      return data.success === true
    },
  }
}

export function getMailer(): Mailer {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return {
      async send() {
        if (env.NODE_ENV === 'production') throw new Error('mailer_not_configured')
        // Em dev apenas registra que *houve* um envio — nunca o conteúdo ou o e-mail.
        console.warn('[contact] Resend não configurado — envio simulado.')
      },
    }
  }
  const resend = new Resend(RESEND_API_KEY)
  return {
    async send({ name, replyTo, message }) {
      const { error } = await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        replyTo,
        subject: `[${site.shortName}] Nova mensagem de ${name}`,
        // Conteúdo já sanitizado pela camada de aplicação.
        html: `<p><strong>${name}</strong> (${replyTo.replace(/[<>"']/g, '')})</p><p style="white-space:pre-wrap">${message}</p>`,
      })
      if (error) throw new Error('mail_failed')
    },
  }
}

/** Chave anônima por cliente: hash SHA-256 do IP (o IP em si nunca é armazenado). */
export async function clientKeyFrom(headers: Headers): Promise<string> {
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`contact:${ip}`))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}
