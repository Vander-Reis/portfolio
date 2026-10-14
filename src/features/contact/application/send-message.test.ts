import { describe, expect, it, vi } from 'vitest'
import { type SendMessageDeps, sendMessage } from './send-message'

const input = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  message: 'Olá! Gostaria de conversar sobre um projeto <b>legado</b>.',
  website: '',
  captchaToken: 'token',
}

function deps(overrides: Partial<SendMessageDeps> = {}): SendMessageDeps {
  return {
    rateLimiter: { limit: vi.fn().mockResolvedValue({ success: true }) },
    captcha: { verify: vi.fn().mockResolvedValue(true) },
    mailer: { send: vi.fn().mockResolvedValue(undefined) },
    ...overrides,
  }
}

describe('sendMessage (caso de uso)', () => {
  it('envia a mensagem sanitizada quando tudo é válido', async () => {
    const d = deps()
    const result = await sendMessage(input, { clientKey: 'ip-hash' }, d)
    expect(result).toEqual({ status: 'success' })
    expect(d.mailer.send).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: 'ana@example.com', message: expect.stringContaining('&lt;b&gt;') }),
    )
  })

  it('finge sucesso para bots (honeypot) sem enviar nada', async () => {
    const d = deps()
    const result = await sendMessage({ ...input, website: 'spam.com' }, { clientKey: 'k' }, d)
    expect(result).toEqual({ status: 'success' })
    expect(d.mailer.send).not.toHaveBeenCalled()
    expect(d.rateLimiter.limit).not.toHaveBeenCalled()
  })

  it('bloqueia quando o rate limit estoura', async () => {
    const d = deps({ rateLimiter: { limit: vi.fn().mockResolvedValue({ success: false }) } })
    const result = await sendMessage(input, { clientKey: 'k' }, d)
    expect(result).toEqual({ status: 'error', code: 'rate_limited' })
    expect(d.mailer.send).not.toHaveBeenCalled()
  })

  it('retorna erros por campo quando a validação falha, sem chamar o captcha', async () => {
    const d = deps()
    const result = await sendMessage({ ...input, email: 'x' }, { clientKey: 'k' }, d)
    expect(result.status).toBe('invalid')
    if (result.status === 'invalid') expect(result.fieldErrors.email).toBeDefined()
    expect(d.captcha.verify).not.toHaveBeenCalled()
  })

  it('rejeita captcha inválido', async () => {
    const d = deps({ captcha: { verify: vi.fn().mockResolvedValue(false) } })
    expect(await sendMessage(input, { clientKey: 'k' }, d)).toEqual({ status: 'error', code: 'captcha' })
  })

  it('não vaza detalhes quando o provedor de e-mail falha', async () => {
    const d = deps({ mailer: { send: vi.fn().mockRejectedValue(new Error('API key ab12 invalid')) } })
    const result = await sendMessage(input, { clientKey: 'k' }, d)
    expect(result).toEqual({ status: 'error', code: 'unavailable' })
    expect(JSON.stringify(result)).not.toContain('ab12')
  })
})
