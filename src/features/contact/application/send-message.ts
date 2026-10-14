import { type ContactField, contactSchema, isBot, sanitizeText } from '../domain/contact'

/** Portas — a camada de aplicação não conhece Upstash, Turnstile nem Resend. */
export interface RateLimiter {
  limit(key: string): Promise<{ success: boolean }>
}
export interface CaptchaVerifier {
  verify(token: string | undefined): Promise<boolean>
}
export interface Mailer {
  send(mail: { name: string; replyTo: string; message: string }): Promise<void>
}

export type SendMessageDeps = { rateLimiter: RateLimiter; captcha: CaptchaVerifier; mailer: Mailer }

export type SendMessageInput = {
  name?: unknown
  email?: unknown
  message?: unknown
  website?: string | null
  captchaToken?: string
}

export type SendMessageResult =
  | { status: 'success' }
  | { status: 'invalid'; fieldErrors: Partial<Record<ContactField, string>> }
  | { status: 'error'; code: 'rate_limited' | 'captcha' | 'unavailable' }

export async function sendMessage(
  input: SendMessageInput,
  ctx: { clientKey: string },
  deps: SendMessageDeps,
): Promise<SendMessageResult> {
  // 1. Bots recebem "sucesso" para não aprenderem a contornar o honeypot.
  if (isBot(input)) return { status: 'success' }

  // 2. Rate limit antes de qualquer trabalho caro.
  const { success } = await deps.rateLimiter.limit(ctx.clientKey)
  if (!success) return { status: 'error', code: 'rate_limited' }

  // 3. Validação no servidor (nunca confiar no cliente).
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField
      fieldErrors[field] ??= issue.message
    }
    return { status: 'invalid', fieldErrors }
  }

  // 4. Captcha.
  if (!(await deps.captcha.verify(input.captchaToken))) return { status: 'error', code: 'captcha' }

  // 5. Envio com conteúdo sanitizado. Erros do provedor não vazam para o cliente.
  try {
    await deps.mailer.send({
      name: sanitizeText(parsed.data.name),
      replyTo: parsed.data.email,
      message: sanitizeText(parsed.data.message),
    })
    return { status: 'success' }
  } catch {
    return { status: 'error', code: 'unavailable' }
  }
}
