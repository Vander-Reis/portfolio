import { describe, expect, it } from 'vitest'
import { buildCsp, createNonce, redactNonce, securityHeaders } from './csp'

const directive = (csp: string, name: string) =>
  csp
    .split('; ')
    .find((d) => d.startsWith(`${name} `) || d === name)
    ?.split(' ')
    .slice(1) ?? null

describe('buildCsp', () => {
  const prod = buildCsp({ nonce: 'abc123', isDev: false })

  it('script-src usa nonce + strict-dynamic e nunca unsafe-inline', () => {
    const script = directive(prod, 'script-src')
    expect(script).toContain("'nonce-abc123'")
    expect(script).toContain("'strict-dynamic'")
    expect(script).not.toContain("'unsafe-inline'")
    expect(script).not.toContain("'unsafe-eval'")
  })

  it('style-src (elementos) não permite unsafe-inline', () => {
    expect(directive(prod, 'style-src')).not.toContain("'unsafe-inline'")
  })

  it('bloqueia framing, plugins e base-uri', () => {
    expect(directive(prod, 'frame-ancestors')).toEqual(["'none'"])
    expect(directive(prod, 'object-src')).toEqual(["'none'"])
    expect(directive(prod, 'base-uri')).toEqual(["'none'"])
    expect(directive(prod, 'form-action')).toEqual(["'self'"])
  })

  it('força HTTPS em produção', () => {
    expect(prod).toContain('upgrade-insecure-requests')
  })

  it('libera unsafe-eval e websocket apenas em dev (HMR)', () => {
    const dev = buildCsp({ nonce: 'x', isDev: true })
    expect(directive(dev, 'script-src')).toContain("'unsafe-eval'")
    expect(directive(dev, 'connect-src')).toContain('ws:')
    expect(dev).not.toContain('upgrade-insecure-requests')
  })

  it('nunca relaxa script-src em dev além de unsafe-eval', () => {
    const dev = buildCsp({ nonce: 'x', isDev: true })
    expect(directive(dev, 'script-src')).not.toContain("'unsafe-inline'")
    expect(directive(dev, 'script-src')).toContain("'nonce-x'")
  })
})

describe('createNonce', () => {
  it('gera valores base64 únicos de 128 bits', () => {
    const a = createNonce()
    const b = createNonce()
    expect(a).not.toBe(b)
    expect(atob(a)).toHaveLength(16)
  })
})

describe('redactNonce', () => {
  it('oculta o nonce ao exibir a política', () => {
    expect(redactNonce(buildCsp({ nonce: 'segredo', isDev: false }))).not.toContain('segredo')
  })
})

describe('securityHeaders', () => {
  it('inclui HSTS com preload de 2 anos', () => {
    expect(securityHeaders['Strict-Transport-Security']).toBe('max-age=63072000; includeSubDomains; preload')
  })

  it('inclui COOP, CORP, nosniff e Referrer-Policy', () => {
    expect(securityHeaders).toMatchObject({
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    })
  })
})
